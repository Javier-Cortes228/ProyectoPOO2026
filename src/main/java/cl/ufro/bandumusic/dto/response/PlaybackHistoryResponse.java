package cl.ufro.bandumusic.dto.response;

import cl.ufro.bandumusic.model.PlaybackHistoryItem;

import java.time.Instant;

public record PlaybackHistoryResponse(
        String id,
        String contenidoId,
        String titulo,
        int duracionSegundos,
        String tipo,
        String artista,
        String album,
        String anfitrion,
        String genero,
        String imagenUrl,
        String audioUrl,
        String licenciaUrl,
        String jamendoUrl,
        String fuente,
        Instant reproducidoEn
) {
    public static PlaybackHistoryResponse from(PlaybackHistoryItem item) {
        return new PlaybackHistoryResponse(
                item.getId(),
                item.getContenidoId(),
                item.getTitulo(),
                item.getDuracionSegundos(),
                item.getTipo(),
                item.getArtista(),
                item.getAlbum(),
                item.getAnfitrion(),
                item.getGenero(),
                item.getImagenUrl(),
                item.getAudioUrl(),
                item.getLicenciaUrl(),
                item.getJamendoUrl(),
                item.getOrigen().name(),
                item.getReproducidoEn()
        );
    }
}
