package cl.ufro.bandumusic.model;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class Catalogo {

    private List<ContenidoAudio> cancionesDisponibles;

    public Catalogo() {
        this.cancionesDisponibles = new ArrayList<>();
    }

    public void agregarAlCatalogo(ContenidoAudio audio) {
        this.cancionesDisponibles.add(audio);
    }

    public List<ContenidoAudio> buscarPorTitulo(String palabraClave) {
        // Usamos Streams para filtrar la lista
        return cancionesDisponibles.stream()
                .filter(audio -> audio.getTitulo().toLowerCase().contains(palabraClave.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<ContenidoAudio> filtrarPorArtista(String artista) {
        return cancionesDisponibles.stream()
                .filter(audio -> audio instanceof Cancion) // primero filtramos que solo sean Canciones (no Podcast)
                .map(audio -> (Cancion) audio) // transformamos temporalmente a Cancion para leer el Artista
                .filter(cancion -> cancion.getArtista().equalsIgnoreCase(artista)) // filtramos por el artista
                .map(cancion -> (ContenidoAudio) cancion) // Lo devolvemos a su forma genérica de ContenidoAudio
                .collect(Collectors.toList());
    }

    public List<ContenidoAudio> getCancionesDisponibles() {
        return cancionesDisponibles;
    }
}