using QuizHub.Application.Common.Extensions;

namespace QuizHub.Application.Modules.Client.Endpoints.Finish;

public class FinishTestValidator : Validator<FinishTestRequest>
{
    public FinishTestValidator()
    {
        RuleFor(x => x.UserQuestions)
            .NotNull();

        RuleFor(x => x.TestSolvingId)
            .NotEmpty()
            .MustBeCorrectGuid();
    }
}
