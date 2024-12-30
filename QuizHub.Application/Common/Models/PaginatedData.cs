namespace QuizHub.Application.Common.Models;

public class PaginatedData<T>(List<T> data, int totalItems)
    where T : class
{
    public List<T> Data { get; private init; } = data;
    public int TotalItems { get; private init; } = totalItems;
}
