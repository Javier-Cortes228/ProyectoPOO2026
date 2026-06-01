package cl.ufro.bandumusic.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
public class Usuario {

    @Id
    private String id;

    @Column(nullable = false, length = 60)
    private String nombreUsuario;

    @Column(nullable = false, unique = true, length = 120)
    private String correo;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false, length = 120)
    private String contrasena;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean correoVerificado;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PlayList> playlist;

    public Usuario() {
        this.playlist = new ArrayList<>();
    }

    public Usuario(String id, String nombreUsuario, String correo, String contrasena) {
        validarTexto(nombreUsuario, "El nombre de usuario no puede estar vacio.");
        validarTexto(correo, "El correo no puede estar vacio.");
        validarTexto(contrasena, "La contrasena no puede estar vacia.");

        this.id = id;
        this.nombreUsuario = nombreUsuario.trim();
        this.correo = correo.trim();
        this.contrasena = contrasena;
        this.correoVerificado = false;
        this.playlist = new ArrayList<>();
        this.playlist.add(new PlayList(UUID.randomUUID().toString(), "Favoritos"));
    }

    public PlayList crearPlaylist(String nombre) {
        PlayList nueva = new PlayList(UUID.randomUUID().toString(), nombre);
        this.playlist.add(nueva);
        return nueva;
    }

    public void eliminarPlaylist(String idPlaylist) {
        this.playlist.removeIf(p -> p.getId().equals(idPlaylist));
    }

    public boolean verificarCredenciales(String correo, String contrasena) {
        return this.correo.equals(correo) && this.contrasena.equals(contrasena);
    }

    public void marcarComoFavorito(ContenidoAudio audio) {
        // La primera lista creada por el constructor corresponde a Favoritos.
        if (!this.playlist.isEmpty()) {
            this.playlist.get(0).agregarContenido(audio);
        }
    }

    public void marcarCorreoComoVerificado() {
        this.correoVerificado = true;
    }

    private void validarTexto(String valor, String mensaje) {
        if (valor == null || valor.trim().isEmpty()) {
            throw new IllegalArgumentException(mensaje);
        }
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }

    public boolean isCorreoVerificado() {
        return correoVerificado;
    }

    public void setCorreoVerificado(boolean correoVerificado) {
        this.correoVerificado = correoVerificado;
    }

    public List<PlayList> getPlaylist() {
        return playlist;
    }

    public void setPlaylist(List<PlayList> playlist) {
        this.playlist = playlist != null ? playlist : new ArrayList<>();
    }
}
