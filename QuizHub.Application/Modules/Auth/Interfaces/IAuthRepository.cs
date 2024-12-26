namespace QuizHub.Application.Modules.Auth.Interfaces;

public interface IAuthRepository
{
    Task<bool> UserExists(string email, CancellationToken ct = default);
    Task AddNewUser(string email, string passwordHash, CancellationToken ct = default);
    Task<IAppUser?> GetUser(string email, CancellationToken ct = default);
}
