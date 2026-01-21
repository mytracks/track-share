import Fluent
import Vapor

final class Track: Model, Content, @unchecked Sendable {
    static let schema = "tracks"
    
    @ID(key: .id)
    var id: UUID?
    
    @Field(key: "identifier")
    var identifier: String
    
    @Field(key: "gpx_content")
    var gpxContent: String
    
    @Timestamp(key: "uploaded_at", on: .create)
    var uploadedAt: Date?
    
    @Timestamp(key: "updated_at", on: .update)
    var updatedAt: Date?
    
    init() { }
    
    init(id: UUID? = nil, identifier: String, gpxContent: String) {
        self.id = id
        self.identifier = identifier
        self.gpxContent = gpxContent
    }
}
