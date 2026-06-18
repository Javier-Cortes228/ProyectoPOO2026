package cl.ufro.bandumusic.dto.response;

import cl.ufro.bandumusic.model.Cancion;
import cl.ufro.bandumusic.model.ContenidoAudio;
import cl.ufro.bandumusic.model.PlaylistItem;
import cl.ufro.bandumusic.model.PlaylistItemTipo;
import cl.ufro.bandumusic.model.Podcast;

public record ContenidoAudioResponse(
        String id,
        String titulo,
        int duracionSegundos,
        String tipo,
        String artista,
        String album,
        String anfitrion,
        Integer numeroDeEpisodios,
        String genero,
        String imagenUrl,
        String audioUrl,
        String licenciaUrl,
        String jamendoUrl,
        String fuente
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
                    null,
                    GeneroInference.inferir(audio),
                    null,
                    null,
                    null,
                    null,
                    "LOCAL"
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
                    podcast.getNumeroDeEpisodios(),
                    GeneroInference.inferir(audio),
                    null,
                    null,
                    null,
                    null,
                    "LOCAL"
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
                null,
                GeneroInference.inferir(audio),
                null,
                null,
                null,
                null,
                "LOCAL"
        );
    }

    public static ContenidoAudioResponse from(PlaylistItem item) {
        if (item.getOrigen() == PlaylistItemTipo.LOCAL && item.getContenidoLocal() != null) {
            return from(item.getContenidoLocal());
        }

        return new ContenidoAudioResponse(
                item.getExternalId(),
                item.getTitulo(),
                item.getDuracionSegundos(),
                "JAMENDO",
                item.getArtista(),
                item.getAlbum(),
                null,
                null,
                item.getGenero(),
                item.getImagenUrl(),
                item.getAudioUrl(),
                item.getLicenciaUrl(),
                item.getJamendoUrl(),
                "JAMENDO"
        );
    }

    public static ContenidoAudioResponse from(JamendoTrackResponse track) {
        return new ContenidoAudioResponse(
                track.id(),
                track.titulo(),
                track.duracionSegundos(),
                "JAMENDO",
                track.artista(),
                track.album(),
                null,
                null,
                track.genero(),
                track.imagenUrl(),
                track.audioUrl(),
                track.licenciaUrl(),
                track.jamendoUrl(),
                "JAMENDO"
        );
    }
}
