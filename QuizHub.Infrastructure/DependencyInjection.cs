using FastEndpoints;
using FastEndpoints.Security;
using FastEndpoints.Swagger;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Infrastructure.Auth.Config;
using QuizHub.Infrastructure.Auth.Services;
using QuizHub.Infrastructure.Data;

namespace QuizHub.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureDI(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
        {
            options.UseSqlServer(configuration.GetConnectionString("SqlServer"));
        });

        services.AddHttpContextAccessor();

        services.AddScoped<IAppDbContext, AppDbContext>();

        services.AddScoped<AuthRepository>();
        services.AddScoped<PasswordHashService>();
        services.AddScoped<TokenService>();
        services.AddScoped<TokenConfiguration>();

        services
            .AddAuthenticationJwtBearer(s => s.SigningKey = configuration["JwtSettings:SecretKey"]!)
            .AddAuthorization()
            .AddFastEndpoints().SwaggerDocument();

        services.Configure<JwtCreationOptions>(o => o.SigningKey = configuration["JwtSettings:SecretKey"]!);

        return services;
    }
}