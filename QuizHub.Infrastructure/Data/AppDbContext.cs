using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Newtonsoft.Json;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Domain.Entities;
using QuizHub.Infrastructure.Auth.Entities;
using System.Text.Json;

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

    //Tests
    public DbSet<Test> Tests { get; set; }
    public DbSet<TestOptions> TestsOptions { get; set; }
    public DbSet<QuestionBaseWithQuestionCount> QuestionBasesWithQuestionCount { get; set; }

    //Test logs
    public DbSet<TestLog> TestLogs { get; set; }
    public DbSet<SelectedAnswer> SelectedAnswers { get; set; }

    //Client (test solving)
    public DbSet<TestSolving> TestSolvings { get; set; }

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

        builder.Entity<Test>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.Options).WithOne(x => x.Test);
            e.HasIndex(x => new { x.Id, x.OwnerId }).IsUnique();
        });

        builder.Entity<TestOptions>(e =>
        {
            e.HasKey(x => x.Id);
        });

        builder.Entity<QuestionBaseWithQuestionCount>(e =>
        {
            e.HasKey(x => new { x.TestOptionsId, x.QuestionBaseId });
            e.HasOne(x => x.TestOptions)
                .WithMany(x => x.UsedQuestionBasesWithQuestionCounts)
                .HasForeignKey(x => x.TestOptionsId);
        });

        builder.Entity<TestSolving>(e =>
        {
            e.HasKey(x => x.Id);
        });

        builder.Entity<TestSolving>().OwnsMany(x => x.DrawnQuestionsIds, builder =>
        {
            builder.ToJson();
        });

        builder.Entity<TestLog>(e =>
        {
            e.HasKey(x => x.Id);

            e.Property(x => x.Duration)
                .HasConversion(
                    x => x.Ticks,
                    x => new TimeSpan(x)
                );

            e.HasMany(x => x.SelectedAnswers).WithOne(x => x.TestLog);
        });

        builder.Entity<SelectedAnswer>(e =>
        {
            e.HasKey(x => x.Id);

            e.OwnsOne(x => x.SelectedAnswerIds, builder => builder.ToJson());
        });
    }
}
