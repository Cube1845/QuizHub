using FastEndpoints;
using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Models;
using QuizHub.Infrastructure.Auth.Services;
using QuizHub.Infrastructure.Data;

namespace QuizHub.Infrastructure.Auth.Endpoints.ChangePassword;

public class ChangePasswordEndpoint(AppDbContext context, PasswordHashService passwordHashService) : Endpoint<ChangePasswordRequest, Result>
{
    private readonly AppDbContext _context = context;
    private readonly PasswordHashService _passwordHashService = passwordHashService;

    public override void Configure()
    {
        Put("auth/password");
    }

    public override async Task HandleAsync(ChangePasswordRequest req, CancellationToken ct)
    {
        var userId = User.GetId();

        var userDb = await _context.AppUsers.FindAsync([userId], ct);

        if (userDb == null)
        {
            await SendOkAsync(Result.Error("Błąd danych użytkownika"), ct);
            return;
        }

        var oldPasswordCorrect = _passwordHashService.VerifyPassword(req.OldPassword, userDb!.PasswordHash);

        if (!oldPasswordCorrect)
        {
            await SendOkAsync(Result.Error("Obecne hasło nie zgadza się"), ct);
            return;
        }

        if (req.NewPassword == req.OldPassword)
        {
            await SendOkAsync(Result.Error("Nowe hasło nie może być takie samo jak obecne"), ct);
            return;
        }

        userDb.PasswordHash = _passwordHashService.HashPaswordWithSalt(req.NewPassword);

        await _context.SaveChangesAsync(ct);

        await SendOkAsync(Result.Success(), ct);
    }
}
