using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Models;

namespace QuizHub.Application.Common.Extensions;

public static class QueryableExtensions
{
    public static IQueryable<T> GetPage<T>(this IQueryable<T> queryable, int pageNumber, int pageSize)
        where T : class
    {
        return queryable.Skip((pageNumber - 1) * pageSize).Take(pageSize);
    }

    public static async Task<PaginatedData<T>> ToPaginatedDataAsync<T>(this IQueryable<T> queryable, int pageNumber, int pageSize, CancellationToken ct = default)
        where T : class
    {
        if (queryable == null || queryable.Count() == 0)
        {
            return new([], 0);
        }

        var totalCount = await queryable.CountAsync(ct);

        if (totalCount < ((pageNumber - 1) * pageSize) + 1)
        {
            throw new Exception("Nie ma takiej strony");
        }

        var items = await queryable.GetPage(pageNumber, pageSize).ToListAsync(ct);

        return new(items, totalCount);
    }
}
