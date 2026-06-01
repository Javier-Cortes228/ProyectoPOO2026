package cl.ufro.bandumusic.model;

import jakarta.persistence.Entity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Entity
public class Podcast extends ContenidoAudio {

    private static final Logger LOGGER = LoggerFactory.getLogger(Podcast.class);

    private String anfitrion;
    private int numeroDeEpisodios;

    public Podcast() {
    }

    public Podcast(String id, String titulo, int duracionSegundos, String anfitrion, int numeroDeEpisodios) {
        super(id, titulo, duracionSegundos);
        this.anfitrion = anfitrion;
        this.numeroDeEpisodios = numeroDeEpisodios;
    }

    @Override
    public String getDetalles() {
        return "Podcast: " + titulo + " | Anfitrion: " + anfitrion + " | Episodios: " + numeroDeEpisodios;
    }

    @Override
    public void reproducir() {
        LOGGER.info("Reproduciendo podcast: {} presentado por {}", titulo, anfitrion);
    }

    @Override
    public void pausar() {
        LOGGER.info("Pausando podcast: {}", titulo);
    }

    public String getAnfitrion() {
        return anfitrion;
    }

    public void setAnfitrion(String anfitrion) {
        this.anfitrion = anfitrion;
    }

    public int getNumeroDeEpisodios() {
        return numeroDeEpisodios;
    }

    public void setNumeroDeEpisodios(int numeroDeEpisodios) {
        this.numeroDeEpisodios = numeroDeEpisodios;
    }
}
