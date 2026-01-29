using info.stichling.TrackShare.Api.Entities;

namespace info.stichling.TrackShare.Api.Repositories;

/// <summary>
/// Interface for Track repository operations.
/// </summary>
public interface ITrackRepository
{
    /// <summary>
    /// Gets a track by its identifier.
    /// </summary>
    /// <param name="id">The track identifier.</param>
    /// <returns>The track if found, null otherwise.</returns>
    Task<Track?> GetByIdAsync(string id);

    /// <summary>
    /// Creates or updates a track.
    /// </summary>
    /// <param name="track">The track to save.</param>
    /// <returns>The saved track.</returns>
    Task<Track> SaveAsync(Track track);

    /// <summary>
    /// Deletes a track by its identifier.
    /// </summary>
    /// <param name="id">The track identifier.</param>
    /// <returns>True if the track was deleted, false if it didn't exist.</returns>
    Task<bool> DeleteAsync(string id);
}
