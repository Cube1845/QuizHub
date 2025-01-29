using QuizHub.Application.Common.Extensions;

namespace QuizHub.Application.Modules.TestCreator.Endpoints.Update;

public class UpdateTestNameValidator : Validator<UpdateTestNameRequest>
{
    public UpdateTestNameValidator()
    {
        RuleFor(x => x.TestId)
            .NotEmpty()
            .MustBeCorrectGuid();

        RuleFor(x => x.UpdatedName)
            .NotEmpty()
            .MaximumLength(25);
    }
}
