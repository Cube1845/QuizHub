namespace QuizHub.Application.Common.Models;

public static class FileExtensionsHelper
{
    public const string ImageJpeg = "image/jpeg";
    public const string ImageJpg = "image/jpg";
    public const string ImagePng = "image/png";

    public const string ZipArchive = "application/zip";
    public const string ZipArchiveCompressed = "application/x-zip-compressed";

    public static string ConvertExtensionToContentType(string contentType)
    {
        return contentType switch
        {
            ".jpeg" => ImageJpeg,
            ".jpg" => ImageJpg,
            ".png" => ImagePng,
            ".zip" => ZipArchive,
            _ => string.Empty
        };
    }

    public static readonly List<string> ImageExtensions = [".jpeg", ".jpg", ".png"];

    public static bool IsImageFile(string contentType)
    {
        List<string> imageContentTypes = [ImageJpeg, ImageJpg, ImagePng];

        return imageContentTypes.Contains(contentType);
    }
}