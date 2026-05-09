package cl.ufro.bandumusic.model;

import jakarta.persistence.CascadeType;
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
    private String nombreUsuario;
    private String correo;
    private String contrasena;

    @OneToMany(cascade = CascadeType.ALL)
    private List<PlayList> playlist;

    public Usuario() {
        this.playlist = new ArrayList<>();
    }

    public Usuario(String id, String nombreUsuario, String correo, String contrasena) {
        this.id = id;
        this.nombreUsuario = nombreUsuario;
        this.correo = correo;
        this.contrasena = contrasena;
        this.playlist = new ArrayList<>();
        this.playlist.add(new PlayList(UUID.randomUUID().toString(), "Favoritos"));
        //Al crear un usuario, le creamos automáticamente su lista de favoritos
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
        // Asumimos que la lista en la posición 0 siempre es "Favoritos"
        if (!this.playlist.isEmpty()) {
            this.playlist.get(0).agregarContenido(audio);
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

    public List<PlayList> getPlaylist() {
        return playlist;
    }

    public void setPlaylist(List<PlayList> playlist) {
        this.playlist = playlist;
    }

}