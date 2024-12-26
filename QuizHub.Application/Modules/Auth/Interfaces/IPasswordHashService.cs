namespace QuizHub.Application.Modules.Auth.Interfaces;

public interface IPasswordHashService
{
    string HashPaswordWithSalt(string password);
    bool VerifyPassword(string password, string hashedPassword);
}
