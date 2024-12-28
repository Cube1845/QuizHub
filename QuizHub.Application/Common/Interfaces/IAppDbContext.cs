using Microsoft.EntityFrameworkCore;
using QuizHub.Domain.Entities;

namespace QuizHub.Application.Common.Interfaces;

public interface IAppDbContext
{
    DbSet<QuestionBase> QuestionBases { get; set; }
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}
