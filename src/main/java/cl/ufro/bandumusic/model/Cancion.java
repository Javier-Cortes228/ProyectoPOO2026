package cl.ufro.bandumusic.model;

import jakarta.persistence.Entity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Entity
public class Cancion extends ContenidoAudio {

    private static final Logger LOGGER = LoggerFactory.getLogger(Cancion.class);

    private String artista;
    private String album;

    public Cancion() {
    }

    public Cancion(String id, String titulo, int duracionSegundos, String artista, String album) {
        super(id, titulo, duracionSegundos);
        this.artista = artista;
        this.album = album;
    }

    @Override
    public String getDetalles() {
        return "Cancion: " + titulo + " | Artista: " + artista + " | Album: " + album;
    }

    @Override
    public void reproducir() {
        LOGGER.info("Reproduciendo cancion: {} de {}", titulo, artista);
    }

    @Override
    public void pausar() {
        LOGGER.info("Pausando cancion: {}", titulo);
    }

    public String getArtista() {
        return artista;
    }

    public void setArtista(String artista) {
        this.artista = artista;
    }

    public String getAlbum() {
        return album;
    }

    public void setAlbum(String album) {
        this.album = album;
    }
}
