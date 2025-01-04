using Microsoft.AspNetCore.Http;
using QuizHub.Domain.Entities;

namespace QuizHub.Domain.Models;

public class IdentifiedAnswer() : UnidentifiedAnswerWithNoImage
{
    public Guid Id { get; set; }
    public Guid? ImageId { get; set; }
}
