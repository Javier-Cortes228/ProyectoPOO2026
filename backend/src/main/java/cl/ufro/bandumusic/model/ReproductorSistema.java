package cl.ufro.bandumusic.model;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

public class ReproductorSistema {

    private static final Logger LOGGER = LoggerFactory.getLogger(ReproductorSistema.class);

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
        this.colaReproduccion = lista != null ? lista : new ArrayList<>();
        this.indiceActual = 0;

        if (!colaReproduccion.isEmpty()) {
            LOGGER.info("Cola cargada. Iniciando reproduccion automatica.");
            iniciarReproduccion(colaReproduccion.get(indiceActual));
        } else {
            LOGGER.warn("La lista proporcionada esta vacia.");
        }
    }

    public void siguiente() {
        if (colaReproduccion.isEmpty()) {
            return;
        }

        colaReproduccion.get(indiceActual).pausar();

        if (indiceActual < colaReproduccion.size() - 1) {
            indiceActual++;
            iniciarReproduccion(colaReproduccion.get(indiceActual));
        } else {
            LOGGER.warn("Se alcanzo el final de la cola de reproduccion.");
        }
    }

    public void anterior() {
        if (colaReproduccion.isEmpty()) {
            return;
        }

        colaReproduccion.get(indiceActual).pausar();

        if (indiceActual > 0) {
            indiceActual--;
            iniciarReproduccion(colaReproduccion.get(indiceActual));
        } else {
            LOGGER.warn("La cola ya esta en la primera pista. Reiniciando la reproduccion actual.");
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
