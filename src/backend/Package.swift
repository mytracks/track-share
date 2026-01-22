// swift-tools-version:6.0
import PackageDescription

let package = Package(
    name: "TrackShareBackend",
    platforms: [
        .macOS(.v13)
    ],
    dependencies: [
        // Vapor framework for web server
        .package(url: "https://github.com/vapor/vapor.git", from: "4.99.0"),
        // PostgreSQL driver
        .package(url: "https://github.com/vapor/fluent-postgres-driver.git", from: "2.0.0"),
        // Fluent ORM
        .package(url: "https://github.com/vapor/fluent.git", from: "4.0.0"),
    ],
    targets: [
        .executableTarget(
            name: "App",
            dependencies: [
                .product(name: "Vapor", package: "vapor"),
                .product(name: "Fluent", package: "fluent"),
                .product(name: "FluentPostgresDriver", package: "fluent-postgres-driver"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("ExistentialAny")
            ]
        )
    ]
)
