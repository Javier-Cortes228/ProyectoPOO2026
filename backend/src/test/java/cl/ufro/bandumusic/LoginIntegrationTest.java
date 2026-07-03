package cl.ufro.bandumusic;

import cl.ufro.bandumusic.controller.UsuarioController;
import cl.ufro.bandumusic.dto.request.LoginRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
class LoginIntegrationTest {

    @Autowired
    private UsuarioController usuarioController;

    @Test
    void loginUsuarioSemillaRetornaTokenYPlaylists() {
        var response = usuarioController.loginUsuario(new LoginRequest("admin@ufro.cl", "A12345678"));
        var body = response.getBody();

        assertNotNull(body);
        assertEquals("Cookie", body.tokenType());
        assertEquals("admin@ufro.cl", body.usuario().correo());
        assertFalse(body.usuario().playlist().isEmpty());
        assertEquals("Favoritos", body.usuario().playlist().get(0).nombre());
        assertTrue(response.getHeaders().getFirst("Set-Cookie").contains("bandumusic_auth="));
        assertTrue(response.getHeaders().getFirst("Set-Cookie").contains("HttpOnly"));
    }
}
