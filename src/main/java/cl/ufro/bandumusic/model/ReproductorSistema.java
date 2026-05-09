package cl.ufro.bandumusic.model;

import java.util.ArrayList;
import java.util.List;

public class ReproductorSistema {

    private List<ContenidoAudio> colaReproduccion;
    private int indiceActual;

    public ReproductorSistema() {
        this.colaReproduccion = new ArrayList<>();
        this.indiceActual = 0;
    }

    public void iniciarReproduccion(Reproducible item) {
        if (item != null) {
            item.reproducir();
        }
    }

    public void cargarCola(List<ContenidoAudio> lista) {
        this.colaReproduccion = lista;
        this.indiceActual = 0;

        if (!colaReproduccion.isEmpty()) {
            System.out.println("Cola cargada. Iniciando reproducción automática...");
            iniciarReproduccion(colaReproduccion.get(indiceActual));
        } else {
            System.err.println("La lista proporcionada está vacía.");
        }
    }

    public void siguiente() {
        if (colaReproduccion.isEmpty()) return;

        colaReproduccion.get(indiceActual).pausar();

        if (indiceActual < colaReproduccion.size() - 1) {
            indiceActual++;
            iniciarReproduccion(colaReproduccion.get(indiceActual));
        } else {
            System.err.println("Has llegado al final de la cola de reproducción.");
        }
    }

    public void anterior() {
        if (colaReproduccion.isEmpty()) return;

        colaReproduccion.get(indiceActual).pausar();

        if (indiceActual > 0) {
            indiceActual--;
            iniciarReproduccion(colaReproduccion.get(indiceActual));
        } else {
            System.err.println("Estás en la primera pista. Reiniciando...");
            iniciarReproduccion(colaReproduccion.get(indiceActual));
        }
    }

    public List<ContenidoAudio> getColaReproduccion() {
        return colaReproduccion;
    }

    public int getIndiceActual() {
        return indiceActual;
    }
}