using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.TestLogs.Models;

namespace QuizHub.Application.Modules.TestLogs.Endpoints.Logs.Get;

public class GetPaginatedTestLogsEndpoint(IAppDbContext context) : Endpoint<GetPaginatedTestLogsRequest, Result<GetPaginatedTestLogsResponse>>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Get("test-logs");
    }

    public override async Task HandleAsync(GetPaginatedTestLogsRequest req, CancellationToken ct)
    {
        var userId = User.GetId();

        var testDb = await _context.Tests
            .Include(test => test.TestLogs)
            .ThenInclude(testLog => testLog.SelectedAnswers)
            .FirstOrDefaultAsync(test => test.Id == req.TestId && test.OwnerId == userId, ct);

        if (testDb == null)
        {
            await SendOkAsync(Result<GetPaginatedTestLogsResponse>.Error("Nie ma takiego testu"), ct);
            return;
        }

        List<TestLogDto> testLogs = testDb.TestLogs
            .GetPage(req.PageNumber, req.PageSize)
            .Select(TestLogDto.FromTestLogDb)
            .ToList();

        PaginatedData<TestLogDto> data = new(testLogs, testDb.TestLogs.Count);

        await SendOkAsync(Result<GetPaginatedTestLogsResponse>.Success(new(data, testDb.Name)), ct);
    }
}
