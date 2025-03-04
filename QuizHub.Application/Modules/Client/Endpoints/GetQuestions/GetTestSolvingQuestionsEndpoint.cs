using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Common.Models;
using QuizHub.Application.Modules.Client.Models;

namespace QuizHub.Application.Modules.Client.Endpoints.GetQuestions;

public class GetTestSolvingQuestionsEndpoint(IAppDbContext context, TimeProvider timeProvider) : Endpoint<GetTestSolvingQuestionsRequest, Result<GetTestSolvingQuestionsResponse>>
{
    private readonly IAppDbContext _context = context;
    private readonly TimeProvider _timeProvider = timeProvider;

    public override void Configure()
    {
        Get("client/test/{TestSolvingId}");
        AllowAnonymous();
    }

    public override async Task HandleAsync(GetTestSolvingQuestionsRequest req, CancellationToken ct)
    {
        var testSolvingDb = await _context.TestSolvings
            .FindAsync([req.TestSolvingId], ct);

        if (testSolvingDb == null)
        {
            await SendOkAsync(Result<GetTestSolvingQuestionsResponse>.Error("Wystąpił nieoczekiwany błąd"), ct);
            return;
        }

        if (testSolvingDb.QuestionsDownloaded)
        {
            await SendOkAsync(Result<GetTestSolvingQuestionsResponse>.Error("Ktoś już próbuje rozwiązać ten test"), ct);
            return;
        }

        var questionIds = testSolvingDb.DrawnQuestionsIds;

        var questionsDb = await _context.Questions
            .Include(question => question.Answers)
            .Where(question => questionIds.Contains(question.Id))
            .ToListAsync(ct);

        var questionDtos = questionsDb.Select(questionDb => new QuestionOutDto(questionDb)).ToList();

        testSolvingDb.QuestionsDownloaded = true;
        testSolvingDb.StartedAt = _timeProvider.GetLocalNow().DateTime;
        await _context.SaveChangesAsync(ct);

        await SendOkAsync(Result<GetTestSolvingQuestionsResponse>.Success(new(questionDtos)), ct);
    }
}
