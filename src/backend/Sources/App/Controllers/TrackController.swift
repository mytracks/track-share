import Vapor

struct UploadTrackRequest: Content {
    let identifier: String
    let gpxContent: String
}

struct UploadTrackResponse: Content {
    let success: Bool
    let message: String
    let identifier: String?
}

struct TrackController: RouteCollection {
    func boot(routes: RoutesBuilder) throws {
        let tracks = routes.grouped("api", "tracks")
        
        // Upload or update track endpoint
        tracks.post("upload", use: uploadTrack)
    }
    
    func uploadTrack(req: Request) async throws -> Response {
        let uploadRequest = try req.content.decode(UploadTrackRequest.self)
        
        // Validate identifier length
        guard uploadRequest.identifier.count > 0 && uploadRequest.identifier.count <= 256 else {
            let response = UploadTrackResponse(
                success: false,
                message: "Identifier must be between 1 and 256 characters",
                identifier: nil
            )
            return try await response.encodeResponse(status: .badRequest, for: req)
        }
        
        // Validate GPX content is not empty
        guard !uploadRequest.gpxContent.isEmpty else {
            let response = UploadTrackResponse(
                success: false,
                message: "GPX content cannot be empty",
                identifier: nil
            )
            return try await response.encodeResponse(status: .badRequest, for: req)
        }
        
        // Check if track with this identifier already exists
        if let existingTrack = try await Track.query(on: req.db)
            .filter(\.$identifier == uploadRequest.identifier)
            .first() {
            // Update existing track
            existingTrack.gpxContent = uploadRequest.gpxContent
            try await existingTrack.update(on: req.db)
            
            let response = UploadTrackResponse(
                success: true,
                message: "Track updated successfully",
                identifier: uploadRequest.identifier
            )
            return try await response.encodeResponse(status: .ok, for: req)
        } else {
            // Create new track
            let track = Track(
                identifier: uploadRequest.identifier,
                gpxContent: uploadRequest.gpxContent
            )
            try await track.save(on: req.db)
            
            let response = UploadTrackResponse(
                success: true,
                message: "Track uploaded successfully",
                identifier: uploadRequest.identifier
            )
            return try await response.encodeResponse(status: .created, for: req)
        }
    }
}
