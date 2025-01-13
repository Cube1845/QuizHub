using QuizHub.Domain.Models;

namespace QuizHub.Application.Modules.Question.Models;

public class FileManagementAnswerDto : UnidentifiedAnswerWithNoImage
{
    public Guid? ImageId { get; set; }
}
