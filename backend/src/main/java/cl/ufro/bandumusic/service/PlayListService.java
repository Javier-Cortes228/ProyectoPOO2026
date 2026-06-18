package cl.ufro.bandumusic.service;

import cl.ufro.bandumusic.dto.request.JamendoPlaylistItemRequest;
import cl.ufro.bandumusic.exception.AccesoDenegadoException;
import cl.ufro.bandumusic.exception.RecursoNoEncontradoException;
import cl.ufro.bandumusic.model.ContenidoAudio;
import cl.ufro.bandumusic.model.PlayList;
import cl.ufro.bandumusic.model.Usuario;
import cl.ufro.bandumusic.repository.ContenidoAudioRepository;
import cl.ufro.bandumusic.repository.PlayListRepository;
import cl.ufro.bandumusic.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PlayListService {

    private final UsuarioRepository usuarioRepository;
    private final PlayListRepository playListRepository;
    private final ContenidoAudioRepository contenidoAudioRepository;

    public PlayListService(
            UsuarioRepository usuarioRepository,
            PlayListRepository playListRepository,
            ContenidoAudioRepository contenidoAudioRepository
    ) {
        this.usuarioRepository = usuarioRepository;
        this.playListRepository = playListRepository;
        this.contenidoAudioRepository = contenidoAudioRepository;
    }

    @Transactional
    public PlayList crearPlaylist(String usuarioId, String correoAutenticado, String nombre) {
        Usuario usuario = usuarioRepository.findWithPlaylistByCorreo(correoAutenticado)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado."));

        if (!usuario.getId().equals(usuarioId)) {
            throw new AccesoDenegadoException("No puedes crear playlists para otro usuario.");
        }

        PlayList nuevaLista = usuario.crearPlaylist(nombre);
        usuarioRepository.save(usuario);
        return nuevaLista;
    }

    @Transactional
    public void agregarContenido(String playlistId, String contenidoId, String correoAutenticado) {
        PlayList lista = obtenerPlaylistDelUsuario(playlistId, correoAutenticado);
        ContenidoAudio audio = contenidoAudioRepository.findById(contenidoId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Contenido no encontrado."));

        lista.agregarContenido(audio);
        playListRepository.save(lista);
    }

    @Transactional
    public PlayList agregarContenidoJamendo(String playlistId, JamendoPlaylistItemRequest request, String correoAutenticado) {
        PlayList lista = obtenerPlaylistDelUsuario(playlistId, correoAutenticado);
        lista.agregarContenidoJamendo(request);
        return playListRepository.save(lista);
    }

    @Transactional
    public void removerContenido(String playlistId, String contenidoId, String correoAutenticado) {
        PlayList lista = obtenerPlaylistDelUsuario(playlistId, correoAutenticado);
        lista.removerContenido(contenidoId);
        playListRepository.save(lista);
    }

    @Transactional
    public void eliminarPlaylist(String playlistId, String correoAutenticado) {
        Usuario usuario = usuarioRepository.findWithPlaylistByCorreo(correoAutenticado)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado."));

        PlayList lista = usuario.getPlaylist().stream()
                .filter(playlist -> playlist.getId().equals(playlistId))
                .findFirst()
                .orElseThrow(() -> new AccesoDenegadoException("La playlist no pertenece al usuario autenticado."));

        if ("favoritos".equalsIgnoreCase(lista.getNombre().trim())) {
            throw new IllegalArgumentException("La playlist Favoritos no se puede eliminar.");
        }

        usuario.eliminarPlaylist(playlistId);
        usuarioRepository.save(usuario);
    }

    private PlayList obtenerPlaylistDelUsuario(String playlistId, String correoAutenticado) {
        Usuario usuario = usuarioRepository.findWithPlaylistByCorreo(correoAutenticado)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado."));

        PlayList lista = usuario.getPlaylist().stream()
                .filter(playlist -> playlist.getId().equals(playlistId))
                .findFirst()
                .orElseThrow(() -> new AccesoDenegadoException("La playlist no pertenece al usuario autenticado."));

        lista.getContenidos().size();
        return lista;
    }
}
