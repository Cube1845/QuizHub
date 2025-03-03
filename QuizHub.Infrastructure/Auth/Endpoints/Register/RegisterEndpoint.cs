using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Models;
using QuizHub.Infrastructure.Auth.Entities;
using QuizHub.Infrastructure.Auth.Services;
using QuizHub.Infrastructure.Data;

namespace QuizHub.Infrastructure.Auth.Endpoints.Register;

public class RegisterEndpoint(AppDbContext context, PasswordHashService passwordHashService) : Endpoint<RegisterRequest>
{
    private readonly AppDbContext _context = context;
    private readonly PasswordHashService _passwordHashService = passwordHashService;

    public override void Configure()
    {
        Post("auth/register");
        AllowAnonymous();
    }

    public override async Task HandleAsync(RegisterRequest req, CancellationToken ct)
    {
        if (await _context.AppUsers.AnyAsync(user => user.Email == req.Email, ct))
        {
            await SendOkAsync(Result.Error("Konto z takim adresem email już istnieje"), ct);
            return;
        }

        var passwordHash = _passwordHashService.HashPaswordWithSalt(req.Password);


        AppUser appUser = new(req.Email, passwordHash);
        await _context.AppUsers.AddAsync(appUser, ct);

        await _context.SaveChangesAsync(ct);

        await SendOkAsync(Result.Success(), ct);
    }
}
