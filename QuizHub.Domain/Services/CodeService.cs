namespace QuizHub.Domain.Services;

public static class CodeService
{
    private static readonly int _codeSize = 8;

    private static readonly string _smallLetters = "abcdefghijklmnopqrstuwxyz";
    private static readonly string _bigLetters = "ABCDEFGHIJKLMNOPQRSTUWXYZ";
    private static readonly string _numbers = "0123456789";

    public static string GenerateCode()
    {
        var alphanumericChars = (_smallLetters + _bigLetters + _numbers).Split("");

        var range = Enumerable.Range(0, _codeSize - 1);

        var code = range.Select(x => 
            alphanumericChars[Random.Shared.Next(0, alphanumericChars.Length)]
        ).ToString()!;

        return code;
    }
}
