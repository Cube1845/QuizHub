using Microsoft.AspNetCore.Http;
using QuizHub.Domain.Models;

namespace QuizHub.Application.Modules.Question.Endpoints.Add;

public record AddQuestionRequest
    (Guid QuestionBaseId,
    UnidentifiedQuestionWithNoImage Question,
    IFormFile? ContentImage,
    IFormFile? AnswerImage1,
    IFormFile? AnswerImage2,
    IFormFile? AnswerImage3,
    IFormFile? AnswerImage4);
