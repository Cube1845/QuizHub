using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Modules.Auth.Interfaces;
using QuizHub.Infrastructure.Auth.Entities;
using QuizHub.Infrastructure.Data;

namespace QuizHub.Infrastructure.Auth.Services;

public class AuthRepository(AppDbContext context, PasswordHashService hashService) : IAuthRepository
{
    private readonly AppDbContext _context = context;
    private readonly PasswordHashService _hashService = hashService;

    public async Task<bool> UserExists(string email, CancellationToken ct = default)
    {
        var userExists = await _context.AppUsers.AnyAsync(user => user.Email == email, ct);

        return userExists;
    }

    public async Task AddNewUser(string email, string password, CancellationToken ct = default)
    {
        var hashedPassword = _hashService.HashPaswordWithSalt(password);

        AppUser appUser = new(email, hashedPassword);

        await _context.AppUsers.AddAsync(appUser, ct);
        await _context.SaveChangesAsync(ct);
    }

    public async Task<Guid?> GetUserIdIfPasswordCorrect(string email, string password, CancellationToken ct = default)
    {
        var appUser = await _context.AppUsers.FirstOrDefaultAsync(user => user.Email == email, ct);
        var correctPasswordHash = appUser!.PasswordHash;

        var passwordHashesMatch = _hashService.VerifyPassword(password, correctPasswordHash);

        if (!passwordHashesMatch)
        {
            return null;
        }

        return appUser.Id;
    }
}
