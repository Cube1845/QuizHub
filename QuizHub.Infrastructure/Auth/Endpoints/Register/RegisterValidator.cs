using FastEndpoints;
using FluentValidation;

namespace QuizHub.Infrastructure.Auth.Endpoints.Register;

public class RegisterValidator : Validator<RegisterRequest>
{
    public RegisterValidator()
    {
        RuleFor(x => x.Username)
            .NotNull()
            .NotEmpty()
            .MinimumLength(3);

        RuleFor(x => x.Password)
            .NotNull()
            .NotEmpty()
            .MinimumLength(6);
    }
}
