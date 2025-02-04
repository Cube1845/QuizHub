namespace QuizHub.Domain.Services;

public static class CodeService
{
    private static readonly int _codeSize = 8;

    private static readonly string _smallLetters = "abcdefghijklmnopqrstuwxyz";
    private static readonly string _bigLetters = "ABCDEFGHIJKLMNOPQRSTUWXYZ";
    private static readonly string _numbers = "0123456789";

    private static readonly string _alphanumeric = _smallLetters + _bigLetters + _numbers;

    public static string GenerateCode()
    {
        var range = Enumerable.Range(1, _codeSize);

        var code = range.Select(x =>
            _alphanumeric[Random.Shared.Next(0, _alphanumeric.Length)]
        ).ToList();

        return string.Join("", code);
    }
}
