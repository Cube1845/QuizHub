namespace QuizHub.Application.Common.Models;

public class PaginatedData<T>(List<T> data, int totalItems)
    where T : class
{
    public List<T> Data { get; private init; } = data;
    public int TotalItems { get; private init; } = totalItems;

    public static PaginatedData<T> ToPaginatedData(List<T> data, int totalItems)
    {
        return new PaginatedData<T>(data, totalItems);
    }
}
