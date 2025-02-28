using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;

namespace QuizHub.Application.Modules.TestLogs.Endpoints.Logs.Clear;

public class ClearTestLogsEndpoint(IAppDbContext context) : Endpoint<ClearTestLogsRequest, Result>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Delete("test-logs/all/{TestId}");
    }

    public override async Task HandleAsync(ClearTestLogsRequest req, CancellationToken ct)
    {
        var userId = User.GetId();

        var testLogsDb = await _context.Tests
            .Include(test => test.TestLogs)
            .ThenInclude(tl => tl.SelectedAnswers)
            .Where(test => test.Id == req.TestId && test.OwnerId == userId)
            .SelectMany(test => test.TestLogs)
            .ToListAsync(ct);

        if (testLogsDb == null)
        {
            await SendOkAsync(Result.Error("Taki test nie istnieje"), ct);
            return;
        }

        foreach (var testLogDb in testLogsDb)
        {
            _context.SelectedAnswers.RemoveRange(testLogDb.SelectedAnswers);
        }

        _context.TestLogs.RemoveRange(testLogsDb);

        await _context.SaveChangesAsync(ct);

        await SendOkAsync(Result.Success(), ct);
    }
}
