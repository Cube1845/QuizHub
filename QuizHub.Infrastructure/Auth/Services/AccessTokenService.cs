using FastEndpoints.Security;
using QuizHub.Application.Modules.Auth.Interfaces;
using QuizHub.Application.Modules.Auth.Models;
using QuizHub.Infrastructure.Auth.Config;

namespace QuizHub.Infrastructure.Auth.Services;

public class AccessTokenService(TimeProvider timeProvider, TokenConfiguration tokenConfiguration) : IAccessTokenService
{
    private readonly TimeProvider _timeProvider = timeProvider;
    private readonly TokenConfiguration _tokenConfiguration = tokenConfiguration;

    public AuthData GenerateAuthData(Guid userId)
    {
        var accessTokenLifetime = _tokenConfiguration.GetTokenConfiguration().AccessTokenExpirationSeconds;
        var expirationDate = _timeProvider.GetUtcNow().UtcDateTime.AddSeconds(accessTokenLifetime);

        var token = JwtBearer.CreateToken(options =>
        {
            options.ExpireAt = expirationDate;
            options.User.Claims.Add(("UserId", userId.ToString()));
        });

        return new(token, expirationDate);
    }
}
