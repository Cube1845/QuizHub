using QuizHub.Application.Common.Abstract;

namespace QuizHub.Application.Modules.QuestionBase.Endpoints.Delete;

public class DeleteQuestionBaseValidator : ValidatorWithIdParser<DeleteQuestionBaseRequest>
{
    public DeleteQuestionBaseValidator()
    {
        RuleFor(x => x.QuestionBaseId)
            .NotNull()
            .NotEmpty()
            .Must(IsGuidFormat).WithMessage(IncorrectIdMessage);
    }
}
