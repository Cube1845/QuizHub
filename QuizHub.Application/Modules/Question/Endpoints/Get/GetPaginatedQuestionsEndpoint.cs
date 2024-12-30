using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Domain.Models;

namespace QuizHub.Application.Modules.Question.Endpoints.Get;

public class GetPaginatedQuestionsEndpoint(IAppDbContext context, IImageService imageService) : Endpoint<GetPaginatedQuestionsRequest, Result<GetPaginatedQuestionsResponse>>
{
    private readonly IAppDbContext _context = context;
    private readonly IImageService _imageService = imageService;

    public override void Configure()
    {
        Get("question");
    }

    public override async Task HandleAsync(GetPaginatedQuestionsRequest req, CancellationToken ct)
    {
        var questionsPaginatedData = 
            await GetIdentifiedQuestionsPaginatedDataAsync(req.QuestionBaseId, req.PageNumber, req.PageSize, ct);

        if (questionsPaginatedData == null)
        {
            await SendOkAsync(Result<GetPaginatedQuestionsResponse>.Error("Błąd danych"), ct);
            return;
        }

        GetPaginatedQuestionsResponse data = new(
            questionsPaginatedData
        );

        await SendOkAsync(Result<GetPaginatedQuestionsResponse>.Success(data), ct);
    }

    private async Task<PaginatedData<IdentifiedQuestion>> GetIdentifiedQuestionsPaginatedDataAsync(Guid questionBaseId, int pageNumber, int pageSize, CancellationToken ct = default)
    {
        var userId = this.GetUserId();

        var questionsDb = await _context.QuestionBases
            .Where(questionBase =>
                questionBase.Id == questionBaseId &&
                questionBase.OwnerId == userId
            )
            .Include(questionBase => questionBase.Questions)
            .ThenInclude(question => question.Answers)
            .SelectMany(questionBase => questionBase.Questions)
            .GetPage(pageNumber, pageSize)
            .ToListAsync();

        var totalItems = await _context.QuestionBases
            .Where(questionBase =>
                questionBase.Id == questionBaseId &&
                questionBase.OwnerId == userId
            )
            .SelectMany(questionBase => questionBase.Questions)
            .CountAsync();

        List<IdentifiedQuestion> identifiedQuestions = [];

        foreach (var question in questionsDb)
        {
            List<IdentifiedAnswer> answers = [];

            foreach (var answer in question.Answers)
            {
                answers.Add(new IdentifiedAnswer()
                {
                    Id = answer.Id,
                    Content = answer.Content,
                    IsCorrect = answer.IsCorrect,
                    Image = answer.ImageId != null ?
                        await _imageService.GetImageByIdAsync(answer.ImageId!.Value, ct) :
                        null
                });
            }

            var questionToAdd = new IdentifiedQuestion()
            {
                Id = question.Id,
                Content = question.Content,
                QuestionType = question.QuestionType,
                Image = question.ImageId != null ?
                        await _imageService.GetImageByIdAsync(question.ImageId!.Value, ct) :
                        null,
                Answers = answers
            };

            identifiedQuestions.Add(questionToAdd);
        }

        return new PaginatedData<IdentifiedQuestion>(identifiedQuestions, totalItems);
    }
}
