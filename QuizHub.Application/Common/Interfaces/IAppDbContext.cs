using Microsoft.EntityFrameworkCore;
using QuizHub.Domain.Entities;

namespace QuizHub.Application.Common.Interfaces;

public interface IAppDbContext
{
    DbSet<QuestionBase> QuestionBases { get; set; }
    DbSet<Question> Questions { get; set; }
    DbSet<QuestionImage> QuestionImages { get; set; }
    DbSet<Answer> Answers { get; set; }
    DbSet<AnswerImage> AnswerImages { get; set; }
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}
