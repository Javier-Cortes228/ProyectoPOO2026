package cl.ufro.bandumusic.model;

import cl.ufro.bandumusic.exception.PlaylistLlenaException;
import cl.ufro.bandumusic.dto.request.JamendoPlaylistItemRequest;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.OneToMany;

import java.util.ArrayList;
import java.util.List;

@Entity
public class PlayList {

    private static final int LIMITE_CONTENIDOS = 300;

    @Id
    private String id;
    private String nombre;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinTable(
            name = "playlist_items",
            joinColumns = @JoinColumn(name = "playlist_id"),
            inverseJoinColumns = @JoinColumn(name = "item_id")
    )
    private List<PlaylistItem> contenidos;

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

        validarCapacidad();

        boolean yaExiste = this.contenidos.stream()
                .anyMatch(item -> item.representaContenidoLocal(contenido.getId()));
        if (yaExiste) {
            return;
        }

        this.contenidos.add(PlaylistItem.local(contenido));
    }

    public void agregarContenidoJamendo(JamendoPlaylistItemRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("El contenido de Jamendo no puede ser nulo.");
        }

        validarCapacidad();

        boolean yaExiste = this.contenidos.stream()
                .anyMatch(item -> item.representaJamendo(request.id()));
        if (yaExiste) {
            return;
        }

        this.contenidos.add(PlaylistItem.jamendo(
                request.id(),
                request.titulo(),
                request.duracionSegundos(),
                request.artista(),
                request.album(),
                request.genero(),
                request.imagenUrl(),
                request.audioUrl(),
                request.licenciaUrl(),
                request.jamendoUrl()
        ));
    }

    public void removerContenido(String idContenido) {
        this.contenidos.removeIf(item ->
                item.getId().equals(idContenido)
                        || idContenido.equals(item.getClaveContenido())
        );
    }

    public int calcularDuracionTotal() {
        int total = 0;
        for (PlaylistItem item : contenidos) {
            total += item.getDuracionSegundos();
        }
        return total;
    }

    private void validarCapacidad() {
        if (this.contenidos.size() >= LIMITE_CONTENIDOS) {
            throw new PlaylistLlenaException("La playlist ha alcanzado su limite de 300 pistas.");
        }
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

    public List<PlaylistItem> getContenidos() {
        return contenidos;
    }

    public void setContenidos(List<PlaylistItem> contenidos) {
        this.contenidos = contenidos != null ? contenidos : new ArrayList<>();
    }
}
