import Vapor
import Fluent
import FluentPostgresDriver

public func configure(_ app: Application) async throws {
    // Configure database
    if let databaseURL = Environment.get("DATABASE_URL") {
        try app.databases.use(.postgres(url: databaseURL), as: .psql)
    } else {
        // Fallback configuration for local development
        app.databases.use(
            .postgres(
                hostname: Environment.get("DB_HOST") ?? "localhost",
                port: Environment.get("DB_PORT").flatMap(Int.init(_:)) ?? 5432,
                username: Environment.get("DB_USER") ?? "trackshare",
                password: Environment.get("DB_PASSWORD") ?? "trackshare",
                database: Environment.get("DB_NAME") ?? "trackshare"
            ),
            as: .psql
        )
    }
    
    // Add migrations
    app.migrations.add(CreateTrack())
    
    // Run migrations automatically
    try await app.autoMigrate()
    
    // Register routes
    try routes(app)
}
