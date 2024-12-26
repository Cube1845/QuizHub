namespace QuizHub.Application.Modules.Auth.Interfaces;

public interface IAppUser
{
    public Guid Id { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
}
