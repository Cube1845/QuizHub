using QuizHub.Application.Common.Extensions;

namespace QuizHub.Application.Modules.Question.Endpoints.Delete;

public class DeleteQuestionValidator : Validator<DeleteQuestionRequest>
{
    public DeleteQuestionValidator()
    {
        RuleFor(req => req.QuestionBaseId)
            .NotEmpty()
            .MustBeCorrectGuid();

        RuleFor(req => req.QuestionId)
            .NotEmpty()
            .MustBeCorrectGuid();
    }
}
