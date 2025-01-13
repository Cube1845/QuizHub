namespace QuizHub.Domain.Models;

public class IdentifiedQuestion : UnidentifiedQuestionWithNoImage<IdentifiedAnswer>
{
    public Guid Id { get; set; }
    public Guid? ImageId { get; set; }
}

