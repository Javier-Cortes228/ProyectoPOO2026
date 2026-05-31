package cl.ufro.bandumusic.controller;

import cl.ufro.bandumusic.dto.response.JamendoTrackResponse;
import cl.ufro.bandumusic.service.JamendoService;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/jamendo")
@Validated
public class JamendoController {

    private final JamendoService jamendoService;

    public JamendoController(JamendoService jamendoService) {
        this.jamendoService = jamendoService;
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<JamendoTrackResponse>> buscarTracks(
            @RequestParam
            @NotBlank(message = "La busqueda de Jamendo es obligatoria.")
            @Size(max = 100, message = "La busqueda de Jamendo no puede superar 100 caracteres.")
            String query
    ) {
        return ResponseEntity.ok(jamendoService.buscarTracks(query));
    }
}
