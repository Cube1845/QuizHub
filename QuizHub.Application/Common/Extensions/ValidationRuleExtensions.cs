using Microsoft.AspNetCore.Http;
using SkiaSharp;

namespace QuizHub.Application.Common.Extensions;

public static class ValidationRuleExtensions
{
    public static IRuleBuilderOptions<T, Guid> MustBeCorrectGuid<T>(this IRuleBuilder<T, Guid> ruleBuilder)
    {
        return ruleBuilder.Must(guid => guid != Guid.Empty).WithMessage("Niepoprawne id");
    }

    public static IRuleBuilderOptions<T, IEnumerable<Guid?>> MustBeCorrectGuidsOrNulls<T>(this IRuleBuilder<T, IEnumerable<Guid?>> ruleBuilder)
    {
        return ruleBuilder.Must(guidList => 
            guidList.All(g => 
                g == null ||
                g != Guid.Empty
            )
        ).WithMessage("Niepoprawne id");
    }

    public static IRuleBuilderOptions<T, IFormFile?> MustBeCorrectImageFile<T>(this IRuleBuilder<T, IFormFile?> ruleBuilder)
    {
        return ruleBuilder.Must(imagefile =>
            imagefile == null ||
            IsFileCorrectImage(imagefile)
        ).WithMessage("Niepoprawny obraz");
    }

    private static bool IsFileCorrectImage(IFormFile file)
    {
        var imageFormats = new List<string> { "image/jpeg", "image/jpg", "image/png" };

        if (!imageFormats.Contains(file.ContentType))
        {
            return false;
        }

        SKBitmap? bitMap;

        using (var stream = file.OpenReadStream())
        {
            using var skStream = new SKManagedStream(stream);
            bitMap = SKBitmap.Decode(skStream);
        }

        if (bitMap == null)
        {
            return false;
        }

        if (bitMap.Width > 4000 || bitMap.Height > 4000)
        {
            return false;
        }

        return true;
    }
}
