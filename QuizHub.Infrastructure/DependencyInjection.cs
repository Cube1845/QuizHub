using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using QuizHub.Application.Interfaces;
using QuizHub.Application.Modules.Auth.Interfaces;
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

        services.AddScoped<IAppDbContext, AppDbContext>();

        services.AddScoped<IAuthRepository, AuthRepository>();
        services.AddScoped<PasswordHashService>();
        services.AddScoped<IAccessTokenService, AccessTokenService>();
        services.AddScoped<TokenConfiguration>();

        return services;
    }
}