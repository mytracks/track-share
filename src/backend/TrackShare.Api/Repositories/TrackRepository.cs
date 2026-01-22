using Microsoft.EntityFrameworkCore;
using info.stichling.TrackShare.Api.Data;
using info.stichling.TrackShare.Api.Entities;

namespace info.stichling.TrackShare.Api.Repositories;

/// <summary>
/// Repository implementation for Track entity.
/// </summary>
public class TrackRepository : ITrackRepository
{
    private readonly TrackShareDbContext context;

    public TrackRepository(TrackShareDbContext context)
    {
        this.context = context;
    }

    public async Task<Track?> GetByIdAsync(string id)
    {
        return await this.context.Tracks.FindAsync(id);
    }

    public async Task<Track> SaveAsync(Track track)
    {
        var existing = await this.context.Tracks.FindAsync(track.Id);
        
        if (existing != null)
        {
            // Update existing track
            existing.GpxContent = track.GpxContent;
            existing.UploadDate = track.UploadDate;
            this.context.Tracks.Update(existing);
        }
        else
        {
            // Create new track
            await this.context.Tracks.AddAsync(track);
        }

        await this.context.SaveChangesAsync();
        return track;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var track = await this.context.Tracks.FindAsync(id);
        
        if (track == null)
        {
            return false;
        }

        this.context.Tracks.Remove(track);
        await this.context.SaveChangesAsync();
        return true;
    }
}
