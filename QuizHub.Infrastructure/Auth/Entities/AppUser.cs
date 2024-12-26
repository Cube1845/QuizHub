using QuizHub.Application.Modules.Auth.Interfaces;

namespace QuizHub.Infrastructure.Auth.Entities;

public class AppUser(string email = "", string passwordHash = "") : IAppUser
{
    public Guid Id { get; set; }
    public string Email { get; set; } = email;
    public string PasswordHash { get; set; } = passwordHash;
}
