package cl.ufro.bandumusic.service;

import cl.ufro.bandumusic.exception.ValidacionAutenticacionException;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.Set;
import java.util.regex.Pattern;

@Service
public class UserInputValidator {

    private static final Pattern USERNAME_PATTERN = Pattern.compile("^[A-Za-z0-9._-]+$");
    private static final Pattern PASSWORD_PATTERN = Pattern.compile("^(?=.*[A-Za-z])(?=.*\\d).{8,72}$");
    private static final Set<String> RESERVED_USERNAMES = Set.of(
            "admin", "root", "system", "null", "undefined", "usuario", "user", "test"
    );

    public String validarNombreUsuario(String nombreUsuario) {
        String normalizado = nombreUsuario == null ? "" : nombreUsuario.trim();
        if (normalizado.length() < 3 || normalizado.length() > 40) {
            throw new ValidacionAutenticacionException("El nombre de usuario debe tener entre 3 y 40 caracteres.");
        }
        if (!USERNAME_PATTERN.matcher(normalizado).matches()) {
            throw new ValidacionAutenticacionException("El nombre de usuario solo puede usar letras, numeros, punto, guion y guion bajo.");
        }
        if (normalizado.startsWith(".") || normalizado.endsWith(".") || normalizado.contains("..")) {
            throw new ValidacionAutenticacionException("El nombre de usuario no puede empezar, terminar o repetir puntos.");
        }
        if (RESERVED_USERNAMES.contains(normalizado.toLowerCase(Locale.ROOT))) {
            throw new ValidacionAutenticacionException("El nombre de usuario no esta permitido.");
        }
        return normalizado;
    }

    public void validarContrasena(String contrasena) {
        String valor = contrasena == null ? "" : contrasena;
        if (!PASSWORD_PATTERN.matcher(valor).matches()) {
            throw new ValidacionAutenticacionException("La contrasena debe tener entre 8 y 72 caracteres e incluir letras y numeros.");
        }
        if (valor.toLowerCase(Locale.ROOT).contains("password") || valor.toLowerCase(Locale.ROOT).contains("contrasena")) {
            throw new ValidacionAutenticacionException("La contrasena es demasiado predecible.");
        }
    }
}
