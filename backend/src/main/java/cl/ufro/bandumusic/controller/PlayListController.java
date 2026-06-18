package cl.ufro.bandumusic.controller;

import cl.ufro.bandumusic.dto.request.JamendoPlaylistItemRequest;
import cl.ufro.bandumusic.dto.response.MensajeResponse;
import cl.ufro.bandumusic.dto.response.PlayListResponse;
import cl.ufro.bandumusic.model.PlayList;
import cl.ufro.bandumusic.service.PlayListService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/playlists")
@Validated
public class PlayListController {

    private final PlayListService playListService;

    public PlayListController(PlayListService playListService) {
        this.playListService = playListService;
    }

    @PostMapping("/{usuarioId}/crear")
    public ResponseEntity<PlayListResponse> crearPlaylist(
            @PathVariable @NotBlank(message = "El id del usuario es obligatorio.") String usuarioId,
            @RequestParam @NotBlank(message = "El nombre de la playlist es obligatorio.")
            @Size(max = 80, message = "El nombre de la playlist no puede superar 80 caracteres.")
            String nombre,
            Authentication authentication
    ) {
        PlayList nuevaLista = playListService.crearPlaylist(usuarioId, authentication.getName(), nombre);
        return ResponseEntity.ok(PlayListResponse.from(nuevaLista));
    }

    @PostMapping("/{playlistId}/agregar/{contenidoId}")
    public ResponseEntity<MensajeResponse> agregarContenido(
            @PathVariable @NotBlank(message = "El id de la playlist es obligatorio.") String playlistId,
            @PathVariable @NotBlank(message = "El id del contenido es obligatorio.") String contenidoId,
            Authentication authentication
    ) {
        playListService.agregarContenido(playlistId, contenidoId, authentication.getName());
        return ResponseEntity.ok(new MensajeResponse("Contenido agregado exitosamente."));
    }

    @PostMapping("/{playlistId}/agregar-jamendo")
    public ResponseEntity<PlayListResponse> agregarContenidoJamendo(
            @PathVariable @NotBlank(message = "El id de la playlist es obligatorio.") String playlistId,
            @Valid @RequestBody JamendoPlaylistItemRequest request,
            Authentication authentication
    ) {
        PlayList playlist = playListService.agregarContenidoJamendo(playlistId, request, authentication.getName());
        return ResponseEntity.ok(PlayListResponse.from(playlist));
    }

    @DeleteMapping("/{playlistId}/contenidos/{contenidoId}")
    public ResponseEntity<MensajeResponse> removerContenido(
            @PathVariable @NotBlank(message = "El id de la playlist es obligatorio.") String playlistId,
            @PathVariable @NotBlank(message = "El id del contenido es obligatorio.") String contenidoId,
            Authentication authentication
    ) {
        playListService.removerContenido(playlistId, contenidoId, authentication.getName());
        return ResponseEntity.ok(new MensajeResponse("Contenido removido exitosamente."));
    }

    @DeleteMapping("/{playlistId}")
    public ResponseEntity<MensajeResponse> eliminarPlaylist(
            @PathVariable @NotBlank(message = "El id de la playlist es obligatorio.") String playlistId,
            Authentication authentication
    ) {
        playListService.eliminarPlaylist(playlistId, authentication.getName());
        return ResponseEntity.ok(new MensajeResponse("Playlist eliminada exitosamente."));
    }
}
