using QuizHub.Application.Common.Interfaces;

namespace QuizHub.Application.Modules.Image.Endpoints.Get;

public class GetImageEndpoint(IImageService imageService) : Endpoint<GetImageRequest>
{
    private readonly IImageService _imageService = imageService;

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

        await SendBytesAsync(image.Data, image.ContentType, cancellation: ct);
    }
}
