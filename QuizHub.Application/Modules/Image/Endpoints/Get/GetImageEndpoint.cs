using QuizHub.Application.Common.Interfaces;

namespace QuizHub.Application.Modules.Image.Endpoints.Get;

public class GetImageEndpoint(IImageService imageService, TimeProvider timeProvider) : Endpoint<GetImageRequest>
{
    private readonly IImageService _imageService = imageService;
    private readonly TimeProvider _timeProvider = timeProvider;

    public override void Configure()
    {
        Get("image/{ImageId}");
    }

    public override async Task HandleAsync(GetImageRequest req, CancellationToken ct)
    {
        var image = await _imageService.GetImageByIdAsync(req.ImageId, ct);

        if (image == null)
        {
            await SendNotFoundAsync(ct);
            return;
        }

        var tempFilePath = Path.Combine(Path.GetTempPath(), image.Name);
        await File.WriteAllBytesAsync(tempFilePath, image.Data, ct);

        var fileInfo = new FileInfo(tempFilePath);

        await SendFileAsync(fileInfo, image.ContentType, lastModified: _timeProvider.GetUtcNow(), cancellation: ct);

        File.Delete(tempFilePath);
    }
}
