using Microsoft.EntityFrameworkCore;
using QuizHub.Domain.Entities;

namespace QuizHub.Application.Modules.TestOptions.Extensions;

public static class DbSetExtensions
{
    public static async Task<Domain.Entities.TestOptions?> GetTestOptions(this DbSet<Test> testDb, Guid testId, Guid userId, CancellationToken ct)
    {
        var testSettingsDb = await testDb
            .Include(test => test.Options)
            .ThenInclude(options => options!.UsedQuestionBasesWithQuestionCounts)
            .Where(test => test.Id == testId && test.OwnerId == userId)
            .Select(test => test.Options)
            .FirstOrDefaultAsync(ct);

        return testSettingsDb;
    }
}
