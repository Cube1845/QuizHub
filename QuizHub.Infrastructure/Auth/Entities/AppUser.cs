namespace QuizHub.Infrastructure.Auth.Entities;

public class AppUser(string username = "", string passwordHash = "")
{
    public Guid Id { get; set; }
    public string Username { get; set; } = username;
    public string PasswordHash { get; set; } = passwordHash;
    public ICollection<RefreshToken> RefreshTokens { get; set; } = [];
}
