package cl.ufro.bandumusic;

import cl.ufro.bandumusic.service.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtServiceTest {

    @Test
    void generaYValidaTokenFirmado() {
        JwtService jwtService = servicioJwt("bandumusic-test-secret-with-more-than-thirty-two-characters", 3600);

        String token = jwtService.generarToken("admin@ufro.cl");

        assertTrue(jwtService.esTokenValido(token));
        assertEquals("admin@ufro.cl", jwtService.obtenerCorreo(token));
    }

    @Test
    void rechazaTokenManipulado() {
        JwtService jwtService = servicioJwt("bandumusic-test-secret-with-more-than-thirty-two-characters", 3600);
        String token = jwtService.generarToken("admin@ufro.cl");

        String tokenManipulado = token.substring(0, token.length() - 2) + "xx";

        assertFalse(jwtService.esTokenValido(tokenManipulado));
    }

    @Test
    void exigeSecretoJwtSuficientementeLargo() {
        JwtService jwtService = servicioJwt("corto", 3600);

        assertThrows(IllegalStateException.class, () -> jwtService.generarToken("admin@ufro.cl"));
    }

    private JwtService servicioJwt(String secret, long expirationSeconds) {
        JwtService jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "jwtSecret", secret);
        ReflectionTestUtils.setField(jwtService, "expirationSeconds", expirationSeconds);
        return jwtService;
    }
}
