package cl.ufro.bandumusic.model;
import jakarta.persistence.Entity;

@Entity
public class Podcast extends ContenidoAudio {

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
        return "Podcast: " + titulo + " | Anfitrión: " + anfitrion + " | Episodios: " + numeroDeEpisodios;
    }

    @Override
    public void reproducir() {
        System.out.println("Reproduciendo podcast: " + titulo + " presentado por " + anfitrion);
    }

    @Override
    public void pausar() {
        System.out.println("Pausando podcast: " + titulo);
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
