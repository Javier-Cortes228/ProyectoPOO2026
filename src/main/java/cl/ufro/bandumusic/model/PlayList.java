package cl.ufro.bandumusic.model;

import cl.ufro.bandumusic.exception.PlaylistLlenaException;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;

import java.util.ArrayList;
import java.util.List;

@Entity
public class PlayList {

    private static final int LIMITE_CONTENIDOS = 300;

    @Id
    private String id;
    private String nombre;

    @ManyToMany
    private List<ContenidoAudio> contenidos;

    public PlayList() {
        this.contenidos = new ArrayList<>();
    }

    public PlayList(String id, String nombre) {
        validarNombre(nombre);
        this.id = id;
        this.nombre = nombre.trim();
        this.contenidos = new ArrayList<>();
    }

    public void agregarContenido(ContenidoAudio contenido) {
        if (contenido == null) {
            throw new IllegalArgumentException("El contenido no puede ser nulo.");
        }

        if (this.contenidos.size() >= LIMITE_CONTENIDOS) {
            throw new PlaylistLlenaException("La playlist ha alcanzado su limite de 300 pistas.");
        }

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

    private void validarNombre(String nombre) {
        if (nombre == null || nombre.trim().isEmpty()) {
            throw new IllegalArgumentException("La playlist debe tener un titulo.");
        }
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
        validarNombre(nombre);
        this.nombre = nombre.trim();
    }

    public List<ContenidoAudio> getContenidos() {
        return contenidos;
    }

    public void setContenidos(List<ContenidoAudio> contenidos) {
        this.contenidos = contenidos != null ? contenidos : new ArrayList<>();
    }
}
