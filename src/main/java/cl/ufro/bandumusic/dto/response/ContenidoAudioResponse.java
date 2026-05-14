package cl.ufro.bandumusic.dto.response;

import cl.ufro.bandumusic.model.Cancion;
import cl.ufro.bandumusic.model.ContenidoAudio;
import cl.ufro.bandumusic.model.Podcast;

public record ContenidoAudioResponse(
        String id,
        String titulo,
        int duracionSegundos,
        String tipo,
        String artista,
        String album,
        String anfitrion,
        Integer numeroDeEpisodios
) {
    public static ContenidoAudioResponse from(ContenidoAudio audio) {
        if (audio instanceof Cancion cancion) {
            return new ContenidoAudioResponse(
                    cancion.getId(),
                    cancion.getTitulo(),
                    cancion.getDuracionSegundos(),
                    "CANCION",
                    cancion.getArtista(),
                    cancion.getAlbum(),
                    null,
                    null
            );
        }

        if (audio instanceof Podcast podcast) {
            return new ContenidoAudioResponse(
                    podcast.getId(),
                    podcast.getTitulo(),
                    podcast.getDuracionSegundos(),
                    "PODCAST",
                    null,
                    null,
                    podcast.getAnfitrion(),
                    podcast.getNumeroDeEpisodios()
            );
        }

        return new ContenidoAudioResponse(
                audio.getId(),
                audio.getTitulo(),
                audio.getDuracionSegundos(),
                "CONTENIDO_AUDIO",
                null,
                null,
                null,
                null
        );
    }
}
