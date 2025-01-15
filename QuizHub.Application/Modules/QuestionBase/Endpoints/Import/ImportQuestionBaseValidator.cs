using QuizHub.Application.Common.Models;

namespace QuizHub.Application.Modules.QuestionBase.Endpoints.Import;

public class ImportQuestionBaseValidator : Validator<ImportQuestionBaseRequest>
{
    public ImportQuestionBaseValidator()
    {
        //not working something, disabled for now
        //RuleFor(x => x.QuestionBaseZip)
        //    .NotNull()
        //    .Must(x => x.ContentType == FileExtensionsHelper.ZipArchive);
    }
}
