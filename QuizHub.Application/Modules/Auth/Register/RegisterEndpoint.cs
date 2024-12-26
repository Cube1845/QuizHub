
using Microsoft.AspNetCore.Http;
using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.Auth.Interfaces;

namespace QuizHub.Application.Modules.Auth.Register;

public class RegisterEndpoint(IAuthRepository authRepository, IPasswordHashService passwordHashService) : Endpoint<RegisterRequest>
{
    private readonly IAuthRepository _authRepository = authRepository;
    private readonly IPasswordHashService _passwordHashService = passwordHashService;

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
