namespace QuizHub.Application.Modules.Question.Models;

public class FileManagementQuestionBaseDto(string name, List<FileManagementQuestionDto> questions)
{
    public string Name { get; set; } = name;
    public List<FileManagementQuestionDto> Questions { get; set; } = questions;
}
