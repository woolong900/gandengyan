import Foundation

enum APIClientError: LocalizedError {
    case invalidResponse
    case server(String)

    var errorDescription: String? {
        switch self {
        case .invalidResponse: return "服务器响应无效"
        case .server(let message): return message
        }
    }
}

struct APIClient {
    private let decoder = JSONDecoder()

    func rooms() async throws -> RoomPage {
        try await request("/rooms?limit=100")
    }

    func room(_ id: Int) async throws -> RoomDetail {
        try await request("/rooms/\(id)")
    }

    func appendCard(room: Int, uid: Int, card: Int) async throws {
        let _: DrawPlanEnvelope = try await request("/rooms/\(room)/draw-plan/card", method: "POST",
            body: ["uid": uid, "card": card])
    }

    func moveCard(room: Int, uid: Int, from: Int, to: Int) async throws {
        let _: DrawPlanEnvelope = try await request("/rooms/\(room)/draw-plan/move", method: "POST",
            body: ["uid": uid, "from": from, "to": to])
    }

    func removeCard(room: Int, uid: Int, index: Int) async throws {
        let _: DrawPlanEnvelope = try await request("/rooms/\(room)/draw-plan/remove", method: "POST",
            body: ["uid": uid, "index": index])
    }

    func clearDrawPlan(room: Int) async throws {
        let _: ClearEnvelope = try await request("/rooms/\(room)/draw-plan", method: "DELETE")
    }

    func setWSKHand(room: Int, uid: Int, counts: [String: Int]) async throws {
        let payload: [String: Any] = ["uid": uid, "counts": counts]
        let _: WSKEnvelope = try await request("/rooms/\(room)/next-wsk-hand", method: "POST", body: payload)
    }

    func clearWSKHand(room: Int) async throws {
        let _: ClearEnvelope = try await request("/rooms/\(room)/next-wsk-hand", method: "DELETE")
    }

    private func request<T: Decodable>(_ path: String, method: String = "GET", body: Any? = nil) async throws -> T {
        guard let url = URL(string: GeneratedSecrets.baseURL + "/admin/api" + path) else {
            throw APIClientError.invalidResponse
        }
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.timeoutInterval = 12
        request.setValue("Bearer \(GeneratedSecrets.mobileToken)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        if let body {
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            request.httpBody = try JSONSerialization.data(withJSONObject: body)
        }
        let (data, response) = try await URLSession.shared.data(for: request)
        guard let http = response as? HTTPURLResponse else { throw APIClientError.invalidResponse }
        guard 200..<300 ~= http.statusCode else {
            let message = (try? decoder.decode(APIErrorBody.self, from: data).error) ?? "请求失败（\(http.statusCode)）"
            throw APIClientError.server(message)
        }
        return try decoder.decode(T.self, from: data)
    }
}

private struct DrawPlanEnvelope: Decodable { let roomId: Int; let drawPlan: DrawPlan }
private struct WSKEnvelope: Decodable { let roomId: Int; let nextWskHandPlan: WSKHandPlan }
private struct ClearEnvelope: Decodable { let roomId: Int }

@MainActor
final class RoomStore: ObservableObject {
    @Published var rooms: [RoomSummary] = []
    @Published var currentRoom: RoomDetail?
    @Published var loading = false
    @Published var working = false
    @Published var errorMessage: String?
    private let api = APIClient()

    func loadRooms() async {
        loading = rooms.isEmpty
        defer { loading = false }
        do {
            rooms = try await api.rooms().items
            errorMessage = nil
        } catch {
            present(error)
        }
    }

    func loadRoom(_ id: Int, quiet: Bool = false) async {
        if !quiet { loading = currentRoom == nil }
        defer { loading = false }
        do {
            currentRoom = try await api.room(id)
            errorMessage = nil
        } catch {
            present(error)
        }
    }

    func perform(room id: Int, _ operation: (APIClient) async throws -> Void) async {
        guard !working else { return }
        working = true
        defer { working = false }
        do {
            try await operation(api)
            currentRoom = try await api.room(id)
            errorMessage = nil
        } catch {
            present(error)
        }
    }

    private func present(_ error: Error) {
        if error is CancellationError { return }
        if let urlError = error as? URLError, urlError.code == .cancelled { return }
        let nsError = error as NSError
        if nsError.domain == NSURLErrorDomain && nsError.code == NSURLErrorCancelled { return }
        errorMessage = error.localizedDescription
    }
}
