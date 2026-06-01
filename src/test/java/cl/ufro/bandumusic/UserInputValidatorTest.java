package cl.ufro.bandumusic;

import cl.ufro.bandumusic.exception.ValidacionAutenticacionException;
import cl.ufro.bandumusic.service.UserInputValidator;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class UserInputValidatorTest {

    private final UserInputValidator validator = new UserInputValidator();

    @Test
    void aceptaNombreUsuarioValido() {
        assertEquals("javier.cortes_2026", validator.validarNombreUsuario(" javier.cortes_2026 "));
    }

    @Test
    void rechazaNombreUsuarioReservado() {
        assertThrows(ValidacionAutenticacionException.class, () -> validator.validarNombreUsuario("admin"));
    }

    @Test
    void rechazaContrasenaSinNumero() {
        assertThrows(ValidacionAutenticacionException.class, () -> validator.validarContrasena("sololetras"));
    }
}
