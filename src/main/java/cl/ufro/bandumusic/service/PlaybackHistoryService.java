package cl.ufro.bandumusic.service;

import cl.ufro.bandumusic.dto.request.PlaybackRequest;
import cl.ufro.bandumusic.dto.response.ContenidoAudioResponse;
import cl.ufro.bandumusic.dto.response.GeneroInference;
import cl.ufro.bandumusic.model.Cancion;
import cl.ufro.bandumusic.model.ContenidoAudio;
import cl.ufro.bandumusic.model.PlaybackHistoryItem;
import cl.ufro.bandumusic.model.PlaylistItemTipo;
import cl.ufro.bandumusic.model.Podcast;
import cl.ufro.bandumusic.model.Usuario;
import cl.ufro.bandumusic.repository.ContenidoAudioRepository;
import cl.ufro.bandumusic.repository.PlaybackHistoryRepository;
import cl.ufro.bandumusic.repository.UsuarioRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
public class PlaybackHistoryService {

    private static final int DEFAULT_LIMIT = 20;
    private static final int MAX_LIMIT = 50;

    private final PlaybackHistoryRepository playbackHistoryRepository;
    private final UsuarioRepository usuarioRepository;
    private final ContenidoAudioRepository contenidoAudioRepository;

    public PlaybackHistoryService(
            PlaybackHistoryRepository playbackHistoryRepository,
            UsuarioRepository usuarioRepository,
            ContenidoAudioRepository contenidoAudioRepository
    ) {
        this.playbackHistoryRepository = playbackHistoryRepository;
        this.usuarioRepository = usuarioRepository;
        this.contenidoAudioRepository = contenidoAudioRepository;
    }

    @Transactional
    public PlaybackHistoryItem registrar(String correo, PlaybackRequest request) {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new IllegalArgumentException("Usuario autenticado no encontrado."));

        String fuente = request.fuente().trim().toUpperCase(Locale.ROOT);
        if ("LOCAL".equals(fuente)) {
            return registrarLocal(usuario, request);
        }
        if ("JAMENDO".equals(fuente)) {
            return registrarJamendo(usuario, request);
        }
        throw new IllegalArgumentException("Fuente de reproduccion no soportada.");
    }

    @Transactional(readOnly = true)
    public List<PlaybackHistoryItem> obtenerRecientes(String correo, int limit) {
        int limiteSeguro = Math.max(1, Math.min(limit <= 0 ? DEFAULT_LIMIT : limit, MAX_LIMIT));
        return playbackHistoryRepository.findByUsuarioCorreoOrderByReproducidoEnDesc(
                correo,
                PageRequest.of(0, limiteSeguro)
        );
    }

    private PlaybackHistoryItem registrarLocal(Usuario usuario, PlaybackRequest request) {
        ContenidoAudio audio = contenidoAudioRepository.findById(request.id())
                .orElseThrow(() -> new IllegalArgumentException("El contenido local reproducido no existe."));

        ContenidoAudioResponse response = ContenidoAudioResponse.from(audio);
        PlaybackHistoryItem item = PlaybackHistoryItem.crear(
                usuario,
                PlaylistItemTipo.LOCAL,
                audio.getId(),
                audio.getTitulo(),
                audio.getDuracionSegundos(),
                response.tipo(),
                response.artista(),
                response.album(),
                response.anfitrion(),
                response.genero(),
                null,
                null,
                null,
                null
        );
        return playbackHistoryRepository.save(item);
    }

    private PlaybackHistoryItem registrarJamendo(Usuario usuario, PlaybackRequest request) {
        PlaybackHistoryItem item = PlaybackHistoryItem.crear(
                usuario,
                PlaylistItemTipo.JAMENDO,
                request.id(),
                request.titulo(),
                request.duracionSegundos(),
                "JAMENDO",
                request.artista(),
                request.album(),
                request.anfitrion(),
                request.genero(),
                request.imagenUrl(),
                request.audioUrl(),
                request.licenciaUrl(),
                request.jamendoUrl()
        );
        return playbackHistoryRepository.save(item);
    }

    public static String creadorDe(PlaybackHistoryItem item) {
        return firstNonBlank(item.getArtista(), item.getAnfitrion());
    }

    public static String creadorDe(ContenidoAudio audio) {
        if (audio instanceof Cancion cancion) {
            return cancion.getArtista();
        }
        if (audio instanceof Podcast podcast) {
            return podcast.getAnfitrion();
        }
        return null;
    }

    public static String generoDe(ContenidoAudio audio) {
        return GeneroInference.inferir(audio);
    }

    private static String firstNonBlank(String primero, String segundo) {
        if (primero != null && !primero.isBlank()) {
            return primero;
        }
        if (segundo != null && !segundo.isBlank()) {
            return segundo;
        }
        return null;
    }
}
