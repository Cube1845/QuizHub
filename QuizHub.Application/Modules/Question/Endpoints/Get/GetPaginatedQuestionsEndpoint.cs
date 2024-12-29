using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Abstract;
using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Domain.Entities;
using QuizHub.Domain.Models;

namespace QuizHub.Application.Modules.Question.Endpoints.Get;

public class GetPaginatedQuestionsEndpoint(IAppDbContext context) : IdentifiedEndpoint<GetPaginatedQuestionsRequest, Result<GetPaginatedQuestionsResponse>>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Get("question");
    }

    public override async Task HandleAsync(GetPaginatedQuestionsRequest req, CancellationToken ct)
    {
        var questionsPaginatedData = 
            await GetQuestionsDbPaginatedDataAsync(req.QuestionBaseId, req.PageNumber, req.PageSize, ct);

        if (questionsPaginatedData == null)
        {
            await SendOkAsync(Result<GetPaginatedQuestionsResponse>.Error("Błąd danych"), ct);
            return;
        }

        GetPaginatedQuestionsResponse data = new(
            await ConvertToIdentifiedQuestionsPaginatedDataAsync(questionsPaginatedData, ct)
        );

        await SendOkAsync(Result<GetPaginatedQuestionsResponse>.Success(data), ct);
    }

    private async Task<PaginatedData<Domain.Entities.Question>> GetQuestionsDbPaginatedDataAsync(Guid questionBaseId, int pageNumber, int pageSize, CancellationToken ct = default)
    {
        return await _context.QuestionBases
            .Where(questionBase =>
                questionBase.Id == questionBaseId &&
                questionBase.OwnerId == GetUserId()
            )
            .Include(questionBase => questionBase.Questions)
            .SelectMany(questionBase => questionBase.Questions)
            .Include(question => question.Answers)
            .ToPaginatedDataAsync(pageNumber, pageSize, ct);
    }

    private async Task<PaginatedData<IdentifiedQuestion>> ConvertToIdentifiedQuestionsPaginatedDataAsync(PaginatedData<Domain.Entities.Question> paginatedData, CancellationToken ct = default)
    {
        var identifiedQuestions = new List<IdentifiedQuestion>();

        foreach (var question in paginatedData.Data)
        {
            var answers = new List<IdentifiedAnswer>();

            foreach (var answer in question.Answers)
            {
                answers.Add(new IdentifiedAnswer()
                {
                    Id = answer.Id,
                    Content = answer.Content,
                    IsCorrect = answer.IsCorrect,
                    Image = answer.ImageId != null ?
                        await GetImageById(answer.ImageId!.Value) :
                        null
                });
            }

            var questionToAdd = new IdentifiedQuestion()
            {
                Id = question.Id,
                Content = question.Content,
                QuestionType = question.QuestionType,
                Image = question.ImageId != null ?
                        await GetImageById(question.ImageId!.Value) :
                        null,
                Answers = answers
            };

            identifiedQuestions.Add(questionToAdd);
        }

        return new PaginatedData<IdentifiedQuestion>(identifiedQuestions, paginatedData.TotalItems);
    }

    private async Task<Image?> GetImageById(Guid imageId)
    {
        return await _context.Images.FirstOrDefaultAsync(image => image.Id == imageId);
    }
}
