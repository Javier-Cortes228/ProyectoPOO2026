package cl.ufro.bandumusic.dto.response;

import cl.ufro.bandumusic.model.PlayList;

import java.util.List;

public record PlayListResponse(
        String id,
        String nombre,
        List<ContenidoAudioResponse> contenidos,
        int duracionTotalSegundos
) {
    public static PlayListResponse from(PlayList playlist) {
        List<ContenidoAudioResponse> contenidos = playlist.getContenidos().stream()
                .map(ContenidoAudioResponse::from)
                .toList();

        return new PlayListResponse(
                playlist.getId(),
                playlist.getNombre(),
                contenidos,
                playlist.calcularDuracionTotal()
        );
    }
}
