package cl.ufro.bandumusic.model;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.*;

@Entity
public class PlayList {

    @Id
    private String id;
    private String nombre;

    @ManyToMany
    private List<ContenidoAudio> contenidos;

    public PlayList() {
        this.contenidos = new ArrayList<>();
    }

    public PlayList(String id, String nombre) {
        this.id = id;
        this.nombre = nombre;
        this.contenidos = new ArrayList<>();
    }


    public void agregarContenido(ContenidoAudio contenido) {
        this.contenidos.add(contenido);
    }

    public void removerContenido(String idContenido) {
        this.contenidos.removeIf(audio -> audio.getId().equals(idContenido));
    }

    public int calcularDuracionTotal() {
        int total = 0;
        for (ContenidoAudio audio : contenidos) {
            total += audio.getDuracionSegundos();
        }
        return total;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public List<ContenidoAudio> getContenidos() {
        return contenidos;
    }

    public void setContenidos(List<ContenidoAudio> contenidos) {
        this.contenidos = contenidos;
    }
}