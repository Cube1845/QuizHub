using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using QuizHub.Application.Common.Interfaces;
using QuizHub.Application.Modules.Question.Extensions;
using QuizHub.Domain.Entities;

namespace QuizHub.Infrastructure.Data;

public class ImageService(AppDbContext context) : IImageService
{
    private readonly AppDbContext _context = context;

    public async Task<Image?> GetImageByIdAsync(Guid imageId, CancellationToken ct = default)
    {
        return await _context.Images.FirstOrDefaultAsync(image => image.Id == imageId, ct);
    }

    public async Task<Guid> AddImageAndGetIdWithoutSavingAsync(IFormFile image, CancellationToken ct = default)
    {
        var imageDb = await image.ToImageDbAsync(ct);
        _context.Images.Add(imageDb);

        return imageDb.Id;
    }
}
