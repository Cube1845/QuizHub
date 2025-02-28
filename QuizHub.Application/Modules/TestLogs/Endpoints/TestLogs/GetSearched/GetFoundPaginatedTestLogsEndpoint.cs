using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.TestLogs.Models;

namespace QuizHub.Application.Modules.TestLogs.Endpoints.Logs.GetSearched;

public class GetFoundPaginatedTestLogsEndpoint(IAppDbContext context) : Endpoint<GetFoundPaginatedTestLogsRequest, Result<GetFoundPaginatedTestLogsResponse>>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Get("test-logs/search");
    }

    public override async Task HandleAsync(GetFoundPaginatedTestLogsRequest req, CancellationToken ct)
    {
        var userId = User.GetId();

        var testLogsDb = await _context.Tests
            .Include(test => test.TestLogs)
            .ThenInclude(testLog => testLog.SelectedAnswers)
            .Where(test => test.Id == req.TestId && test.OwnerId == userId)
            .SelectMany(test => test.TestLogs)
            .Where(tl => tl.Username.Contains(req.Key))
            .ToListAsync(ct);

        if (testLogsDb == null)
        {
            await SendOkAsync(Result<GetFoundPaginatedTestLogsResponse>.Error("Nie ma takiego testu"), ct);
            return;
        }

        List<TestLogDto> testLogs = testLogsDb
            .GetPage(req.PageNumber, req.PageSize)
            .Select(TestLogDto.FromTestLogDb)
            .ToList();

        PaginatedData<TestLogDto> data = new(testLogs, testLogsDb.Count);

        await SendOkAsync(Result<GetFoundPaginatedTestLogsResponse>.Success(new(data)), ct);
    }
}
