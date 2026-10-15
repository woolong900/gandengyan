import Foundation

struct RoomPage: Decodable {
    let items: [RoomSummary]
    let total: Int
}

struct RoomSummary: Decodable, Identifiable, Hashable {
    var id: Int { roomId }
    let roomId: Int
    let clubId: Int
    let gameType: Int
    let step: Int
    let totalStep: Int
    let status: String
    let occupied: Int
    let maxPlayers: Int
    let botCount: Int
}

struct RoomDetail: Decodable {
    let roomId: Int
    let clubId: Int
    let gameType: Int
    let step: Int
    let totalStep: Int
    let status: String
    let occupied: Int
    let maxPlayers: Int
    let members: [RoomMember]
    let wall: RoomWall?
    let nextWskHandPlan: WSKHandPlan?
}

struct RoomMember: Decodable, Identifiable {
    var id: Int { uid }
    let uid: Int
    let nickname: String
    let avatarUrl: String
    let hand: [Int]
    let drawnCard: Int?
    let site: Int
    let score: Double
    let bot: Bool
    let spectator: Bool
    let online: Bool
    let trustee: Bool
}

struct RoomWall: Decodable {
    let remaining: Int
    let cards: [Int]
    let drawPlan: DrawPlan?
}

struct DrawPlan: Decodable {
    let uid: Int
    let cards: [Int]
    let delivered: Int
    let total: Int
}

struct WSKHandPlan: Decodable {
    let uid: Int
    let counts: [String: Int]
    let total: Int
}

struct APIErrorBody: Decodable { let error: String }

struct EmptyResponse: Decodable {}
