namespace QuizHub.Application.Modules.Client.Models;

public class QuestionBaseInfoDto
{
    public Guid QuestionBaseId { get; set; }
    public List<Guid> QuestionIds { get; set; } = [];
    public int? SpecifiedMinimalCount { get; set; }
}
