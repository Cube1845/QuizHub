using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Models;
using QuizHub.Infrastructure.Auth.Services;
using QuizHub.Infrastructure.Data;
using System.Security.Claims;

namespace QuizHub.Infrastructure.Auth.Endpoints.Login;

public class LoginEndpoint(AppDbContext context, PasswordHashService passwordHashService) : Endpoint<LoginRequest, LoginResponse>
{
    private readonly AppDbContext _context = context;
    private readonly PasswordHashService _passwordHashService = passwordHashService;

    public override void Configure()
    {
        Post("auth/login");
        AllowAnonymous();
    }

    public override async Task HandleAsync(LoginRequest req, CancellationToken ct)
    {
        var user = await _context.AppUsers.FirstOrDefaultAsync(user => user.Email == req.Email, ct) ??
            throw new DomainException("Niepoprawny email lub hasło");

        var passwordCorrect = _passwordHashService.VerifyPassword(req.Password, user!.PasswordHash);

        if (!passwordCorrect)
        {
            throw new DomainException("Niepoprawny email lub hasło");
        }

        Response = await CreateTokenWith<TokenService>(user.Id.ToString(), u =>
        {
            u.Claims.Add(new(ClaimTypes.NameIdentifier, user.Id.ToString()));
        });
    }
}
