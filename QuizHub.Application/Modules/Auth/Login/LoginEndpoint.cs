using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.Auth.Interfaces;
using QuizHub.Application.Modules.Auth.Models;

namespace QuizHub.Application.Modules.Auth.Login;

public class LoginEndpoint(IAuthRepository authRepository, IAccessTokenService accessTokenService, IPasswordHashService passwordHashService) : Endpoint<LoginRequest, Result<LoginResponse>>
{
    private readonly IAuthRepository _authRepository = authRepository;
    private readonly IAccessTokenService _accessTokenService = accessTokenService;
    private readonly IPasswordHashService _passwordHashService = passwordHashService;

    public override void Configure()
    {
        Post("auth/login");
        AllowAnonymous();
    }

    public override async Task HandleAsync(LoginRequest req, CancellationToken ct)
    {
        var user = await _authRepository.GetUser(req.Email, ct);

        var userExists = user != null;

        if (!userExists)
        {
            await SendOkAsync(Result<LoginResponse>.Error("Nie znaleziono konta z takim adresem email"), ct);

            return;
        }

        var passwordCorrect = _passwordHashService.VerifyPassword(req.Password, user!.PasswordHash);

        if (!passwordCorrect)
        {
            await SendOkAsync(Result<LoginResponse>.Error("Niepoprawne hasło"), ct);

            return;
        }

        AuthData authData = _accessTokenService.GenerateAuthData(user!.Id);
        LoginResponse response = new(authData.AccessToken, authData.ExpirationDate);

        await SendOkAsync(Result<LoginResponse>.Success(response), ct);
    }
}
