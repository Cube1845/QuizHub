using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Modules.Question.Models;

namespace QuizHub.Application.Modules.QuestionBase.Endpoints.Export;

public class ExportQuestionBaseEndpoint(IAppDbContext context) : Endpoint<ExportQuestionBaseRequest>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Get("/question-base/file/{QuestionBaseId}");
    }

    public override async Task HandleAsync(ExportQuestionBaseRequest req, CancellationToken ct)
    {
        var userId = User.GetId();

        var questionBase = await _context.QuestionBases
            .Include(qb => qb.Questions)
            .ThenInclude(q => q.Answers)
            .FirstOrDefaultAsync(qb => 
                qb.Id == req.QuestionBaseId &&
                qb.OwnerId == userId
            , ct);

        if (questionBase == null)
        {
            await SendNotFoundAsync(ct);
            return;
        }

        var questionBaseDto = ConvertToQuestionBaseDto(questionBase);
        var serializedQuestionBase = JsonConvert.SerializeObject(questionBaseDto);
    }
    private FileManagementQuestionBaseDto ConvertToQuestionBaseDto(Domain.Entities.QuestionBase questionBaseDb)
    {
        var questions = questionBaseDb.Questions
            .Select(ConvertToQuestionDto);

        return new FileManagementQuestionBaseDto(questionBaseDb.Name, questions.ToList());
    }

    private FileManagementQuestionDto ConvertToQuestionDto(Domain.Entities.Question questionDb)
    {
        return new FileManagementQuestionDto
        {
            Content = questionDb.Content,
            ImageId = questionDb.ImageId,
            QuestionType = questionDb.QuestionType,
            Answers = questionDb.Answers
                .Select(ConvertToAnswerDto)
                .ToList()
        };
    }

    private FileManagementAnswerDto ConvertToAnswerDto(Domain.Entities.Answer answerDb)
    {
        return new FileManagementAnswerDto
        {
            Content = answerDb.Content,
            IsCorrect = answerDb.IsCorrect,
            ImageId = answerDb.ImageId
        };
    }
}
