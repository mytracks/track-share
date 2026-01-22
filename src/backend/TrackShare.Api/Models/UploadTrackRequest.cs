using System.ComponentModel.DataAnnotations;

namespace info.stichling.TrackShare.Api.Models;

/// <summary>
/// Request model for uploading a track.
/// </summary>
public class UploadTrackRequest
{
    /// <summary>
    /// Unique identifier for the track.
    /// </summary>
    [Required]
    [MaxLength(256)]
    public string Id { get; set; } = string.Empty;

    /// <summary>
    /// The raw content of the GPX file.
    /// </summary>
    [Required]
    public string GpxContent { get; set; } = string.Empty;
}
