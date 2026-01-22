import Fluent

struct CreateTrack: AsyncMigration {
    func prepare(on database: any Database) async throws {
        try await database.schema("tracks")
            .id()
            .field("identifier", .string, .required)
            .field("gpx_content", .string, .required)
            .field("uploaded_at", .datetime, .required)
            .field("updated_at", .datetime, .required)
            .unique(on: "identifier")
            .create()
    }

    func revert(on database: any Database) async throws {
        try await database.schema("tracks").delete()
    }
}
