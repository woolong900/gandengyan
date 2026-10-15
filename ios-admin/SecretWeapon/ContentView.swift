import SwiftUI
import UIKit

private let panel = Color(red: 0.075, green: 0.10, blue: 0.15)
private let panelRaised = Color(red: 0.105, green: 0.14, blue: 0.20)
private let accent = Color(red: 0.18, green: 0.72, blue: 0.93)

struct ContentView: View {
    @EnvironmentObject private var store: RoomStore
    @State private var selectedRoom: Int?

    var body: some View {
        ZStack {
            LinearGradient(colors: [.black, Color(red: 0.035, green: 0.075, blue: 0.12)],
                           startPoint: .topLeading, endPoint: .bottomTrailing).ignoresSafeArea()
            if let roomID = selectedRoom {
                RoomDetailView(roomID: roomID) { selectedRoom = nil }
            } else {
                RoomListView { selectedRoom = $0 }
            }
        }
        .alert("提示", isPresented: Binding(get: { store.errorMessage != nil }, set: { if !$0 { store.errorMessage = nil } })) {
            Button("知道了", role: .cancel) { store.errorMessage = nil }
        } message: { Text(store.errorMessage ?? "") }
    }
}

struct RoomListView: View {
    @EnvironmentObject private var store: RoomStore
    let onSelect: (Int) -> Void
    private let columns = [GridItem(.adaptive(minimum: 240), spacing: 16)]

    var body: some View {
        VStack(spacing: 0) {
            HStack {
                VStack(alignment: .leading, spacing: 3) {
                    Text("秘密武器").font(.system(size: 25, weight: .black, design: .rounded))
                    Text("房间列表 · 已自动安全登录").font(.caption).foregroundStyle(.secondary)
                }
                Spacer()
                Text("\(store.rooms.count) 个房间")
                    .font(.subheadline.bold()).padding(.horizontal, 12).padding(.vertical, 7)
                    .background(accent.opacity(0.15), in: Capsule()).foregroundStyle(accent)
                Button { Task { await store.loadRooms() } } label: {
                    Image(systemName: "arrow.clockwise").font(.headline)
                }.buttonStyle(.bordered)
            }.padding(.horizontal, 24).padding(.vertical, 15)
            Divider().overlay(Color.white.opacity(0.12))
            Group {
                if store.loading && store.rooms.isEmpty { ProgressView("正在读取房间…") }
                else if store.rooms.isEmpty {
                    ContentUnavailableView("暂无房间", systemImage: "rectangle.stack", description: Text("有玩家创建房间后会自动显示"))
                } else {
                    ScrollView {
                        LazyVGrid(columns: columns, spacing: 16) {
                            ForEach(store.rooms) { room in
                                Button { onSelect(room.roomId) } label: { RoomCard(room: room) }
                                    .buttonStyle(.plain)
                            }
                        }.padding(24)
                    }.refreshable { await store.loadRooms() }
                }
            }.frame(maxWidth: .infinity, maxHeight: .infinity)
        }
        .task {
            await store.loadRooms()
            while !Task.isCancelled {
                do {
                    try await Task.sleep(for: .seconds(4))
                } catch {
                    break
                }
                guard !Task.isCancelled else { break }
                await store.loadRooms()
            }
        }
    }
}

private struct RoomCard: View {
    let room: RoomSummary
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("#\(room.roomId)").font(.system(.title2, design: .monospaced, weight: .bold))
                Spacer()
                Text(room.status).font(.caption.bold()).foregroundStyle(room.status == "进行中" ? .green : .orange)
            }
            HStack(spacing: 18) {
                Label("\(room.occupied)/\(room.maxPlayers)", systemImage: "person.2.fill")
                Label("\(room.step)/\(room.totalStep) 局", systemImage: "flag.checkered")
                if room.botCount > 0 { Label("\(room.botCount)", systemImage: "cpu") }
            }.font(.subheadline).foregroundStyle(.secondary)
            Text(room.clubId == 0 ? "普通房" : "俱乐部 #\(room.clubId)")
                .font(.caption).foregroundStyle(accent)
        }
        .padding(17).frame(maxWidth: .infinity, alignment: .leading)
        .background(panelRaised, in: RoundedRectangle(cornerRadius: 18))
        .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color.white.opacity(0.08)))
    }
}

