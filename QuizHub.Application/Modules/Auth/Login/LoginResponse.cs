using QuizHub.Application.Modules.Auth.Models;

namespace QuizHub.Application.Modules.Auth.Login;

public record LoginResponse(string AccessToken, DateTime ExpirationDate) : AuthData(AccessToken, ExpirationDate);
