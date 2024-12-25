using FastEndpoints;
using FastEndpoints.Security;
using QuizHub.Application.Common.Models;

namespace QuizHub.Application.Modules.Auth.Login;

public class LoginEndpoint : Endpoint<LoginRequest, Result<LoginResponse>>
{
    public override void Configure()
    {
        Post("/api/auth/login");
        AllowAnonymous();
    }

    public override async Task HandleAsync(LoginRequest req, CancellationToken ct)
    {
        var token = JwtBearer.CreateToken(options =>
        {
            options.ExpireAt = DateTime.UtcNow.AddDays(1);
            options.User.Claims.Add(("UserId", "awdawdaw-awda-awda"));
        });

        await SendOkAsync(Result<LoginResponse>.Success(new LoginResponse(token)));
    }
}
