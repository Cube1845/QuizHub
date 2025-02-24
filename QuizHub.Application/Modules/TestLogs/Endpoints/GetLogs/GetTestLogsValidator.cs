using QuizHub.Application.Common.Extensions;

namespace QuizHub.Application.Modules.TestLogs.Endpoints.GetLogs;

public class GetTestLogsValidator : Validator<GetTestLogsRequest>
{
    public GetTestLogsValidator()
    {
        RuleFor(x => x.TestId)
            .NotEmpty()
            .MustBeCorrectGuid();
    }
}
