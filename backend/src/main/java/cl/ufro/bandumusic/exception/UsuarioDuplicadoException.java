package cl.ufro.bandumusic.exception;

public class UsuarioDuplicadoException extends RuntimeException {
    public UsuarioDuplicadoException(String mensaje) {
        super(mensaje);
    }
}