using QuizHub.Application.Modules.Auth.Models;

namespace QuizHub.Application.Modules.Auth.Interfaces;

public interface IAccessTokenService
{
    public AuthData GenerateAuthData(Guid userId);
}
