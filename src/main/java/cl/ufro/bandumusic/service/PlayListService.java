package cl.ufro.bandumusic.service;

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
    public PlayList crearPlaylist(String usuarioId, String nombre) {
        Usuario usuario = usuarioRepository.findWithPlaylistById(usuarioId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado."));

        PlayList nuevaLista = usuario.crearPlaylist(nombre);
        usuarioRepository.save(usuario);
        return nuevaLista;
    }

    @Transactional
    public void agregarContenido(String playlistId, String contenidoId) {
        PlayList lista = playListRepository.findById(playlistId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Playlist no encontrada."));

        ContenidoAudio audio = contenidoAudioRepository.findById(contenidoId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Contenido no encontrado."));

        lista.agregarContenido(audio);
        playListRepository.save(lista);
    }

    @Transactional
    public void removerContenido(String playlistId, String contenidoId) {
        PlayList lista = playListRepository.findById(playlistId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Playlist no encontrada."));

        lista.removerContenido(contenidoId);
        playListRepository.save(lista);
    }
}
