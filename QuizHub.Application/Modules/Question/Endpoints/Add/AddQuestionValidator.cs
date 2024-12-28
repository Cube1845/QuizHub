using QuizHub.Application.Common.Abstract;

namespace QuizHub.Application.Modules.Question.Endpoints.Add;

public class AddQuestionValidator : ValidatorWithIdParser<AddQuestionRequest>
{
    public AddQuestionValidator()
    {
        RuleFor(x => x.QuestionBaseId)
            .NotEmpty()
            .NotNull()
            .Must(IsGuidFormat).WithMessage(IncorrectIdMessage);

        RuleFor(x => x.Question)
            .NotNull()
            .Must(x => x.Answers.Count >= 2 && x.Answers.Count <= 4);
    }
}
