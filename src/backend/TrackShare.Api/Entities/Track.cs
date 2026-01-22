using System.ComponentModel.DataAnnotations;

namespace TrackShare.Api.Entities;

/// <summary>
/// Represents a GPS track that has been uploaded to the system.
/// </summary>
public class Track
{
    /// <summary>
    /// Unique identifier for the track provided by the client.
    /// </summary>
    [Key]
    [Required]
    [MaxLength(256)]
    public string Id { get; set; } = string.Empty;

    /// <summary>
    /// Date and time when the track was uploaded to the system.
    /// </summary>
    [Required]
    public DateTime UploadDate { get; set; }

    /// <summary>
    /// The raw content of the GPX file.
    /// </summary>
    [Required]
    public string GpxContent { get; set; } = string.Empty;
}
