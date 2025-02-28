using QuizHub.Application.Common.Extensions;

namespace QuizHub.Application.Modules.TestLogs.Endpoints.GetSelectedAnswers;

public class GetSelectedAnswersValidator : Validator<GetSelectedAnswersRequest>
{
    public GetSelectedAnswersValidator()
    {
        RuleFor(x => x.TestLogId)
            .NotEmpty()
            .MustBeCorrectGuid();
    }
}
