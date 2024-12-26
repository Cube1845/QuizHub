using FastEndpoints;
using FastEndpoints.Security;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace QuizHub.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationDI(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddAuthenticationJwtBearer(s => s.SigningKey = configuration["JwtSettings:SecretKey"]!)
            .AddAuthorization()
            .AddFastEndpoints();

        services.Configure<JwtCreationOptions>(o => o.SigningKey = configuration["JwtSettings:SecretKey"]!);

        return services;
    }
}