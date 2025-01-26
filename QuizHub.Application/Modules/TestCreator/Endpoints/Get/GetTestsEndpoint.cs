using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.TestCreator.Models;

namespace QuizHub.Application.Modules.TestCreator.Endpoints.Get;

public class GetTestsEndpoint(IAppDbContext context) : EndpointWithoutRequest<Result<GetTestsResponse>>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Get("test");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var userId = User.GetId();

        var userTests = await _context.Tests
            .Where(test => test.OwnerId == userId)
            .ToListAsync(ct);

        if (userTests.Count == 0)
        {
            await SendOkAsync(Result<GetTestsResponse>.Success(new([])), ct);
            return;
        }

        List<TestData> testDatas = userTests
            .Select(test => new TestData(test.Id, test.Name, test.Code, test.IsActive))
            .ToList();

        await SendOkAsync(Result<GetTestsResponse>.Success(new(testDatas)), ct);
    }
}
