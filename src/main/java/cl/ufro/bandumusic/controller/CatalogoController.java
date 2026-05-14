package cl.ufro.bandumusic.controller;

import cl.ufro.bandumusic.dto.response.ContenidoAudioResponse;
import cl.ufro.bandumusic.service.CatalogoService;
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
@RequestMapping("/api/catalogo")
@Validated
public class CatalogoController {

    private final CatalogoService catalogoService;

    public CatalogoController(CatalogoService catalogoService) {
        this.catalogoService = catalogoService;
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<ContenidoAudioResponse>> buscarPorTitulo(
            @RequestParam(defaultValue = "")
            @Size(max = 100, message = "La busqueda no puede superar 100 caracteres.")
            String titulo
    ) {
        List<ContenidoAudioResponse> resultados = catalogoService.buscarPorTitulo(titulo).stream()
                .map(ContenidoAudioResponse::from)
                .toList();
        return ResponseEntity.ok(resultados);
    }

    @GetMapping("/filtrar")
    public ResponseEntity<List<ContenidoAudioResponse>> filtrarPorArtista(
            @RequestParam
            @NotBlank(message = "El artista es obligatorio.")
            @Size(max = 100, message = "El artista no puede superar 100 caracteres.")
            String artista
    ) {
        List<ContenidoAudioResponse> resultados = catalogoService.filtrarPorArtista(artista).stream()
                .map(ContenidoAudioResponse::from)
                .toList();
        return ResponseEntity.ok(resultados);
    }
}
