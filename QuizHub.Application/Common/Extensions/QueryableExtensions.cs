namespace QuizHub.Application.Common.Extensions;

public static class QueryableExtensions
{
    public static IQueryable<T> GetPage<T>(this IQueryable<T> queryable, int pageNumber, int pageSize)
        where T : class
    {
        var totalCount = queryable.Count();

        if (totalCount < ((pageNumber - 1) * pageSize) + 1)
        {
            throw new Exception("Nie ma takiej strony");
        }

        return queryable.Skip((pageNumber - 1) * pageSize).Take(pageSize);
    }
}
