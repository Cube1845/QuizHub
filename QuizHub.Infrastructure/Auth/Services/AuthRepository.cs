using Microsoft.EntityFrameworkCore;
using QuizHub.Infrastructure.Auth.Entities;
using QuizHub.Infrastructure.Data;

namespace QuizHub.Infrastructure.Auth.Services;

public class AuthRepository(AppDbContext context)
{
    private readonly AppDbContext _context = context;

    public async Task<bool> UserExists(string email, CancellationToken ct = default)
    {
        var userExists = await _context.AppUsers.AnyAsync(user => user.Email == email, ct);

        return userExists;
    }

    public async Task<AppUser?> GetUser(string email, CancellationToken ct = default)
    {
        var user = await _context.AppUsers.FirstOrDefaultAsync(user => user.Email == email, ct);

        return user;
    }

    public async Task AddNewUser(string email, string passwordHash, CancellationToken ct = default)
    {
        AppUser appUser = new(email, passwordHash);

        await _context.AppUsers.AddAsync(appUser, ct);
        await _context.SaveChangesAsync(ct);
    }
}
