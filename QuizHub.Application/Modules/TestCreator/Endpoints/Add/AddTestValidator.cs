namespace QuizHub.Application.Modules.TestCreator.Endpoints.Add;

public class AddTestValidator : Validator<AddTestRequest>
{
    public AddTestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MinimumLength(3)
            .MaximumLength(25);
    }
}
