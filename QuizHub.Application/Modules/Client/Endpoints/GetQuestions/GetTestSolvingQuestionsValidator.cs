using QuizHub.Application.Common.Extensions;

namespace QuizHub.Application.Modules.Client.Endpoints.GetQuestions;

public class GetTestSolvingQuestionsValidator : Validator<GetTestSolvingQuestionsRequest>
{
    public GetTestSolvingQuestionsValidator()
    {
        RuleFor(x => x.TestSolvingId)
            .NotEmpty()
            .MustBeCorrectGuid();
    }
}
