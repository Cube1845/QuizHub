using QuizHub.Application.Common.Extensions;

namespace QuizHub.Application.Modules.QuestionBase.Endpoints.Update;

public class UpdateQuestionBaseNameValidator : Validator<UpdateQuestionBaseNameRequest>
{
    public UpdateQuestionBaseNameValidator()
    {
        RuleFor(x => x.QuestionBaseId)
            .NotEmpty()
            .MustBeCorrectGuid();

        RuleFor(x => x.UpdatedName)
            .NotEmpty()
            .MinimumLength(3)
            .MaximumLength(25);
    }
}
