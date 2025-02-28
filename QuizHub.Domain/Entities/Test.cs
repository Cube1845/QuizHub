namespace QuizHub.Domain.Entities;

public class Test
{
    public Guid Id { get; set; }
    public Guid OwnerId { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public TestOptions? Options { get; set; }
    public ICollection<TestLog> TestLogs { get; set; } = [];

    public void ToggleActiveState()
    {
        IsActive = !IsActive;
    }
}
