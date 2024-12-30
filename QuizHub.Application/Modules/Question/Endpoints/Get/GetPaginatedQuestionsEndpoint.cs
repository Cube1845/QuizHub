using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Abstract;
using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.Question.Extensions;
using QuizHub.Domain.Models;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace QuizHub.Application.Modules.Question.Endpoints.Get;

public class GetPaginatedQuestionsEndpoint(IAppDbContext context, IImageService imageService) : IdentifiedEndpoint<GetPaginatedQuestionsRequest, Result<GetPaginatedQuestionsResponse>>
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
        var questionsDb = await _context.QuestionBases
            .Where(questionBase =>
                questionBase.Id == questionBaseId &&
                questionBase.OwnerId == GetUserId()
            )
            .Include(questionBase => questionBase.Questions)
            .ThenInclude(question => question.Answers)
            .SelectMany(questionBase => questionBase.Questions)
            .GetPage(pageNumber, pageSize)
            .ToListAsync();

        var totalItems = await _context.QuestionBases
            .Where(questionBase =>
                questionBase.Id == questionBaseId &&
                questionBase.OwnerId == GetUserId()
            )
            .Include(questionBase => questionBase.Questions)
            .ThenInclude(question => question.Answers)
            .SelectMany(questionBase => questionBase.Questions)
            .CountAsync();

        var identifiedQuestions = new List<IdentifiedQuestion>();

        foreach (var question in questionsDb)
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
                        await imageService.GetImageByIdAsync(answer.ImageId!.Value, ct) :
                        null
                });
            }

            var questionToAdd = new IdentifiedQuestion()
            {
                Id = question.Id,
                Content = question.Content,
                QuestionType = question.QuestionType,
                Image = question.ImageId != null ?
                        await imageService.GetImageByIdAsync(question.ImageId!.Value, ct) :
                        null,
                Answers = answers
            };

            identifiedQuestions.Add(questionToAdd);
        }

        return PaginatedData<IdentifiedQuestion>.ToPaginatedData(identifiedQuestions, totalItems);
    }
}
