using QuizHub.Domain.Models;

namespace QuizHub.Application.Modules.QuestionBase.Models;

public class FileManagementAnswerDto : UnidentifiedAnswerWithNoImage
{
    public Guid? ImageId { get; set; }
}
