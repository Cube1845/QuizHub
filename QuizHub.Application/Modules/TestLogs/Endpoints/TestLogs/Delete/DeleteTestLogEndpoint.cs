using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;

namespace QuizHub.Application.Modules.TestLogs.Endpoints.Logs.Delete;

public class DeleteTestLogEndpoint(IAppDbContext context) : Endpoint<DeleteTestLogRequest, Result>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Delete("test-logs");
    }

    public override async Task HandleAsync(DeleteTestLogRequest req, CancellationToken ct)
    {
        var userId = User.GetId();

        var testLogDb = await _context.Tests
            .Include(test => test.TestLogs)
            .ThenInclude(tl => tl.SelectedAnswers)
            .Where(test => test.Id == req.TestId && test.OwnerId == userId)
            .SelectMany(test => test.TestLogs)
            .FirstOrDefaultAsync(tl => tl.Id == req.TestLogId, ct);

        if (testLogDb == null)
        {
            await SendOkAsync(Result.Error("Takie rozwiązanie testu nie miało miejsca"), ct);
            return;
        }

        _context.SelectedAnswers.RemoveRange(testLogDb.SelectedAnswers);
        _context.TestLogs.Remove(testLogDb);

        await _context.SaveChangesAsync(ct);

        await SendOkAsync(Result.Success(), ct);
    }
}
