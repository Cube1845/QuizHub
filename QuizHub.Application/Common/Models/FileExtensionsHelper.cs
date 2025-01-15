namespace QuizHub.Application.Common.Models;

public static class FileExtensionsHelper
{
    public const string ImageJpeg = "image/jpeg";
    public const string ImageJpg = "image/jpg";
    public const string ImagePng = "image/png";

    public const string ZipArchive = "application/zip";

    public static bool IsImageFile(string contentType)
    {
        List<string> imageExtensions = [ImageJpeg, ImageJpg, ImagePng];

        return imageExtensions.Contains(contentType);
    }
}