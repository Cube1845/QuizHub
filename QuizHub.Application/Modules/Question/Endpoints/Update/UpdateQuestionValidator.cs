using QuizHub.Application.Common.Abstract;
using QuizHub.Application.Common.Extensions;

namespace QuizHub.Application.Modules.Question.Endpoints.Update;

public class UpdateQuestionValidator : Validator<UpdateQuestionRequest>
{
    public UpdateQuestionValidator()
    {
        RuleFor(x => x.QuestionBaseId)
            .NotNull()
            .NotEmpty()
            .MustBeCorrectGuid();

        RuleFor(x => x.Question)
            .NotNull();

        RuleFor(x => x.Question.Id)
            .NotNull()
            .NotEmpty()
            .MustBeCorrectGuid();

        RuleFor(x => x.Question.Answers)
            .Must(x => x.Count >= 2 && x.Count <= 4)
                .WithMessage("Pytanie musi mieć przynajmniej 2 odpowiedzi, a maksymalnie 4")
            .Must(x => x.Any(a => a.IsCorrect))
                .WithMessage("Pytanie musi mieć przynajmniej jedną poprawną odpowiedź")
            .Must(x => x.All(a => a.Content != null || a.Image != null))
                .WithMessage("Pytanie nie może mieć pustych odpowiedzi");

        RuleFor(x => x.Question.Answers.Select(a => a.Id))
            .MustBeCorrectGuidsOrNulls();
    }
}
