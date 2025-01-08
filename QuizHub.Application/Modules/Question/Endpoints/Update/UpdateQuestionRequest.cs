using Microsoft.AspNetCore.Http;
using QuizHub.Application.Modules.Question.Endpoints.Update.Models;

namespace QuizHub.Application.Modules.Question.Endpoints.Update;

public record UpdateQuestionRequest
    (Guid QuestionBaseId,
    IdentifiedQuestionUpdateDTO Question,
    IFormFile? ContentImage,
    IFormFile? AnswerImage1,
    IFormFile? AnswerImage2,
    IFormFile? AnswerImage3,
    IFormFile? AnswerImage4);
