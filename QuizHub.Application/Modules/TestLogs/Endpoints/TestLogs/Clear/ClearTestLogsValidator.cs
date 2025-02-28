using QuizHub.Application.Common.Extensions;

namespace QuizHub.Application.Modules.TestLogs.Endpoints.Logs.Clear;

public class ClearTestLogsValidator : Validator<ClearTestLogsRequest>
{
    public ClearTestLogsValidator()
    {
        RuleFor(x => x.TestId)
            .NotEmpty()
            .MustBeCorrectGuid();
    }
}
