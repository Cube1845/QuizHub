using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace QuizHub.Infrastructure.Auth.Config;

public class TokenConfiguration(IConfiguration configuration)
{
    private readonly IConfiguration _configuration = configuration;

    public TokenOptions GetTokenConfiguration()
    {
        var tokenOptions = new TokenOptions();
        _configuration.GetSection(TokenOptions.Jwt).Bind(tokenOptions);

        return tokenOptions;
    }
}
