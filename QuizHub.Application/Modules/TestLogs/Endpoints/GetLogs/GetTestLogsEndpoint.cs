using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.TestLogs.Models;
using QuizHub.Domain.Entities;

namespace QuizHub.Application.Modules.TestLogs.Endpoints.GetLogs;

public class GetTestLogsEndpoint(IAppDbContext context) : Endpoint<GetTestLogsRequest, Result<GetTestLogsResponse>>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Get("test-logs/{TestId}");
    }

    public override async Task HandleAsync(GetTestLogsRequest req, CancellationToken ct)
    {
        var userId = User.GetId();

        var testDb = await _context.Tests
            .Include(test => test.TestLogs)
            .ThenInclude(testLog => testLog.SelectedAnswers)
            .FirstOrDefaultAsync(test => test.Id == req.TestId && test.OwnerId == userId, ct);

        if (testDb == null)
        {
            await SendOkAsync(Result<GetTestLogsResponse>.Error("Nie ma takiego testu"), ct);
            return;
        }

        List<TestLogDto> testLogs = testDb.TestLogs
            .Select(BuildTestLogDto)
            .ToList();

        await SendOkAsync(Result<GetTestLogsResponse>.Success(new(testLogs, testDb.Name)), ct);
    }

    private TestLogDto BuildTestLogDto(TestLog testLogDb)
    {
        var earnedPoints = testLogDb.SelectedAnswers
            .Where(tl => tl.Scored)
            .Count();

        var maxPoints = testLogDb.SelectedAnswers.Count;

        var totalDurationSeconds = Convert.ToInt32(Math.Floor(testLogDb.Duration.TotalSeconds));

        TestLogDto dto = new
        (
            testLogDb.Id,
            totalDurationSeconds,
            testLogDb.SolvedDate,
            testLogDb.Username,
            earnedPoints,
            maxPoints
        );

        return dto;
    }
}
