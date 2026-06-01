package cl.ufro.bandumusic.dto.response;

public record JamendoTrackResponse(
        String id,
        String titulo,
        int duracionSegundos,
        String artista,
        String album,
        String genero,
        String imagenUrl,
        String audioUrl,
        String licenciaUrl,
        String jamendoUrl,
        String fuente
) {
}
