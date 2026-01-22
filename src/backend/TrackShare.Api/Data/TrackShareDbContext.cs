using Microsoft.EntityFrameworkCore;
using TrackShare.Api.Entities;

namespace TrackShare.Api.Data;

/// <summary>
/// Database context for TrackShare application.
/// </summary>
public class TrackShareDbContext : DbContext
{
    public TrackShareDbContext(DbContextOptions<TrackShareDbContext> options)
        : base(options)
    {
    }

    /// <summary>
    /// Tracks stored in the database.
    /// </summary>
    public DbSet<Track> Tracks { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Track>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasMaxLength(256).IsRequired();
            entity.Property(e => e.UploadDate).IsRequired();
            entity.Property(e => e.GpxContent).IsRequired();
        });
    }
}
