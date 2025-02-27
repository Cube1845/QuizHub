namespace QuizHub.Application.Common.Extensions;

public static class EnumerableExtensions
{
    public static IEnumerable<T> GetPage<T>(this IEnumerable<T> enumerable, int pageNumber, int pageSize)
        where T : class
    {
        var totalCount = enumerable.Count();

        if (totalCount < ((pageNumber - 1) * pageSize) + 1)
        {
            return [];
        }

        return enumerable.Skip((pageNumber - 1) * pageSize).Take(pageSize);
    }
}
