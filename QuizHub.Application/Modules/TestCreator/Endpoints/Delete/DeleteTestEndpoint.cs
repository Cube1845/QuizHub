using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;

namespace QuizHub.Application.Modules.TestCreator.Endpoints.Delete;

public class DeleteTestEndpoint(IAppDbContext context) : Endpoint<DeleteTestRequest, Result>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Delete("test/{TestId}");
    }

    public override async Task HandleAsync(DeleteTestRequest req, CancellationToken ct)
    {
        var userId = User.GetId();

        var testDb = await _context.Tests
            .Include(test => test.Options)
            .ThenInclude(options => options!.UsedQuestionBasesWithQuestionCounts)
            .FirstOrDefaultAsync(test => test.Id == req.TestId && test.OwnerId == userId, ct);

        if (testDb == null)
        {
            await SendOkAsync(Result.Error("Taki test nie istnieje"), ct);
            return;
        }

        if (testDb.Options!.UsedQuestionBasesWithQuestionCounts.Count != 0)
        {
            _context.QuestionBasesWithQuestionCount.RemoveRange(testDb.Options!.UsedQuestionBasesWithQuestionCounts);
        }

        _context.TestsOptions.Remove(testDb.Options!);
        _context.Tests.Remove(testDb);

        await _context.SaveChangesAsync(ct);
        await SendOkAsync(Result.Success(), ct);
    }
}
