using Microsoft.AspNetCore.Http;
using QuizHub.Domain.Enums;

namespace QuizHub.Domain.Models;

public class UnidentifiedQuestion
{
    public string Content { get; set; } = string.Empty;
    public QuestionType QuestionType { get; set; }
    public IFormFile? Image { get; set; }
    public List<UnidentifiedAnswer> Answers { get; set; } = [];
}
