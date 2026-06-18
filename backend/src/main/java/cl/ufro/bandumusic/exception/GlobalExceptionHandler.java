package cl.ufro.bandumusic.exception;

import cl.ufro.bandumusic.dto.response.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger LOGGER = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> manejarValidacionBody(
            MethodArgumentNotValidException ex,
            HttpServletRequest request
    ) {
        LOGGER.warn("Validacion de body fallida en {}: {}", request.getRequestURI(), ex.getMessage());
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
        LOGGER.warn("Validacion de parametros fallida en {}: {}", request.getRequestURI(), ex.getMessage());
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
        LOGGER.warn("Parametro faltante en {}: {}", request.getRequestURI(), ex.getParameterName());
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
        LOGGER.warn("Credenciales invalidas en {}: {}", request.getRequestURI(), ex.getMessage());
        ErrorResponse respuesta = ErrorResponse.of(
                HttpStatus.UNAUTHORIZED.value(),
                "No autorizado",
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(respuesta);
    }

    @ExceptionHandler(CorreoNoVerificadoException.class)
    public ResponseEntity<ErrorResponse> manejarCorreoNoVerificado(
            CorreoNoVerificadoException ex,
            HttpServletRequest request
    ) {
        LOGGER.warn("Acceso con correo no verificado en {}: {}", request.getRequestURI(), ex.getMessage());
        ErrorResponse respuesta = ErrorResponse.of(
                HttpStatus.FORBIDDEN.value(),
                "Correo no verificado",
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(respuesta);
    }

    @ExceptionHandler(AccesoDenegadoException.class)
    public ResponseEntity<ErrorResponse> manejarAccesoDenegado(
            AccesoDenegadoException ex,
            HttpServletRequest request
    ) {
        LOGGER.warn("Acceso denegado en {}: {}", request.getRequestURI(), ex.getMessage());
        ErrorResponse respuesta = ErrorResponse.of(
                HttpStatus.FORBIDDEN.value(),
                "Acceso denegado",
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(respuesta);
    }

    @ExceptionHandler(TokenVerificacionException.class)
    public ResponseEntity<ErrorResponse> manejarTokenVerificacion(
            TokenVerificacionException ex,
            HttpServletRequest request
    ) {
        LOGGER.warn("Verificacion de correo fallida en {}: {}", request.getRequestURI(), ex.getMessage());
        ErrorResponse respuesta = ErrorResponse.of(
                HttpStatus.BAD_REQUEST.value(),
                "Token de verificacion invalido",
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.badRequest().body(respuesta);
    }

    @ExceptionHandler(ValidacionAutenticacionException.class)
    public ResponseEntity<ErrorResponse> manejarValidacionAutenticacion(
            ValidacionAutenticacionException ex,
            HttpServletRequest request
    ) {
        LOGGER.warn("Validacion de autenticacion fallida en {}: {}", request.getRequestURI(), ex.getMessage());
        ErrorResponse respuesta = ErrorResponse.of(
                HttpStatus.BAD_REQUEST.value(),
                "Validacion de autenticacion fallida",
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.badRequest().body(respuesta);
    }

    @ExceptionHandler({RecursoNoEncontradoException.class, CancionNoEncontradaException.class})
    public ResponseEntity<ErrorResponse> manejarNoEncontrado(RuntimeException ex, HttpServletRequest request) {
        LOGGER.warn("Recurso no encontrado en {}: {}", request.getRequestURI(), ex.getMessage());
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
        LOGGER.warn("Conflicto de usuario en {}: {}", request.getRequestURI(), ex.getMessage());
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
        LOGGER.warn("Playlist llena en {}: {}", request.getRequestURI(), ex.getMessage());
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
        LOGGER.error("Fallo de integracion externa en {}: {}", request.getRequestURI(), ex.getMessage(), ex);
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
        LOGGER.warn("Solicitud invalida en {}: {}", request.getRequestURI(), ex.getMessage());
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
        LOGGER.error("Error no controlado en {}", request.getRequestURI(), ex);
        ErrorResponse respuesta = ErrorResponse.of(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Error interno",
                "Ocurrio un error inesperado en el servidor.",
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
    }
}
