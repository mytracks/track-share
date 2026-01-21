import Vapor

func routes(_ app: Application) throws {
    app.get { req async in
        return "TrackShare Backend API is running"
    }

    app.get("health") { req async in
        return ["status": "healthy"]
    }

    try app.register(collection: TrackController())
}
