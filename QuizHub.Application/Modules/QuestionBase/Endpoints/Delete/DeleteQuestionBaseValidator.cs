using QuizHub.Application.Common.Extensions;

namespace QuizHub.Application.Modules.QuestionBase.Endpoints.Delete;

public class DeleteQuestionBaseValidator : Validator<DeleteQuestionBaseRequest>
{
    public DeleteQuestionBaseValidator()
    {
        RuleFor(x => x.QuestionBaseId)
            .NotEmpty()
            .MustBeCorrectGuid();
    }
}
