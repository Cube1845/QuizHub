namespace QuizHub.Application.Modules.TestOptions.Models;

public class TestOptionsDto
{
    public int QuestionCount { get; set; }
    public List<QuestionBaseWithNameAndQuestionCountDto> UsedQuestionBases { get; set; } = [];
}
