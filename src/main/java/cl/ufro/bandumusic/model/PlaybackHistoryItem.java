package cl.ufro.bandumusic.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

import java.time.Instant;
import java.util.UUID;

@Entity
public class PlaybackHistoryItem {

    @Id
    private String id;

    @ManyToOne(optional = false)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PlaylistItemTipo origen;

    @Column(nullable = false, length = 120)
    private String contenidoId;

    @Column(nullable = false, length = 160)
    private String titulo;

    private int duracionSegundos;

    @Column(length = 40)
    private String tipo;

    @Column(length = 160)
    private String artista;

    @Column(length = 160)
    private String album;

    @Column(length = 160)
    private String anfitrion;

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

    @Column(nullable = false)
    private Instant reproducidoEn;

    protected PlaybackHistoryItem() {
    }

    public static PlaybackHistoryItem crear(
            Usuario usuario,
            PlaylistItemTipo origen,
            String contenidoId,
            String titulo,
            int duracionSegundos,
            String tipo,
            String artista,
            String album,
            String anfitrion,
            String genero,
            String imagenUrl,
            String audioUrl,
            String licenciaUrl,
            String jamendoUrl
    ) {
        PlaybackHistoryItem item = new PlaybackHistoryItem();
        item.id = UUID.randomUUID().toString();
        item.usuario = usuario;
        item.origen = origen;
        item.contenidoId = limpiarObligatorio(contenidoId, "El id del contenido reproducido es obligatorio.");
        item.titulo = limpiarObligatorio(titulo, "El titulo reproducido es obligatorio.");
        item.duracionSegundos = Math.max(duracionSegundos, 0);
        item.tipo = limpiar(tipo);
        item.artista = limpiar(artista);
        item.album = limpiar(album);
        item.anfitrion = limpiar(anfitrion);
        item.genero = limpiar(genero);
        item.imagenUrl = limpiar(imagenUrl);
        item.audioUrl = limpiar(audioUrl);
        item.licenciaUrl = limpiar(licenciaUrl);
        item.jamendoUrl = limpiar(jamendoUrl);
        item.reproducidoEn = Instant.now();
        return item;
    }

    private static String limpiarObligatorio(String valor, String mensaje) {
        String limpio = limpiar(valor);
        if (limpio == null) {
            throw new IllegalArgumentException(mensaje);
        }
        return limpio;
    }

    private static String limpiar(String valor) {
        return valor == null || valor.trim().isEmpty() ? null : valor.trim();
    }

    public String getId() {
        return id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public PlaylistItemTipo getOrigen() {
        return origen;
    }

    public String getContenidoId() {
        return contenidoId;
    }

    public String getTitulo() {
        return titulo;
    }

    public int getDuracionSegundos() {
        return duracionSegundos;
    }

    public String getTipo() {
        return tipo;
    }

    public String getArtista() {
        return artista;
    }

    public String getAlbum() {
        return album;
    }

    public String getAnfitrion() {
        return anfitrion;
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

    public Instant getReproducidoEn() {
        return reproducidoEn;
    }
}
