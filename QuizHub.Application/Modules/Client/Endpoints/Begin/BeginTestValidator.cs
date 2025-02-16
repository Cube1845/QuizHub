namespace QuizHub.Application.Modules.Client.Endpoints.Begin;

public class BeginTestValidator : Validator<BeginTestRequest>
{
    public BeginTestValidator()
    {
        RuleFor(x => x.Code)
            .NotEmpty();

        RuleFor(x => x.Username)
            .NotEmpty();
    }
}
