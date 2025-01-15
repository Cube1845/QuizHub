using Microsoft.AspNetCore.Http;
using QuizHub.Application.Common.Models;
using SkiaSharp;

namespace QuizHub.Application.Common.Extensions;

public static class ValidationRuleExtensions
{
    private const int MaxImageSize = 500;

    public static IRuleBuilderOptions<T, Guid> MustBeCorrectGuid<T>(this IRuleBuilder<T, Guid> ruleBuilder)
    {
        return ruleBuilder.Must(guid => guid != Guid.Empty).WithMessage("Niepoprawne id");
    }

    public static IRuleBuilderOptions<T, IEnumerable<Guid?>> MustBeCorrectGuidsOrNulls<T>(this IRuleBuilder<T, IEnumerable<Guid?>> ruleBuilder)
    {
        return ruleBuilder
            .ForEach(rule => 
                rule.Must(guid =>
                    guid == null || guid != Guid.Empty
                )
            )
            .WithMessage("Niepoprawne id");
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
        if (!FileExtensionsHelper.IsImageFile(file.ContentType))
        {
            return false;
        }

        SKBitmap? bitMap;

        using var stream = file.OpenReadStream();
        using var skStream = new SKManagedStream(stream);

        bitMap = SKBitmap.Decode(skStream);

        if (bitMap == null)
        {
            return false;
        }

        if (bitMap.Width > MaxImageSize || bitMap.Height > MaxImageSize)
        {
            return false;
        }

        return true;
    }
}
