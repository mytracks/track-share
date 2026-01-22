using Microsoft.AspNetCore.Mvc;
using info.stichling.TrackShare.Api.Entities;
using info.stichling.TrackShare.Api.Models;
using info.stichling.TrackShare.Api.Repositories;

namespace info.stichling.TrackShare.Api.Controllers;

/// <summary>
/// API controller for track operations.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class TracksController : ControllerBase
{
    private readonly ITrackRepository trackRepository;
    private readonly ILogger<TracksController> logger;

    public TracksController(ITrackRepository trackRepository, ILogger<TracksController> logger)
    {
        this.trackRepository = trackRepository;
        this.logger = logger;
    }

    /// <summary>
    /// Uploads a new track or updates an existing one.
    /// </summary>
    /// <param name="request">The upload request containing track data.</param>
    /// <returns>HTTP status indicating success or failure.</returns>
    [HttpPost("upload")]
    public async Task<IActionResult> UploadTrack([FromBody] UploadTrackRequest request)
    {
        if (!this.ModelState.IsValid)
        {
            return this.BadRequest(this.ModelState);
        }

        try
        {
            var track = new Track
            {
                Id = request.Id,
                UploadDate = DateTime.UtcNow,
                GpxContent = request.GpxContent
            };

            await this.trackRepository.SaveAsync(track);

            this.logger.LogInformation("Track {TrackId} uploaded successfully", request.Id);
            return this.Ok(new { message = "Track uploaded successfully", trackId = request.Id });
        }
        catch (Exception ex)
        {
            this.logger.LogError(ex, "Error uploading track {TrackId}", request.Id);
            return this.StatusCode(500, new { message = "An error occurred while uploading the track" });
        }
    }

    /// <summary>
    /// Gets a track by its identifier.
    /// </summary>
    /// <param name="id">The track identifier.</param>
    /// <returns>The track data if found.</returns>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTrack(string id)
    {
        var track = await this.trackRepository.GetByIdAsync(id);

        if (track == null)
        {
            return this.NotFound(new { message = "Track not found" });
        }

        return this.Ok(new
        {
            id = track.Id,
            uploadDate = track.UploadDate,
            gpxContent = track.GpxContent
        });
    }

    /// <summary>
    /// Deletes a track by its identifier.
    /// </summary>
    /// <param name="id">The track identifier.</param>
    /// <returns>HTTP status indicating success or failure.</returns>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTrack(string id)
    {
        var deleted = await this.trackRepository.DeleteAsync(id);

        if (!deleted)
        {
            return this.NotFound(new { message = "Track not found" });
        }

        this.logger.LogInformation("Track {TrackId} deleted successfully", id);
        return this.Ok(new { message = "Track deleted successfully" });
    }
}
