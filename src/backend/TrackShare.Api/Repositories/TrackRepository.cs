using Microsoft.EntityFrameworkCore;
using TrackShare.Api.Data;
using TrackShare.Api.Entities;

namespace TrackShare.Api.Repositories;

/// <summary>
/// Repository implementation for Track entity.
/// </summary>
public class TrackRepository : ITrackRepository
{
    private readonly TrackShareDbContext _context;

    public TrackRepository(TrackShareDbContext context)
    {
        _context = context;
    }

    public async Task<Track?> GetByIdAsync(string id)
    {
        return await _context.Tracks.FindAsync(id);
    }

    public async Task<Track> SaveAsync(Track track)
    {
        var existing = await _context.Tracks.FindAsync(track.Id);
        
        if (existing != null)
        {
            // Update existing track
            existing.GpxContent = track.GpxContent;
            existing.UploadDate = track.UploadDate;
            _context.Tracks.Update(existing);
        }
        else
        {
            // Create new track
            await _context.Tracks.AddAsync(track);
        }

        await _context.SaveChangesAsync();
        return track;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var track = await _context.Tracks.FindAsync(id);
        
        if (track == null)
        {
            return false;
        }

        _context.Tracks.Remove(track);
        await _context.SaveChangesAsync();
        return true;
    }
}
