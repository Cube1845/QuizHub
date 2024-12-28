namespace QuizHub.Application.Modules.QuestionBase.Endpoints.Add;

public class AddQuestionBaseValidator : Validator<AddQuestionBaseRequest>
{
    public AddQuestionBaseValidator()
    {
        RuleFor(x => x.Name)
            .NotNull()
            .NotEmpty()
            .MinimumLength(3)
            .MaximumLength(25);
    }
}
