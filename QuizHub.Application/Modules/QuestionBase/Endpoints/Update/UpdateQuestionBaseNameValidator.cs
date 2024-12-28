using QuizHub.Application.Common.Abstract;

namespace QuizHub.Application.Modules.QuestionBase.Endpoints.Update;

public class UpdateQuestionBaseNameValidator : ValidatorWithIdParser<UpdateQuestionBaseNameRequest>
{
    public UpdateQuestionBaseNameValidator()
    {
        RuleFor(x => x.QuestionBaseId)
            .NotEmpty()
            .NotNull()
            .Must(IsGuidFormat).WithMessage("Niepoprawne id");

        RuleFor(x => x.UpdatedName)
            .NotEmpty()
            .NotNull()
            .MinimumLength(3)
            .MaximumLength(25);
    }
}
