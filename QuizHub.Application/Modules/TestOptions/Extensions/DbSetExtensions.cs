using Microsoft.EntityFrameworkCore;
using QuizHub.Domain.Entities;

namespace QuizHub.Application.Modules.TestOptions.Extensions;

public static class DbSetExtensions
{
    public static async Task<Test?> GetTestDb(this DbSet<Test> testDbSet, Guid userId, Guid testId, CancellationToken ct)
    {
        var testDb = await testDbSet
            .Include(test => test.Options)
            .ThenInclude(options => options!.UsedQuestionBasesWithQuestionCounts)
            .FirstOrDefaultAsync(test => test.Id == testId && test.OwnerId == userId, ct);

        return testDb;
    }
}
