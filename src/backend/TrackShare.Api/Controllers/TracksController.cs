using Microsoft.AspNetCore.Mvc;
using TrackShare.Api.Entities;
using TrackShare.Api.Models;
using TrackShare.Api.Repositories;

namespace TrackShare.Api.Controllers;

/// <summary>
/// API controller for track operations.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class TracksController : ControllerBase
{
    private readonly ITrackRepository _trackRepository;
    private readonly ILogger<TracksController> _logger;

    public TracksController(ITrackRepository trackRepository, ILogger<TracksController> logger)
    {
        _trackRepository = trackRepository;
        _logger = logger;
    }

    /// <summary>
    /// Uploads a new track or updates an existing one.
    /// </summary>
    /// <param name="request">The upload request containing track data.</param>
    /// <returns>HTTP status indicating success or failure.</returns>
    [HttpPost("upload")]
    public async Task<IActionResult> UploadTrack([FromBody] UploadTrackRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var track = new Track
            {
                Id = request.Id,
                UploadDate = DateTime.UtcNow,
                GpxContent = request.GpxContent
            };

            await _trackRepository.SaveAsync(track);

            _logger.LogInformation("Track {TrackId} uploaded successfully", request.Id);
            return Ok(new { message = "Track uploaded successfully", trackId = request.Id });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading track {TrackId}", request.Id);
            return StatusCode(500, new { message = "An error occurred while uploading the track" });
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
        var track = await _trackRepository.GetByIdAsync(id);

        if (track == null)
        {
            return NotFound(new { message = "Track not found" });
        }

        return Ok(new
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
        var deleted = await _trackRepository.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound(new { message = "Track not found" });
        }

        _logger.LogInformation("Track {TrackId} deleted successfully", id);
        return Ok(new { message = "Track deleted successfully" });
    }
}
