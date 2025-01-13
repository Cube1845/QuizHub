using QuizHub.Application.Common.Extensions;

namespace QuizHub.Application.Modules.Image.Endpoints.Get;

public class GetImageValidator : Validator<GetImageRequest>
{
    public GetImageValidator()
    {
        RuleFor(x => x.ImageId)
            .NotEmpty()
            .MustBeCorrectGuid();
    }
}
