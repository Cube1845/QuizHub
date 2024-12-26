using FastEndpoints;
using QuizHub.Application.Common.Models;
using QuizHub.Infrastructure.Auth.Services;

namespace QuizHub.Infrastructure.Auth.Endpoints.Register;

public class RegisterEndpoint(AuthRepository authRepository, PasswordHashService passwordHashService) : Endpoint<RegisterRequest>
{
    private readonly AuthRepository _authRepository = authRepository;
    private readonly PasswordHashService _passwordHashService = passwordHashService;

    public override void Configure()
    {
        Post("auth/register");
        AllowAnonymous();
    }

    public override async Task HandleAsync(RegisterRequest req, CancellationToken ct)
    {
        if (await _authRepository.UserExists(req.Email, ct))
        {
            await SendOkAsync(
                Result.Error("Konto z takim adresem email już istnieje"),
                ct
            );

            return;
        }

        var passwordHash = _passwordHashService.HashPaswordWithSalt(req.Password);

        await _authRepository.AddNewUser(req.Email, passwordHash, ct);

        await SendOkAsync(Result.Success(), ct);
    }
}