struct RoomDetailView: View {
    @EnvironmentObject private var store: RoomStore
    let roomID: Int
    let onBack: () -> Void
    @State private var selectedUID: Int?
    @State private var wskCounts: [String: Int] = [:]
    @State private var wskDirty = false

    var body: some View {
        VStack(spacing: 0) {
            detailHeader
            Divider().overlay(Color.white.opacity(0.12))
            if let room = store.currentRoom, room.roomId == roomID {
                GeometryReader { proxy in
                    HStack(spacing: 0) {
                        PlayerPane(room: room, selectedUID: selectedUID) { selectPlayer($0, room: room) }
                            .frame(width: proxy.size.width * 0.44)
                        Divider().overlay(Color.white.opacity(0.13))
                        if room.gameType == 17 {
                            WSKPlanPane(room: room, selectedUID: selectedUID, counts: $wskCounts,
                                        dirty: $wskDirty, save: saveWSK, clear: clearWSK)
                        } else {
                            MahjongPlanPane(room: room, selectedUID: selectedUID,
                                             append: appendCard, remove: removeCard, move: moveCard, clear: clearPlan)
                        }
                    }
                }
            } else { ProgressView("正在进入房间…").frame(maxWidth: .infinity, maxHeight: .infinity) }
        }
        .task(id: roomID) {
            store.currentRoom = nil
            await store.loadRoom(roomID)
            syncSelection(force: true)
            while !Task.isCancelled {
                do {
                    try await Task.sleep(for: .seconds(2.5))
                } catch {
                    break
                }
                guard !Task.isCancelled else { break }
                await store.loadRoom(roomID, quiet: true)
                syncSelection(force: false)
            }
        }
    }

    private var detailHeader: some View {
        HStack(spacing: 14) {
            Button(action: onBack) { Label("房间列表", systemImage: "chevron.left") }.buttonStyle(.bordered)
            if let room = store.currentRoom {
                Text("房间 #\(room.roomId)").font(.title3.bold())
                Text(room.status).font(.caption.bold()).foregroundStyle(room.status == "进行中" ? .green : .orange)
                Text("第 \(room.step)/\(room.totalStep) 局 · \(room.occupied)/\(room.maxPlayers) 人")
                    .font(.subheadline).foregroundStyle(.secondary)
            }
            Spacer()
            if store.working { ProgressView().controlSize(.small) }
            Button { Task { await store.loadRoom(roomID); syncSelection(force: false) } } label: {
                Image(systemName: "arrow.clockwise")
            }.buttonStyle(.bordered)
        }.padding(.horizontal, 16).padding(.vertical, 10)
    }

    private func syncSelection(force: Bool) {
        guard let room = store.currentRoom else { return }
        let planned = room.gameType == 17 ? room.nextWskHandPlan?.uid : room.wall?.drawPlan?.uid
        if force || selectedUID == nil || !room.members.contains(where: { $0.uid == selectedUID && !$0.spectator }) {
            selectedUID = planned ?? room.members.first(where: { !$0.spectator })?.uid
        }
        if room.gameType == 17 && (!wskDirty || force) { wskCounts = room.nextWskHandPlan?.counts ?? [:] }
    }

    private func selectPlayer(_ uid: Int, room: RoomDetail) {
        if uid == selectedUID { return }
        selectedUID = uid
        if room.gameType == 17 { wskCounts = [:]; wskDirty = true }
        else if room.wall?.drawPlan != nil { Task { await store.perform(room: roomID) { try await $0.clearDrawPlan(room: roomID) } } }
    }
    private func appendCard(_ card: Int) { guard let uid = selectedUID else { return }; Task { await store.perform(room: roomID) { try await $0.appendCard(room: roomID, uid: uid, card: card) } } }
    private func removeCard(_ index: Int) { guard let uid = selectedUID else { return }; Task { await store.perform(room: roomID) { try await $0.removeCard(room: roomID, uid: uid, index: index) } } }
    private func moveCard(_ from: Int, _ to: Int) { guard let uid = selectedUID else { return }; Task { await store.perform(room: roomID) { try await $0.moveCard(room: roomID, uid: uid, from: from, to: to) } } }
    private func clearPlan() { Task { await store.perform(room: roomID) { try await $0.clearDrawPlan(room: roomID) } } }
    private func saveWSK() { guard let uid = selectedUID else { return }; let draft = wskCounts; Task { await store.perform(room: roomID) { try await $0.setWSKHand(room: roomID, uid: uid, counts: draft) }; wskDirty = false } }
    private func clearWSK() { Task { await store.perform(room: roomID) { try await $0.clearWSKHand(room: roomID) }; wskCounts = [:]; wskDirty = false } }
}

