using FluentValidation;

namespace QuizHub.Application.Modules.Auth.Login;

public class LoginValidator : AbstractValidator<LoginRequest>
{
    public LoginValidator()
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
