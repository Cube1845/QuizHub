namespace QuizHub.Application.Modules.Auth.Interfaces;

public interface IAuthRepository
{
    Task<bool> UserExists(string email, CancellationToken ct = default);
    Task AddNewUser(string email, string password, CancellationToken ct = default);
    Task<Guid?> GetUserIdIfPasswordCorrect(string email, string password, CancellationToken ct = default);
}