private struct PlayerPane: View {
    let room: RoomDetail
    let selectedUID: Int?
    let select: (Int) -> Void
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Label("玩家手牌", systemImage: "person.2.cards.fill").font(.headline).padding(14)
            ScrollView {
                LazyVStack(spacing: 10) {
                    ForEach(room.members) { member in
                        Button { if !member.spectator { select(member.uid) } } label: {
                            PlayerCard(member: member, isPoker: room.gameType == 17,
                                       selected: member.uid == selectedUID)
                        }.buttonStyle(.plain).disabled(member.spectator)
                    }
                }.padding(.horizontal, 12).padding(.bottom, 14)
            }
        }.background(panel.opacity(0.74))
    }
}

private struct PlayerCard: View {
    let member: RoomMember
    let isPoker: Bool
    let selected: Bool
    var body: some View {
        VStack(alignment: .leading, spacing: 9) {
            HStack(spacing: 9) {
                AsyncImage(url: URL(string: member.avatarUrl)) { image in image.resizable().scaledToFill() }
                    placeholder: { Circle().fill(accent.opacity(0.2)).overlay(Text(String(member.nickname.prefix(1))).bold()) }
                    .frame(width: 34, height: 34).clipShape(Circle())
                VStack(alignment: .leading, spacing: 2) {
                    Text(member.nickname).font(.subheadline.bold()).lineLimit(1)
                    Text("座位 \(member.site) · ID \(member.uid) · \(formatScore(member.score))分")
                        .font(.system(size: 10)).foregroundStyle(.secondary)
                }
                Spacer()
                Text(member.bot ? "机器人" : member.online ? "在线" : "离线")
                    .font(.system(size: 10, weight: .bold)).foregroundStyle(member.online ? .green : .secondary)
            }
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 3) {
                    if member.hand.isEmpty { Text(roomHandPlaceholder).font(.caption).foregroundStyle(.secondary).padding(.vertical, 12) }
                    ForEach(Array(member.hand.enumerated()), id: \.offset) { index, card in
                        GameCardView(card: card, poker: isPoker,
                                     drawn: member.drawnCard != nil && index == member.hand.count - 1)
                    }
                }
            }
        }
        .padding(11).background(selected ? accent.opacity(0.13) : panelRaised, in: RoundedRectangle(cornerRadius: 13))
        .overlay(RoundedRectangle(cornerRadius: 13).stroke(selected ? accent : Color.white.opacity(0.07), lineWidth: selected ? 2 : 1))
    }
    private var roomHandPlaceholder: String { member.spectator ? "观战玩家" : "尚未开局或暂无手牌" }
    private func formatScore(_ score: Double) -> String { score.rounded() == score ? String(Int(score)) : String(format: "%.1f", score) }
}

