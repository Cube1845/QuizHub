using QuizHub.Application.Common.Extensions;

namespace QuizHub.Application.Modules.Question.Endpoints.Add;

public class AddQuestionValidator : Validator<AddQuestionRequest>
{
    public AddQuestionValidator()
    {
        RuleFor(x => x.QuestionBaseId)
            .NotEmpty()
            .MustBeCorrectGuid();

        RuleFor(x => x.Question)
            .NotNull();
        RuleFor(x => x.Question.Answers)
            .NotNull()
            .Must(x => x.Count >= 2 && x.Count <= 4)
                .WithMessage("Pytanie musi mieć przynajmniej 2 odpowiedzi")
            .Must(x => x.Any(a => a.IsCorrect))
                .WithMessage("Pytanie musi mieć przynajmniej jedną poprawną odpowiedź");
    }
}
