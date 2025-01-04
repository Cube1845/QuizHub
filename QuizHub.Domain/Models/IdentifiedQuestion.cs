using Microsoft.AspNetCore.Http;
using QuizHub.Domain.Entities;

namespace QuizHub.Domain.Models;

public class IdentifiedQuestion() : UnidentifiedQuestion
{
    public Guid Id { get; set; }
    public new List<IdentifiedAnswer> Answers { get; set; } = [];
    public new Image? Image { get; set; }
}

