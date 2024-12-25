using QuizHub.Application;
using QuizHub.Infrastructure;

namespace QuizHub.API;

public static class DependencyInjection
{
    public static IServiceCollection AddAppDI(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddInfrastructureDI(configuration)
            .AddApplicationDI(configuration);

        return services;
    }
}
