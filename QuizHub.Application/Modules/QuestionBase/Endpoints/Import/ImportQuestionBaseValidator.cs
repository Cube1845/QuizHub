using QuizHub.Application.Common.Models;

namespace QuizHub.Application.Modules.QuestionBase.Endpoints.Import;

public class ImportQuestionBaseValidator : Validator<ImportQuestionBaseRequest>
{
    public ImportQuestionBaseValidator()
    {
        RuleFor(x => x.QuestionBaseZip)
            .NotNull()
            .Must(x => 
                x.ContentType == FileExtensionsHelper.ZipArchiveCompressed ||
                x.ContentType == FileExtensionsHelper.ZipArchive
            );
    }
}
