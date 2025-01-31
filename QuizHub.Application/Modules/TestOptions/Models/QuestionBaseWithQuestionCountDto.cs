namespace QuizHub.Application.Modules.TestOptions.Models;

public class QuestionBaseWithQuestionCountDto
{
    public int? MinimalQuestionCount { get; set; }
    public Guid QuestionBaseId { get; set; }
}

public class QuestionBaseWithNameAndQuestionCountDto
{
    public int? MinimalQuestionCount { get; set; }
    public Guid QuestionBaseId { get; set; }
    public string QuestionBaseName { get; set; } = string.Empty;
}
