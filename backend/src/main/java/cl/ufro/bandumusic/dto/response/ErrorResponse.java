package cl.ufro.bandumusic.dto.response;

import java.time.LocalDateTime;
import java.util.Map;

public record ErrorResponse(
        LocalDateTime timestamp,
        int status,
        String error,
        String mensaje,
        String path,
        Map<String, String> errores
) {
    public static ErrorResponse of(int status, String error, String mensaje, String path) {
        return new ErrorResponse(LocalDateTime.now(), status, error, mensaje, path, Map.of());
    }

    public static ErrorResponse withErrors(int status, String error, String mensaje, String path, Map<String, String> errores) {
        return new ErrorResponse(LocalDateTime.now(), status, error, mensaje, path, errores);
    }
}
