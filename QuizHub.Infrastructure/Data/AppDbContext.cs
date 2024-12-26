using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Interfaces;
using QuizHub.Infrastructure.Auth.Entities;

namespace QuizHub.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options), IAppDbContext
{
    public DbSet<AppUser> AppUsers { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<AppUser>(e =>
        {
            e.HasKey(x => x.Id);
        });
    }
}
