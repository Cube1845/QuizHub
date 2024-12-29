using Microsoft.AspNetCore.Http;
using QuizHub.Application.Common.Abstract;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Domain.Entities;

namespace QuizHub.Application.Modules.QuestionBase.Endpoints.Add;

public class AddQuestionBaseEndpoint(IAppDbContext context) : IdentifiedEndpoint<AddQuestionBaseRequest, Result<AddQuestionBaseResponse>>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Post("question-base");
    }

    public override async Task HandleAsync(AddQuestionBaseRequest req, CancellationToken ct)
    {
        var userId = GetUserId();

        var questionBase = new Domain.Entities.QuestionBase()
        {
            Name = req.Name,
            OwnerId = userId,
        };

        await _context.QuestionBases.AddAsync(questionBase, ct);
        await _context.SaveChangesAsync(ct);

        AddQuestionBaseResponse data = new(questionBase.Id);

        await SendOkAsync(Result<AddQuestionBaseResponse>.Success(data), ct);
    }
}
