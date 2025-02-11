using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.Client.Models;
using QuizHub.Domain.Entities;
using QuizHub.Domain.Enums;

namespace QuizHub.Application.Modules.Client.Endpoints.Finish;

public class FinishTestEndpoint(IAppDbContext context, TimeProvider timeProvider) : Endpoint<FinishTestRequest, Result<FinishTestResponse>>
{
    private readonly IAppDbContext _context = context;
    private readonly TimeProvider _timeProvider = timeProvider;

    public override void Configure()
    {
        Post("client/finish");
        AllowAnonymous();
    }

    public override async Task HandleAsync(FinishTestRequest req, CancellationToken ct)
    {
        var testSolvingDb = await _context.TestSolvings.FirstOrDefaultAsync(ts => ts.Id == req.TestSolvingId, ct);

        if (testSolvingDb == null)
        {
            await SendOkAsync(Result<FinishTestResponse>.Error("Wystąpił nieoczekiwany błąd"), ct);
            return;
        }

        if (!testSolvingDb.QuestionsDownloaded)
        {
            await SendOkAsync(Result<FinishTestResponse>.Error("Wystąpił nieoczekiwany błąd"), ct);
            return;
        }

        var testDuration = _timeProvider.GetUtcNow().DateTime - testSolvingDb.StartedAt;

        TestLog testLog = new()
        {
            TestId = testSolvingDb.TestId,
            Duration = testDuration!.Value,
            Username = testSolvingDb.Username,
        };

        await _context.TestLogs.AddAsync(testLog, ct);

        var drawnQuestionsDb = await _context.Questions
            .Include(question => question.Answers)
            .Where(question => testSolvingDb.DrawnQuestionsIds.Contains(question.Id))
            .ToListAsync(ct);

        var selectedAnswersDb = ConvertDtoToSelectedAnswersDb(drawnQuestionsDb, req.UserQuestions, testLog.Id);

        await _context.SelectedAnswers.AddRangeAsync(selectedAnswersDb, ct);

        await _context.SaveChangesAsync(ct);

        await SendOkAsync(Result<FinishTestResponse>.Success(new(testLog.Id)), ct);
    }
    
    private List<SelectedAnswer> ConvertDtoToSelectedAnswersDb(List<Domain.Entities.Question> questionsDb, List<QuestionInDto> questionDtos, Guid testLogId)
    {
        List<SelectedAnswer> selectedAnswersDb = [];

        foreach (var questionDb in questionsDb)
        {
            var currentDto = questionDtos.FirstOrDefault(dto => dto.Id == questionDb.Id);

            if (currentDto == null)
            {
                selectedAnswersDb.Add(new(testLogId, questionDb.Id, [], 0));

                continue;
            }

            var scoredPoints = IsSelectedAnswerScored(questionDb, currentDto);

            selectedAnswersDb.Add(new(testLogId, questionDb.Id, currentDto.SelectedAnswerIds, scoredPoints));
        }

        return selectedAnswersDb;
    }

    private int IsSelectedAnswerScored(Domain.Entities.Question questionDb, QuestionInDto questionDto)
    {
        var correctAnswersIds = questionDb.Answers
            .Where(answer => answer.IsCorrect)
            .Select(answer => answer.Id)
            .ToList();

        if (questionDb.QuestionType == QuestionType.SingleAnswer)
        {
            if (questionDto.SelectedAnswerIds.Count != 1)
            {
                return 0;
            }

            var selectedAnswerId = questionDto.SelectedAnswerIds[0];

            if (correctAnswersIds.Contains(selectedAnswerId))
            {
                return 1;
            }
        }
        else if (questionDb.QuestionType == QuestionType.MultiAnswer)
        {
            bool answersCorrect =
                correctAnswersIds.All(questionDto.SelectedAnswerIds.Contains) &&
                questionDto.SelectedAnswerIds.All(correctAnswersIds.Contains);

            if (answersCorrect)
            {
                return 1;
            }
        }

        return 0;
    }
}
