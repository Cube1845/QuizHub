namespace QuizHub.Domain.Models;

public class IdentifiedQuestion() : UnidentifiedQuestionWithNoImage
{
    public Guid Id { get; set; }
    public new List<IdentifiedAnswer> Answers { get; set; } = [];
    public Guid? ImageId { get; set; }
}

