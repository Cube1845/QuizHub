using QuizHub.Application.Common.Extensions;

namespace QuizHub.Application.Modules.TestLogs.Endpoints.Logs.Get;

public class GetPaginatedTestLogsValidator : Validator<GetPaginatedTestLogsRequest>
{
    public GetPaginatedTestLogsValidator()
    {
        RuleFor(x => x.TestId)
            .NotEmpty()
            .MustBeCorrectGuid();

        RuleFor(x => x.PageNumber)
            .NotNull()
            .GreaterThanOrEqualTo(1);

        RuleFor(x => x.PageSize)
            .NotNull()
            .GreaterThanOrEqualTo(1);
    }
}
