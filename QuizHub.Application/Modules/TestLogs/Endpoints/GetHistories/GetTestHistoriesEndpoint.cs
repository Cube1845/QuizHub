using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.TestLogs.Models;

namespace QuizHub.Application.Modules.TestLogs.Endpoints.GetHistories;

public class GetTestHistoriesEndpoint(IAppDbContext context) : EndpointWithoutRequest<Result<GetTestHistoriesResponse>>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Get("test-history");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var userId = User.GetId();

        var testHistoryDatas = await _context.Tests
            .Where(test => test.OwnerId == userId && test.TestLogs.Count > 0)
            .Select(test => new TestHistoryData(
                test.Name,
                test.Id,
                test.TestLogs.Count
            ))
            .ToListAsync(ct);

        await SendOkAsync(Result<GetTestHistoriesResponse>.Success(new(testHistoryDatas)), ct);
    }
}