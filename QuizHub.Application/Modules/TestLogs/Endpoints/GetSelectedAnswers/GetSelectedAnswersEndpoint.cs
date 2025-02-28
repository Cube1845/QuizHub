using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Extensions;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.TestLogs.Models;
using QuizHub.Domain.Entities;
using System.Reflection.Metadata.Ecma335;

namespace QuizHub.Application.Modules.TestLogs.Endpoints.GetSelectedAnswers;

public class GetSelectedAnswersEndpoint(IAppDbContext context) : Endpoint<GetSelectedAnswersRequest, Result<GetSelectedAnswerResponse>>
{
    private readonly IAppDbContext _context = context;

    public override void Configure()
    {
        Get("selected-answers/{TestLogId}");
    }

    public override async Task HandleAsync(GetSelectedAnswersRequest req, CancellationToken ct)
    {
        var userId = User.GetId();

        var testLogDb = await _context.Tests
            .Include(test => test.TestLogs)
            .ThenInclude(tl => tl.SelectedAnswers)
            .Where(test => test.OwnerId == userId)
            .SelectMany(test => test.TestLogs)
            .FirstOrDefaultAsync(tl => tl.Id == req.TestLogId, ct);

        if (testLogDb == null)
        {
            await SendOkAsync(Result<GetSelectedAnswerResponse>.Error("Takie rozwiązanie testu nie miało miejsca"), ct);
            return;
        }

        var usedQuestionsIds = testLogDb.SelectedAnswers
            .Select(sa => sa.QuestionId)
            .ToList();

        var totalDurationSeconds = Convert.ToInt32(Math.Floor(testLogDb.Duration.TotalSeconds));

        var earnedPoints = testLogDb.SelectedAnswers
            .Where(tl => tl.Scored)
            .Count();

        var maxPoints = testLogDb.SelectedAnswers.Count;

        GetSelectedAnswerResponse response = new
        (
            testLogDb.TestId,
            testLogDb.SolvedDate,
            totalDurationSeconds,
            testLogDb.Username,
            earnedPoints,
            maxPoints,
            BuildUsedQuestionsList(await GetUsedQuestionsDb(usedQuestionsIds, ct), testLogDb.SelectedAnswers)
        );

        await SendOkAsync(Result<GetSelectedAnswerResponse>.Success(response), ct);
    }

    private List<UsedQuestion?> BuildUsedQuestionsList(List<Domain.Entities.Question?> usedQuestionsDb, ICollection<SelectedAnswer> selectedAnswersDb)
    {
        return usedQuestionsDb
            .Select(question => BuildUsedQuestion(question, selectedAnswersDb))
            .ToList();
    }

    private UsedQuestion? BuildUsedQuestion(Domain.Entities.Question? usedQuestionDb, ICollection<SelectedAnswer> selectedAnswersDb)
    {
        if (usedQuestionDb == null)
        {
            return null;
        }

        var selectedAnswerDb = selectedAnswersDb.First(sa => sa.QuestionId == usedQuestionDb.Id);

        var selectedAnswerDtos = usedQuestionDb.Answers
            .Select(answer => BuildSelectedAnswerDto(answer, selectedAnswerDb.SelectedAnswerIds))
            .ToList();

        return new
        (
            usedQuestionDb.Content,
            usedQuestionDb.QuestionType,
            usedQuestionDb.ImageId,
            selectedAnswerDb.Scored,
            selectedAnswerDtos
        );
    }

    private SelectedAnswerDto BuildSelectedAnswerDto(Answer answerDb, List<Guid> currentQuestionSelectedAnswerIds)
    {
        var isSelected = currentQuestionSelectedAnswerIds.Contains(answerDb.Id);

        return new(answerDb.Content, answerDb.ImageId, isSelected, answerDb.IsCorrect);
    }

    private async Task<List<Domain.Entities.Question?>> GetUsedQuestionsDb(List<Guid> usedQuestionIds, CancellationToken ct)
    {
        var usedQuestionsDb = await _context.Questions
            .Include(question => question.Answers)
            .Where(question => usedQuestionIds.Contains(question.Id))
            .ToListAsync(ct);

        List<Domain.Entities.Question?> resultQuestions = [.. usedQuestionsDb];

        if (usedQuestionIds.Count > usedQuestionsDb.Count)
        {
            var difference = usedQuestionIds.Count - usedQuestionsDb.Count;

            var nullsToAdd = Enumerable.Repeat<Domain.Entities.Question?>(null, difference);

            resultQuestions.AddRange(nullsToAdd);
        }

        return resultQuestions;
    }
}
