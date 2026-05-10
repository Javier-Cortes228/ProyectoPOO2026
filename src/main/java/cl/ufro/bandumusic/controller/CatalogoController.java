package cl.ufro.bandumusic.controller;

import cl.ufro.bandumusic.model.Catalogo;
import cl.ufro.bandumusic.model.ContenidoAudio;
import cl.ufro.bandumusic.repository.ContenidoAudioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/catalogo")
@CrossOrigin(origins = "*")
public class CatalogoController {

    @Autowired
    private ContenidoAudioRepository contenidoAudioRepository;

    // Metodo para obtener el catalogo
    private Catalogo obtenerCatalogoPoblado() {
        Catalogo catalogo = new Catalogo();
        List<ContenidoAudio> todosLosAudios = contenidoAudioRepository.findAll();
        for (ContenidoAudio audio : todosLosAudios) {
            catalogo.agregarAlCatalogo(audio);
        }
        return catalogo;
    }

    // Endpoint para buscar por título
    @GetMapping("/buscar")
    public ResponseEntity<?> buscarPorTitulo(@RequestParam String titulo) {
        try {
            Catalogo catalogo = obtenerCatalogoPoblado();
            List<ContenidoAudio> resultados = catalogo.buscarPorTitulo(titulo);
            return ResponseEntity.ok(resultados);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Endpoint para filtrar por artista
    @GetMapping("/filtrar")
    public ResponseEntity<?> filtrarPorArtista(@RequestParam String artista) {
        Catalogo catalogo = obtenerCatalogoPoblado();
        List<ContenidoAudio> resultados = catalogo.filtrarPorArtista(artista);
        return ResponseEntity.ok(resultados);
    }
}