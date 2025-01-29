using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Domain.Entities;
using QuizHub.Domain.Services;

namespace QuizHub.Application.Modules.TestCreator.Endpoints.Add;

public class AddTestEndpoint(IAppDbContext context) : Endpoint<AddTestRequest, Result<AddTestResponse>>
{
    private readonly IAppDbContext _context = context;

    private const int DefaultQuestionCount = 10;

    public override void Configure()
    {
        Post("test");
    }

    public override async Task HandleAsync(AddTestRequest req, CancellationToken ct)
    {
        var userId = User.GetId();

        Test test = new()
        {
            OwnerId = userId,
            Code = CodeService.GenerateCode(),
            Name = req.Name,
            IsActive = false,
        };

        await _context.Tests.AddAsync(test, ct);

        Domain.Entities.TestOptions options = new()
        {
            QuestionCount = DefaultQuestionCount,
            TestId = test.Id,
        };

        await _context.TestsOptions.AddAsync(options, ct);

        await _context.SaveChangesAsync(ct);
        await SendOkAsync(Result<AddTestResponse>.Success(new(test.Id)), ct);
    }
}
