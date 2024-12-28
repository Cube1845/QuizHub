using QuizHub.Application.Modules.QuestionBase.Models;

namespace QuizHub.Application.Modules.QuestionBase.Get;

public record GetQuestionBasesResponse(List<QuestionBaseData> QuestionBases)
{
    public static implicit operator GetQuestionBasesResponse(List<QuestionBaseData> QuestionBases)
    {
        return new(QuestionBases);
    }
}