package cl.ufro.bandumusic.model;
import jakarta.persistence.Entity;

@Entity
public class Cancion extends ContenidoAudio {

    private String artista;
    private String album;

    public Cancion(){
    }

    public Cancion(String id, String titulo, int duracionSegundos, String artista, String album) {
        super(id, titulo, duracionSegundos);
        this.artista = artista;
        this.album = album;
    }

    @Override
    public String getDetalles() {
        return "Canción: " + titulo + " | Artista: " + artista + " | Álbum: " + album;
    }

    @Override
    public void reproducir() {
        System.out.println("Reproduciendo canción: " + titulo + " de " + artista);
    }

    @Override
    public void pausar() {
        System.out.println("Pausando canción: " + titulo);
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
