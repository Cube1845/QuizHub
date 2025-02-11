using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.Client.Models;

namespace QuizHub.Application.Modules.Client.Endpoints.GetResult;

public class GetTestResultEndpoint(IAppDbContext context) : Endpoint<GetTestResultRequest, Result<GetTestResultResponse>>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Get("client/finish/{TestLogId}");
        AllowAnonymous();
    }

    public override async Task HandleAsync(GetTestResultRequest req, CancellationToken ct)
    {
        var testLogDb = await _context.TestLogs
            .Include(log => log.SelectedAnswers)
            .FirstOrDefaultAsync(log => log.Id == req.TestLogId, ct);

        if (testLogDb == null)
        {
            await SendOkAsync(Result<GetTestResultResponse>.Error("Błąd id"), ct);
            return;
        }

        var earnedPoints = testLogDb.SelectedAnswers
            .Select(sa => sa.ScoredPoints)
            .Sum();

        var maxPoints = testLogDb.SelectedAnswers.Count;

        var totalDurationSeconds = Convert.ToInt32(Math.Floor(testLogDb.Duration.TotalSeconds));

        TestResultDto result = new(earnedPoints, maxPoints, totalDurationSeconds, testLogDb.Username);

        await SendOkAsync(Result<GetTestResultResponse>.Success(new(result)), ct);
    }
}
