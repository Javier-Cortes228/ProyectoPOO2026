package cl.ufro.bandumusic.dto.response;

public record YoutubeVideoResponse(
        String videoId,
        String titulo,
        String canal,
        String descripcion,
        String thumbnailUrl,
        String url
) {
}
