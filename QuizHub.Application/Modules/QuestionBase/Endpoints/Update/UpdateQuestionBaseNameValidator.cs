using QuizHub.Application.Common.Abstract;
using QuizHub.Application.Common.Extensions;

namespace QuizHub.Application.Modules.QuestionBase.Endpoints.Update;

public class UpdateQuestionBaseNameValidator : Validator<UpdateQuestionBaseNameRequest>
{
    public UpdateQuestionBaseNameValidator()
    {
        RuleFor(x => x.QuestionBaseId)
            .NotEmpty()
            .NotNull()
            .MustBeCorrectGuid();

        RuleFor(x => x.UpdatedName)
            .NotEmpty()
            .NotNull()
            .MinimumLength(3)
            .MaximumLength(25);
    }
}
