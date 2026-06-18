package cl.ufro.bandumusic.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

import java.util.UUID;

@Entity
public class PlaylistItem {

    @Id
    private String id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PlaylistItemTipo origen;

    @ManyToOne
    private ContenidoAudio contenidoLocal;

    @Column(length = 120)
    private String externalId;

    @Column(nullable = false, length = 160)
    private String titulo;

    private int duracionSegundos;

    @Column(length = 160)
    private String artista;

    @Column(length = 160)
    private String album;

    @Column(length = 100)
    private String genero;

    @Column(length = 500)
    private String imagenUrl;

    @Column(length = 500)
    private String audioUrl;

    @Column(length = 500)
    private String licenciaUrl;

    @Column(length = 500)
    private String jamendoUrl;

    protected PlaylistItem() {
    }

    public static PlaylistItem local(ContenidoAudio contenido) {
        if (contenido == null) {
            throw new IllegalArgumentException("El contenido local no puede ser nulo.");
        }

        PlaylistItem item = new PlaylistItem();
        item.id = UUID.randomUUID().toString();
        item.origen = PlaylistItemTipo.LOCAL;
        item.contenidoLocal = contenido;
        item.externalId = contenido.getId();
        item.titulo = contenido.getTitulo();
        item.duracionSegundos = contenido.getDuracionSegundos();
        return item;
    }

    public static PlaylistItem jamendo(
            String externalId,
            String titulo,
            int duracionSegundos,
            String artista,
            String album,
            String genero,
            String imagenUrl,
            String audioUrl,
            String licenciaUrl,
            String jamendoUrl
    ) {
        validarTexto(externalId, "El id externo de Jamendo es obligatorio.");
        validarTexto(titulo, "El titulo de Jamendo es obligatorio.");
        validarTexto(audioUrl, "La URL de audio de Jamendo es obligatoria.");

        PlaylistItem item = new PlaylistItem();
        item.id = UUID.randomUUID().toString();
        item.origen = PlaylistItemTipo.JAMENDO;
        item.externalId = externalId.trim();
        item.titulo = titulo.trim();
        item.duracionSegundos = Math.max(duracionSegundos, 0);
        item.artista = limpiar(artista);
        item.album = limpiar(album);
        item.genero = limpiar(genero);
        item.imagenUrl = limpiar(imagenUrl);
        item.audioUrl = audioUrl.trim();
        item.licenciaUrl = limpiar(licenciaUrl);
        item.jamendoUrl = limpiar(jamendoUrl);
        return item;
    }

    public boolean representaContenidoLocal(String contenidoId) {
        return origen == PlaylistItemTipo.LOCAL && contenidoLocal != null && contenidoLocal.getId().equals(contenidoId);
    }

    public boolean representaJamendo(String jamendoId) {
        return origen == PlaylistItemTipo.JAMENDO && externalId != null && externalId.equals(jamendoId);
    }

    public String getClaveContenido() {
        if (origen == PlaylistItemTipo.LOCAL && contenidoLocal != null) {
            return contenidoLocal.getId();
        }
        return externalId;
    }

    private static void validarTexto(String valor, String mensaje) {
        if (valor == null || valor.trim().isEmpty()) {
            throw new IllegalArgumentException(mensaje);
        }
    }

    private static String limpiar(String valor) {
        return valor == null || valor.trim().isEmpty() ? null : valor.trim();
    }

    public String getId() {
        return id;
    }

    public PlaylistItemTipo getOrigen() {
        return origen;
    }

    public ContenidoAudio getContenidoLocal() {
        return contenidoLocal;
    }

    public String getExternalId() {
        return externalId;
    }

    public String getTitulo() {
        return titulo;
    }

    public int getDuracionSegundos() {
        return duracionSegundos;
    }

    public String getArtista() {
        return artista;
    }

    public String getAlbum() {
        return album;
    }

    public String getGenero() {
        return genero;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }

    public String getAudioUrl() {
        return audioUrl;
    }

    public String getLicenciaUrl() {
        return licenciaUrl;
    }

    public String getJamendoUrl() {
        return jamendoUrl;
    }
}
