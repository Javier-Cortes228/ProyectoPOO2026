package cl.ufro.bandumusic.exception;

public class IntegracionExternaException extends RuntimeException {
    public IntegracionExternaException(String mensaje) {
        super(mensaje);
    }

    public IntegracionExternaException(String mensaje, Throwable causa) {
        super(mensaje, causa);
    }
}
