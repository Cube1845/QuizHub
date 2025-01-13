using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Domain.Entities;
using QuizHub.Infrastructure.Auth.Entities;

namespace QuizHub.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options), IAppDbContext
{
    //Auth
    public DbSet<AppUser> AppUsers { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }

    //Question bases
    public DbSet<QuestionBase> QuestionBases { get; set; }
    public DbSet<Question> Questions { get; set; }
    public DbSet<Answer> Answers { get; set; }
    public DbSet<Image> Images { get; set; }

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

        builder.Entity<QuestionBase>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasMany(x => x.Questions).WithOne(x => x.QuestionBase);
            e.HasIndex(x => new { x.Id, x.OwnerId }).IsUnique();
        });

        builder.Entity<Question>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasMany(x => x.Answers).WithOne(x => x.Question);
        });

        builder.Entity<Answer>(e =>
        {
            e.HasKey(x => x.Id);
        });

        builder.Entity<Image>(e =>
        {
            e.HasKey(x => x.Id);
        });
    }
}
