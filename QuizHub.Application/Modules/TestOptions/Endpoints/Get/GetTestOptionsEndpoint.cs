using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.TestOptions.Extensions;
using QuizHub.Application.Modules.TestOptions.Models;

namespace QuizHub.Application.Modules.TestOptions.Endpoints.Get;

public class GetTestOptionsEndpoint(IAppDbContext context) : Endpoint<GetTestOptionsRequest, Result<GetTestOptionsResponse>>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Get("test-options/{TestId}");
    }

    public override async Task HandleAsync(GetTestOptionsRequest req, CancellationToken ct)
    {
        var userId = User.GetId();

        var testSettingsDb = await _context.Tests.GetTestOptions(req.TestId, User.GetId(), ct);

        if (testSettingsDb == null)
        {
            await SendOkAsync(Result<GetTestOptionsResponse>.Error("Taki test nie istnieje"), ct);
            return;
        }

        List<QuestionBaseWithNameAndQuestionCountDto> questionBaseWithData = testSettingsDb
            .UsedQuestionBasesWithQuestionCounts
            .Select(qb => 
            {
                return new QuestionBaseWithNameAndQuestionCountDto()
                {
                    MinimalQuestionCount = qb.MinimalQuestionCount,
                    QuestionBaseId = qb.QuestionBaseId,
                };
            }).ToList();
    }
}
