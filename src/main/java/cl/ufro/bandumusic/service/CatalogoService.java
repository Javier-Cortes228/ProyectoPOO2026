package cl.ufro.bandumusic.service;

import cl.ufro.bandumusic.model.Catalogo;
import cl.ufro.bandumusic.model.ContenidoAudio;
import cl.ufro.bandumusic.repository.ContenidoAudioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CatalogoService {

    private final ContenidoAudioRepository contenidoAudioRepository;

    public CatalogoService(ContenidoAudioRepository contenidoAudioRepository) {
        this.contenidoAudioRepository = contenidoAudioRepository;
    }

    @Transactional(readOnly = true)
    public List<ContenidoAudio> buscarPorTitulo(String titulo) {
        Catalogo catalogo = obtenerCatalogoPoblado();
        return catalogo.buscarPorTitulo(titulo);
    }

    @Transactional(readOnly = true)
    public List<ContenidoAudio> filtrarPorArtista(String artista) {
        Catalogo catalogo = obtenerCatalogoPoblado();
        return catalogo.filtrarPorArtista(artista);
    }

    private Catalogo obtenerCatalogoPoblado() {
        Catalogo catalogo = new Catalogo();
        contenidoAudioRepository.findAll().forEach(catalogo::agregarAlCatalogo);
        return catalogo;
    }
}
