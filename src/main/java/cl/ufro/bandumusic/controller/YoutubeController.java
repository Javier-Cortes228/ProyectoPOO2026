package cl.ufro.bandumusic.controller;

import cl.ufro.bandumusic.dto.response.YoutubeVideoResponse;
import cl.ufro.bandumusic.service.YoutubeService;
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
@RequestMapping("/api/youtube")
@Validated
public class YoutubeController {

    private final YoutubeService youtubeService;

    public YoutubeController(YoutubeService youtubeService) {
        this.youtubeService = youtubeService;
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<YoutubeVideoResponse>> buscarVideos(
            @RequestParam
            @NotBlank(message = "La busqueda de YouTube es obligatoria.")
            @Size(max = 100, message = "La busqueda de YouTube no puede superar 100 caracteres.")
            String query
    ) {
        return ResponseEntity.ok(youtubeService.buscarVideos(query));
    }
}
