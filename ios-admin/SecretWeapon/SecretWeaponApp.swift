import SwiftUI

@main
struct SecretWeaponApp: App {
    @StateObject private var store = RoomStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(store)
                .preferredColorScheme(.dark)
        }
    }
}
