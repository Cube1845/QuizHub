using QuizHub.Domain.Entities;

namespace QuizHub.Domain.Models;

public class IdentifiedAnswer : UnidentifiedAnswer
{
    public Guid Id { get; set; }
    public new Image? Image { get; set; } = null!;
}
