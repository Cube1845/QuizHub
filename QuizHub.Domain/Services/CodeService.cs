namespace QuizHub.Domain.Services;

public static class CodeService
{
    private static readonly int _codeSize = 8;

    private static readonly string _smallLetters = "abcdefghijklmnopqrstuwxyz";
    private static readonly string _bigLetters = "ABCDEFGHIJKLMNOPQRSTUWXYZ";
    private static readonly string _numbers = "0123456789";

    public static string GenerateCode()
    {
        var alphanumericChars = _smallLetters + _bigLetters + _numbers;

        var range = Enumerable.Range(1, _codeSize);

        var code = range.Select(x =>
            alphanumericChars[Random.Shared.Next(0, alphanumericChars.Length)]
        ).ToList();

        return string.Join("", code);
    }
}
