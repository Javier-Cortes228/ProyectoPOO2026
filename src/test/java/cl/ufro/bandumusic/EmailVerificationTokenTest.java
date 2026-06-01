package cl.ufro.bandumusic;

import cl.ufro.bandumusic.model.EmailVerificationToken;
import cl.ufro.bandumusic.model.Usuario;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class EmailVerificationTokenTest {

    @Test
    void consideraExpiradoCuandoLaFechaEsIgualOAnteriorAAhora() {
        LocalDateTime ahora = LocalDateTime.now();
        EmailVerificationToken token = new EmailVerificationToken(
                "t1",
                "token",
                "hash",
                new Usuario("u1", "javier", "javier@ufro.cl", "hash"),
                ahora.minusMinutes(10),
                ahora
        );

        assertTrue(token.estaExpirado(ahora));
        assertTrue(token.estaExpirado(ahora.plusSeconds(1)));
        assertFalse(token.estaExpirado(ahora.minusSeconds(1)));
    }
}
