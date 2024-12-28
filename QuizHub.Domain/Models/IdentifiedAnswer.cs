namespace QuizHub.Domain.Models;

public class IdentifiedAnswer : UnidentifiedAnswer
{
    public Guid Id { get; set; }
    public new BaseImage? Image { get; set; } = null!;
}
