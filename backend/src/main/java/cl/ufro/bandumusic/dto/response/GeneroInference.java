package cl.ufro.bandumusic.dto.response;

import cl.ufro.bandumusic.model.Cancion;
import cl.ufro.bandumusic.model.ContenidoAudio;
import cl.ufro.bandumusic.model.Podcast;

import java.util.Locale;

public final class GeneroInference {

    private GeneroInference() {
    }

    public static String inferir(ContenidoAudio audio) {
        if (audio == null) {
            return null;
        }

        String texto = audio.getTitulo();
        if (audio instanceof Cancion cancion) {
            texto = texto + " " + cancion.getAlbum() + " " + cancion.getArtista();
        } else if (audio instanceof Podcast podcast) {
            texto = texto + " " + podcast.getAnfitrion();
        }

        String normalizado = texto.toLowerCase(Locale.ROOT);
        if (normalizado.contains("rock")) {
            return "rock";
        }
        if (normalizado.contains("phonk") || normalizado.contains("drift") || normalizado.contains("trap")) {
            return "phonk";
        }
        if (normalizado.contains("ambient") || normalizado.contains("calm") || normalizado.contains("quiet")
                || normalizado.contains("sedative") || normalizado.contains("space")) {
            return "ambient";
        }
        if (normalizado.contains("house") || normalizado.contains("dance") || normalizado.contains("party")) {
            return "electronic";
        }
        if (normalizado.contains("latin") || normalizado.contains("latina") || normalizado.contains("reggae")
                || normalizado.contains("afro")) {
            return "latin";
        }
        if (normalizado.contains("funk") || normalizado.contains("groove")) {
            return "funk";
        }
        if (normalizado.contains("summer") || normalizado.contains("beach") || normalizado.contains("tropical")) {
            return "summer";
        }
        if (normalizado.contains("acoustic") || normalizado.contains("folk")) {
            return "acoustic";
        }
        return null;
    }
}
