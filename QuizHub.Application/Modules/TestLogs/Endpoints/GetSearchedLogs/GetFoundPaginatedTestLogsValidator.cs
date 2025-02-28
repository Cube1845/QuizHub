using QuizHub.Application.Common.Extensions;

namespace QuizHub.Application.Modules.TestLogs.Endpoints.GetSearchedLogs;

public class GetFoundPaginatedTestLogsValidator : Validator<GetFoundPaginatedTestLogsRequest>
{
    public GetFoundPaginatedTestLogsValidator()
    {
        RuleFor(x => x.TestId)
            .NotEmpty()
            .MustBeCorrectGuid();

        RuleFor(x => x.Key)
            .NotEmpty();

        RuleFor(x => x.PageNumber)
            .NotNull()
            .GreaterThanOrEqualTo(1);

        RuleFor(x => x.PageSize)
            .NotNull()
            .GreaterThanOrEqualTo(1);
    }
}
