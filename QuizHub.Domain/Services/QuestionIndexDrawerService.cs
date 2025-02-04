namespace QuizHub.Domain.Services;

public static class QuestionIndexDrawerService
{
    public static List<int> DrawIndexes(int count, int size)
    {
        List<int> indexes = [];

        for (int i = 0; i < count; i++)
        {
            int index;

            do
            {
                index = Random.Shared.Next(0, size);
            }
            while (indexes.Contains(index));

            indexes.Add(index);
        }

        return indexes;
    }
}
