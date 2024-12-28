using Microsoft.AspNetCore.Http;

namespace QuizHub.Domain.Models;

public class UnidentifiedAnswer
{
    public string? Content { get; set; }
    public bool IsCorrect { get; set; }
    public IFormFile? Image { get; set; } = null!;
}
