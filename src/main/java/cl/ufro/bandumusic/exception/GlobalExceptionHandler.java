package cl.ufro.bandumusic.exception;

import cl.ufro.bandumusic.dto.response.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> manejarValidacionBody(
            MethodArgumentNotValidException ex,
            HttpServletRequest request
    ) {
        Map<String, String> errores = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errores.put(error.getField(), error.getDefaultMessage())
        );

        ErrorResponse respuesta = ErrorResponse.withErrors(
                HttpStatus.BAD_REQUEST.value(),
                "Validacion fallida",
                "Uno o mas campos enviados son invalidos.",
                request.getRequestURI(),
                errores
        );
        return ResponseEntity.badRequest().body(respuesta);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> manejarValidacionParametros(
            ConstraintViolationException ex,
            HttpServletRequest request
    ) {
        Map<String, String> errores = new LinkedHashMap<>();
        ex.getConstraintViolations().forEach(violation ->
                errores.put(violation.getPropertyPath().toString(), violation.getMessage())
        );

        ErrorResponse respuesta = ErrorResponse.withErrors(
                HttpStatus.BAD_REQUEST.value(),
                "Validacion fallida",
                "Uno o mas parametros enviados son invalidos.",
                request.getRequestURI(),
                errores
        );
        return ResponseEntity.badRequest().body(respuesta);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ErrorResponse> manejarParametroFaltante(
            MissingServletRequestParameterException ex,
            HttpServletRequest request
    ) {
        ErrorResponse respuesta = ErrorResponse.of(
                HttpStatus.BAD_REQUEST.value(),
                "Parametro requerido",
                "Falta el parametro obligatorio: " + ex.getParameterName() + ".",
                request.getRequestURI()
        );
        return ResponseEntity.badRequest().body(respuesta);
    }

    @ExceptionHandler(CredencialesInvalidasException.class)
    public ResponseEntity<ErrorResponse> manejarCredencialesInvalidas(
            CredencialesInvalidasException ex,
            HttpServletRequest request
    ) {
        ErrorResponse respuesta = ErrorResponse.of(
                HttpStatus.UNAUTHORIZED.value(),
                "No autorizado",
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(respuesta);
    }

    @ExceptionHandler({RecursoNoEncontradoException.class, CancionNoEncontradaException.class})
    public ResponseEntity<ErrorResponse> manejarNoEncontrado(RuntimeException ex, HttpServletRequest request) {
        ErrorResponse respuesta = ErrorResponse.of(
                HttpStatus.NOT_FOUND.value(),
                "No encontrado",
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta);
    }

    @ExceptionHandler(UsuarioDuplicadoException.class)
    public ResponseEntity<ErrorResponse> manejarUsuarioDuplicado(
            UsuarioDuplicadoException ex,
            HttpServletRequest request
    ) {
        ErrorResponse respuesta = ErrorResponse.of(
                HttpStatus.CONFLICT.value(),
                "Conflicto",
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(respuesta);
    }

    @ExceptionHandler(PlaylistLlenaException.class)
    public ResponseEntity<ErrorResponse> manejarPlaylistLlena(
            PlaylistLlenaException ex,
            HttpServletRequest request
    ) {
        ErrorResponse respuesta = ErrorResponse.of(
                HttpStatus.CONFLICT.value(),
                "Conflicto",
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(respuesta);
    }

    @ExceptionHandler(IntegracionExternaException.class)
    public ResponseEntity<ErrorResponse> manejarIntegracionExterna(
            IntegracionExternaException ex,
            HttpServletRequest request
    ) {
        ErrorResponse respuesta = ErrorResponse.of(
                HttpStatus.SERVICE_UNAVAILABLE.value(),
                "Servicio externo no disponible",
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(respuesta);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> manejarArgumentoInvalido(
            IllegalArgumentException ex,
            HttpServletRequest request
    ) {
        ErrorResponse respuesta = ErrorResponse.of(
                HttpStatus.BAD_REQUEST.value(),
                "Solicitud invalida",
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.badRequest().body(respuesta);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> manejarErrorInterno(Exception ex, HttpServletRequest request) {
        ErrorResponse respuesta = ErrorResponse.of(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Error interno",
                "Ocurrio un error inesperado en el servidor.",
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
    }
}
