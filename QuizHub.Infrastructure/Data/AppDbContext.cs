using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Interfaces;
using QuizHub.Infrastructure.Auth.Entities;

namespace QuizHub.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options), IAppDbContext
{
    public DbSet<AppUser> AppUsers { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<AppUser>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasMany(x => x.RefreshTokens).WithOne(x => x.Owner);
        });

        builder.Entity<RefreshToken>(e =>
        {
            e.HasKey(x => x.Id);
        });
    }
}
