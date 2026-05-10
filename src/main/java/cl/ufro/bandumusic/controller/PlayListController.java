package cl.ufro.bandumusic.controller;

import cl.ufro.bandumusic.model.ContenidoAudio;
import cl.ufro.bandumusic.model.PlayList;
import cl.ufro.bandumusic.model.Usuario;
import cl.ufro.bandumusic.repository.ContenidoAudioRepository;
import cl.ufro.bandumusic.repository.PlayListRepository;
import cl.ufro.bandumusic.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/playlists")
@CrossOrigin(origins = "*")
public class PlayListController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PlayListRepository playListRepository;

    @Autowired
    private ContenidoAudioRepository contenidoAudioRepository;

    // Endpoint para crear una nueva playlist para un usuario específico
    @PostMapping("/{usuarioId}/crear")
    public ResponseEntity<?> crearPlaylist(@PathVariable String usuarioId, @RequestParam String nombre) {
        Usuario usuario = usuarioRepository.findById(usuarioId).orElse(null);
        if (usuario == null) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }

        try {
            PlayList nuevaLista = usuario.crearPlaylist(nombre);
            usuarioRepository.save(usuario);
            return ResponseEntity.ok(nuevaLista);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Endpoint para agregar una canción a una playlist
    @PostMapping("/{playlistId}/agregar/{contenidoId}")
    public ResponseEntity<?> agregarContenido(@PathVariable String playlistId, @PathVariable String contenidoId) {
        PlayList lista = playListRepository.findById(playlistId).orElse(null);
        ContenidoAudio audio = contenidoAudioRepository.findById(contenidoId).orElse(null);

        if (lista == null || audio == null) {
            return ResponseEntity.badRequest().body("Playlist o Contenido no encontrado");
        }

        try {
            lista.agregarContenido(audio);
            playListRepository.save(lista);
            return ResponseEntity.ok("Contenido agregado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}