using FastEndpoints;
using FastEndpoints.Security;
using QuizHub.Application.Common.Models;
using QuizHub.Infrastructure.Auth.Config;
using QuizHub.Infrastructure.Auth.Endpoints.Login;

namespace QuizHub.Infrastructure.Auth.Services;

public class TokenService : RefreshTokenService<TokenRequest, LoginResponse>
{
    private readonly TimeProvider _timeProvider;
    private readonly TokenConfiguration _tokenConfiguration;

    public TokenService(TimeProvider timeProvider, TokenConfiguration tokenConfiguration)
    {
        _timeProvider = timeProvider;
        _tokenConfiguration = tokenConfiguration;

        Setup(o =>
        {
            o.TokenSigningKey = _tokenConfiguration.GetTokenConfiguration().SecretKey;
            o.AccessTokenValidity = TimeSpan.FromSeconds(_tokenConfiguration.GetTokenConfiguration().AccessTokenExpirationSeconds);
            o.RefreshTokenValidity = TimeSpan.FromSeconds(_tokenConfiguration.GetTokenConfiguration().RefreshTokenExpirationSeconds);

            o.Endpoint("/auth/refresh", ep => {});
        });
    }

    public override Task PersistTokenAsync(LoginResponse response)
    {
        throw new NotImplementedException();
    }

    public override Task RefreshRequestValidationAsync(TokenRequest req)
    {
        throw new NotImplementedException();
    }

    public override Task SetRenewalPrivilegesAsync(TokenRequest request, UserPrivileges privileges)
    {
        throw new NotImplementedException();
    }
}
