package cl.ufro.bandumusic.model;
import jakarta.persistence.*;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)

public abstract class ContenidoAudio implements Reproducible {

    @Id
    protected String id;
    protected  String titulo;
    protected int duracionSegundos;

    public ContenidoAudio() {
    }

    public ContenidoAudio(String id, String titulo, int duracionSegundos) {
        this.id = id;
        this.titulo = titulo;
        this.duracionSegundos = duracionSegundos;
    }

    public abstract String getDetalles();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public int getDuracionSegundos() {
        return duracionSegundos;
    }

    public void setDuracionSegundos(int duracionSegundos) {
        this.duracionSegundos = duracionSegundos;
    }
}
