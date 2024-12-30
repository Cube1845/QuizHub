using FastEndpoints.Security;

namespace QuizHub.Infrastructure.Auth.Endpoints.Login;

public class LoginResponse : TokenResponse
{
    public DateTime AccessExpiryDateTime => AccessExpiry.ToLocalTime();
    public DateTime RefreshExpiryDateTime => RefreshExpiry.ToLocalTime();
}
