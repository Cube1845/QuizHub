using QuizHub.Domain.Models;

namespace QuizHub.Application.Modules.Question.Models;

public class FileManagementQuestionDto : UnidentifiedQuestionWithNoImage<FileManagementAnswerDto>
{
    public Guid? ImageId { get; set; }
}
