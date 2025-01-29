using QuizHub.Application.Common.Extensions;

namespace QuizHub.Application.Modules.TestOptions.Endpoints.Code;

public class ChangeTestCodeValidator : Validator<ChangeTestCodeRequest>
{
    public ChangeTestCodeValidator()
    {
        RuleFor(x => x.TestId)
            .NotEmpty()
            .MustBeCorrectGuid();
    }
}
