package cl.ufro.bandumusic.exception;

public class CancionNoEncontradaException extends RuntimeException {
    public CancionNoEncontradaException(String mensaje) {
        super(mensaje);
    }
}