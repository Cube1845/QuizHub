using QuizHub.Application.Common.Extensions;

namespace QuizHub.Application.Modules.TestOptions.Endpoints.Activity;

public class ChangeTestActiveStateValidator : Validator<ChangeTestActiveStateRequest>
{
    public ChangeTestActiveStateValidator()
    {
        RuleFor(x => x.TestId)
            .NotEmpty()
            .MustBeCorrectGuid();
    }
}
