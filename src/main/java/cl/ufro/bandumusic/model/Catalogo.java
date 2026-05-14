package cl.ufro.bandumusic.model;

import cl.ufro.bandumusic.exception.CancionNoEncontradaException;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

public class Catalogo {

    private List<ContenidoAudio> cancionesDisponibles;

    public Catalogo() {
        this.cancionesDisponibles = new ArrayList<>();
    }

    public void agregarAlCatalogo(ContenidoAudio audio) {
        if (audio == null) {
            throw new IllegalArgumentException("El contenido del catalogo no puede ser nulo.");
        }
        this.cancionesDisponibles.add(audio);
    }

    public List<ContenidoAudio> buscarPorTitulo(String palabraClave) {
        String busqueda = palabraClave == null ? "" : palabraClave.trim().toLowerCase(Locale.ROOT);

        List<ContenidoAudio> resultados = cancionesDisponibles.stream()
                .filter(audio -> audio.getTitulo().toLowerCase(Locale.ROOT).contains(busqueda))
                .collect(Collectors.toList());

        if (resultados.isEmpty()) {
            throw new CancionNoEncontradaException("No se encontro contenido con: " + palabraClave);
        }
        return resultados;
    }

    public List<ContenidoAudio> filtrarPorArtista(String artista) {
        if (artista == null || artista.trim().isEmpty()) {
            throw new IllegalArgumentException("El artista es obligatorio.");
        }

        String artistaNormalizado = artista.trim();
        return cancionesDisponibles.stream()
                .filter(audio -> audio instanceof Cancion)
                .map(audio -> (Cancion) audio)
                .filter(cancion -> cancion.getArtista().equalsIgnoreCase(artistaNormalizado))
                .map(cancion -> (ContenidoAudio) cancion)
                .collect(Collectors.toList());
    }

    public List<ContenidoAudio> getCancionesDisponibles() {
        return cancionesDisponibles;
    }
}