private struct MahjongPlanPane: View {
    let room: RoomDetail
    let selectedUID: Int?
    let append: (Int) -> Void
    let remove: (Int) -> Void
    let move: (Int, Int) -> Void
    let clear: () -> Void
    private var plan: [Int] { room.wall?.drawPlan?.cards ?? [] }
    private var groupedCards: [(Int, Int)] {
        let all = Dictionary(grouping: room.wall?.cards ?? [], by: { $0 }).mapValues(\.count)
        let used = Dictionary(grouping: plan, by: { $0 }).mapValues(\.count)
        return all.keys.sorted().map { ($0, max(0, (all[$0] ?? 0) - (used[$0] ?? 0))) }
    }
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack {
                Label("选择下一轮摸牌", systemImage: "hand.tap.fill").font(.headline)
                Spacer()
                Text(targetName).font(.caption.bold()).foregroundStyle(accent)
            }.padding(14)
            if let wall = room.wall {
                ScrollView {
                    VStack(alignment: .leading, spacing: 14) {
                        Text("剩余牌堆 \(wall.remaining) 张 · 点击牌面立即生效").font(.caption).foregroundStyle(.secondary)
                        LazyVGrid(columns: [GridItem(.adaptive(minimum: 62), spacing: 9)], spacing: 11) {
                            ForEach(groupedCards, id: \.0) { card, count in
                                Button { append(card) } label: {
                                    VStack(spacing: 4) { GameCardView(card: card, poker: false, drawn: false); Text("可选 \(count)").font(.system(size: 9)) }
                                }.buttonStyle(.plain).disabled(count == 0 || selectedUID == nil)
                                    .opacity(count == 0 ? 0.3 : 1)
                            }
                        }
                        Divider().overlay(Color.white.opacity(0.12))
                        HStack { Text("已指定牌序").font(.headline); Spacer(); Text("\(plan.count) 张").font(.caption).foregroundStyle(.secondary) }
                        if plan.isEmpty { Text("尚未选择；未指定部分保持随机。").font(.caption).foregroundStyle(.secondary) }
                        else {
                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 8) {
                                    ForEach(Array(plan.enumerated()), id: \.offset) { index, card in
                                        VStack(spacing: 4) {
                                            Text("\(index + 1)").font(.system(size: 9, weight: .black)).foregroundStyle(accent)
                                            GameCardView(card: card, poker: false, drawn: false)
                                            HStack(spacing: 2) {
                                                miniButton("arrow.left", disabled: index == 0) { move(index, index - 1) }
                                                miniButton("xmark", disabled: false) { remove(index) }
                                                miniButton("arrow.right", disabled: index == plan.count - 1) { move(index, index + 1) }
                                            }
                                        }.padding(6).background(Color.black.opacity(0.18), in: RoundedRectangle(cornerRadius: 9))
                                    }
                                }
                            }
                            Button(role: .destructive, action: clear) { Label("清空指定牌序", systemImage: "trash") }.buttonStyle(.bordered)
                        }
                    }.padding(.horizontal, 14).padding(.bottom, 18)
                }
            } else {
                ContentUnavailableView("尚未开局", systemImage: "clock", description: Text("牌局开始后即可选择摸牌顺序"))
            }
        }.frame(maxWidth: .infinity).background(panelRaised.opacity(0.42))
    }
    private var targetName: String { room.members.first(where: { $0.uid == selectedUID })?.nickname ?? "请在左侧选择玩家" }
    private func miniButton(_ icon: String, disabled: Bool, action: @escaping () -> Void) -> some View {
        Button(action: action) { Image(systemName: icon).font(.system(size: 9, weight: .bold)).frame(width: 22, height: 20) }
            .buttonStyle(.borderless).disabled(disabled).opacity(disabled ? 0.25 : 1)
    }
}

private struct WSKPlanPane: View {
    let room: RoomDetail
    let selectedUID: Int?
    @Binding var counts: [String: Int]
    @Binding var dirty: Bool
    let save: () -> Void
    let clear: () -> Void
    private let ranks = [("3", "3", 8), ("4", "4", 8), ("5", "5", 8), ("6", "6", 8), ("7", "7", 8), ("8", "8", 8), ("9", "9", 8), ("10", "10", 8), ("11", "J", 8), ("12", "Q", 8), ("13", "K", 8), ("14", "A", 8), ("15", "2", 8), ("joker", "鬼", 4)]
    private var total: Int { counts.values.reduce(0, +) }
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack { Label("指定下一局起手牌", systemImage: "rectangle.stack.fill").font(.headline); Spacer(); Text(targetName).font(.caption.bold()).foregroundStyle(accent) }.padding(14)
            ScrollView {
                VStack(alignment: .leading, spacing: 12) {
                    Text("点击 + / − 调整牌面数量；未指定部分保持随机。已选 \(total) 张。")
                        .font(.caption).foregroundStyle(.secondary)
                    LazyVGrid(columns: [GridItem(.adaptive(minimum: 132), spacing: 9)], spacing: 9) {
                        ForEach(ranks, id: \.0) { key, label, maximum in
                            HStack {
                                PokerRankView(label: label)
                                Spacer()
                                Button { change(key, by: -1, max: maximum) } label: { Image(systemName: "minus.circle.fill") }.disabled((counts[key] ?? 0) == 0)
                                Text("\(counts[key] ?? 0)").monospacedDigit().frame(width: 18)
                                Button { change(key, by: 1, max: maximum) } label: { Image(systemName: "plus.circle.fill") }.disabled((counts[key] ?? 0) >= maximum)
                            }.padding(9).background(panel, in: RoundedRectangle(cornerRadius: 11))
                        }
                    }
                    HStack {
                        Button(action: save) { Label("保存到下一局", systemImage: "checkmark.shield.fill") }.buttonStyle(.borderedProminent)
                            .disabled(selectedUID == nil || total == 0 || total > 27)
                        Button(role: .destructive, action: clear) { Label("恢复随机", systemImage: "trash") }.buttonStyle(.bordered)
                    }
                }.padding(.horizontal, 14).padding(.bottom, 18)
            }
        }.frame(maxWidth: .infinity).background(panelRaised.opacity(0.42))
    }
    private var targetName: String { room.members.first(where: { $0.uid == selectedUID })?.nickname ?? "请在左侧选择玩家" }
    private func change(_ key: String, by delta: Int, max maximum: Int) { counts[key] = min(maximum, max(0, (counts[key] ?? 0) + delta)); if counts[key] == 0 { counts.removeValue(forKey: key) }; dirty = true }
}

