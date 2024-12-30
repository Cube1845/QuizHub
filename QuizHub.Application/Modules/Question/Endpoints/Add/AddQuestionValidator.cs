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
            .NotNull()
            .Must(x => x.Answers.All(a => a.Content != null || a.Image != null))
                .WithMessage("Pytanie nie może mieć pustych odpowiedzi");

        RuleFor(x => x.Question.Answers)
            .NotNull()
            .Must(x => x.Count >= 2 && x.Count <= 4)
                .WithMessage("Pytanie musi mieć przynajmniej 2 odpowiedzi")
            .Must(x => x.All(a => a.Content != null || a.Image != null))
                .WithMessage("Pytanie nie może mieć pustych odpowiedzi");
    }
}
