using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.Auth.Interfaces;
using QuizHub.Application.Modules.Auth.Models;

namespace QuizHub.Application.Modules.Auth.Login;

public class LoginEndpoint(IAuthRepository authRepository, IAccessTokenService accessTokenService) : Endpoint<LoginRequest, Result<LoginResponse>>
{
    private readonly IAuthRepository _authRepository = authRepository;
    private readonly IAccessTokenService _accessTokenService = accessTokenService;

    public override void Configure()
    {
        Post("auth/login");
        AllowAnonymous();
    }

    public override async Task HandleAsync(LoginRequest req, CancellationToken ct)
    {
        if (!await _authRepository.UserExists(req.Email))
        {
            await SendOkAsync(Result<LoginResponse>.Error("Nie znaleziono konta z takim adresem email"), ct);

            return;
        }

        var userId = await _authRepository.GetUserIdIfPasswordCorrect(req.Email, req.Password, ct);
        var passwordCorrect = userId != null;

        if (!passwordCorrect)
        {
            await SendOkAsync(Result<LoginResponse>.Error("Niepoprawne hasło"), ct);

            return;
        }

        AuthData authData = _accessTokenService.GenerateAuthData(userId!.Value);
        LoginResponse response = new(authData.AccessToken, authData.ExpirationDate);

        await SendOkAsync(Result<LoginResponse>.Success(response));
    }
}