private struct PokerRankView: View {
    let label: String
    var body: some View { ZStack { RoundedRectangle(cornerRadius: 6).fill(.white); Text(label).font(.system(size: 17, weight: .black, design: .serif)).foregroundStyle(label == "鬼" ? .purple : .red) }.frame(width: 36, height: 48).shadow(radius: 1) }
}

private struct GameCardView: View {
    let card: Int
    let poker: Bool
    let drawn: Bool
    var body: some View {
        Group { if poker { PokerCardView(card: card) } else { MahjongTileView(card: card) } }
            .overlay(alignment: .topTrailing) { if drawn { Circle().fill(.orange).frame(width: 7, height: 7).offset(x: 2, y: -2) } }
            .padding(.leading, drawn ? 5 : 0)
    }
}

private struct MahjongTileView: View {
    let card: Int
    var body: some View {
        ZStack {
            // A slightly offset green back gives the tile a solid, three-dimensional edge.
            RoundedRectangle(cornerRadius: 6, style: .continuous)
                .fill(Color(red: 0.10, green: 0.43, blue: 0.30))
                .offset(y: 2.5)

            RoundedRectangle(cornerRadius: 6, style: .continuous)
                .fill(
                    LinearGradient(
                        colors: [Color.white, Color(red: 0.96, green: 0.95, blue: 0.89)],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
                .overlay {
                    RoundedRectangle(cornerRadius: 6, style: .continuous)
                        .stroke(Color(red: 0.12, green: 0.24, blue: 0.20).opacity(0.8), lineWidth: 1.1)
                }
                .overlay {
                    RoundedRectangle(cornerRadius: 4.5, style: .continuous)
                        .stroke(.white.opacity(0.9), lineWidth: 0.7)
                        .padding(1.5)
                }

            if let image = tileImage(card) {
                Image(uiImage: image)
                    .resizable()
                    .scaledToFit()
                    .padding(.horizontal, 2)
                    .padding(.vertical, 3)
            } else {
                Text("\(card)")
                    .font(.system(size: 13, weight: .bold, design: .rounded))
                    .foregroundStyle(.black)
            }
        }
        .frame(width: 41, height: 56)
        .shadow(color: .black.opacity(0.42), radius: 2.5, x: 0, y: 2)
    }
    private func tileImage(_ card: Int) -> UIImage? {
        let suit = card / 10, point = card % 10
        guard (0...2).contains(suit), (1...9).contains(point),
              let path = Bundle.main.path(forResource: "mj_\(suit)_\(point)", ofType: "png", inDirectory: "Tiles") else { return nil }
        return UIImage(contentsOfFile: path)
    }
}

private struct PokerCardView: View {
    let card: Int
    private var parts: (String, String, Bool) {
        if card == 170 { return ("小", "★", false) }
        if card == 180 { return ("大", "★", true) }
        let value = card / 10, suit = card % 10
        let rank = [1: "A", 11: "J", 12: "Q", 13: "K"][value] ?? "\(value)"
        let symbol = [1: "♦", 2: "♣", 3: "♥", 4: "♠"][suit] ?? "?"
        return (rank, symbol, suit == 1 || suit == 3)
    }
    var body: some View {
        let value = parts
        RoundedRectangle(cornerRadius: 5).fill(.white).frame(width: 34, height: 48)
            .overlay(VStack(spacing: -2) { Text(value.0).font(.system(size: 12, weight: .black, design: .serif)); Text(value.1).font(.system(size: 16)) }.foregroundStyle(value.2 ? .red : .black))
            .shadow(color: .black.opacity(0.25), radius: 2, y: 1)
    }
}
