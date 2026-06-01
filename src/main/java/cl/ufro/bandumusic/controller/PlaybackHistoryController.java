package cl.ufro.bandumusic.controller;

import cl.ufro.bandumusic.dto.request.PlaybackRequest;
import cl.ufro.bandumusic.dto.response.PlaybackHistoryResponse;
import cl.ufro.bandumusic.service.PlaybackHistoryService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/historial")
@Validated
public class PlaybackHistoryController {

    private final PlaybackHistoryService playbackHistoryService;

    public PlaybackHistoryController(PlaybackHistoryService playbackHistoryService) {
        this.playbackHistoryService = playbackHistoryService;
    }

    @PostMapping("/reproducciones")
    public ResponseEntity<PlaybackHistoryResponse> registrarReproduccion(
            @Valid @RequestBody PlaybackRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(PlaybackHistoryResponse.from(
                playbackHistoryService.registrar(authentication.getName(), request)
        ));
    }

    @GetMapping("/recientes")
    public ResponseEntity<List<PlaybackHistoryResponse>> obtenerRecientes(
            @RequestParam(defaultValue = "20")
            @Min(value = 1, message = "El limite minimo es 1.")
            @Max(value = 50, message = "El limite maximo es 50.")
            int limit,
            Authentication authentication
    ) {
        List<PlaybackHistoryResponse> recientes = playbackHistoryService.obtenerRecientes(authentication.getName(), limit)
                .stream()
                .map(PlaybackHistoryResponse::from)
                .toList();
        return ResponseEntity.ok(recientes);
    }
}
