package cl.ufro.bandumusic;

import cl.ufro.bandumusic.model.PasswordResetToken;
import cl.ufro.bandumusic.model.Usuario;
import cl.ufro.bandumusic.repository.PasswordResetTokenRepository;
import cl.ufro.bandumusic.repository.UsuarioRepository;
import cl.ufro.bandumusic.service.EmailAddressValidator;
import cl.ufro.bandumusic.service.EmailService;
import cl.ufro.bandumusic.service.PasswordResetService;
import cl.ufro.bandumusic.service.UserInputValidator;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class PasswordResetServiceTest {

    private final PasswordResetTokenRepository tokenRepository = mock(PasswordResetTokenRepository.class);
    private final UsuarioRepository usuarioRepository = mock(UsuarioRepository.class);
    private final EmailService emailService = mock(EmailService.class);
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final PasswordResetService service = new PasswordResetService(
            tokenRepository,
            usuarioRepository,
            emailService,
            passwordEncoder,
            new EmailAddressValidator(false, ""),
            new UserInputValidator(),
            10,
            5
    );

    @Test
    void solicitaVerificaYRestableceContrasenaConCodigoTemporal() {
        Usuario usuario = new Usuario("u-reset", "ResetUser", "reset@example.com", passwordEncoder.encode("Clave1234"));
        when(usuarioRepository.findByCorreo("reset@example.com")).thenReturn(Optional.of(usuario));
        when(tokenRepository.findByUsuarioAndUsedAtIsNull(usuario)).thenReturn(List.of());
        when(tokenRepository.save(any(PasswordResetToken.class))).thenAnswer(invocation -> invocation.getArgument(0));

        service.solicitarCodigo("reset@example.com");

        ArgumentCaptor<String> codigoCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<PasswordResetToken> tokenCaptor = ArgumentCaptor.forClass(PasswordResetToken.class);
        verify(emailService).enviarCodigoRecuperacion(
                eq("reset@example.com"),
                eq("ResetUser"),
                codigoCaptor.capture(),
                eq(10L)
        );
        verify(tokenRepository).save(tokenCaptor.capture());

        String codigo = codigoCaptor.getValue();
        PasswordResetToken token = tokenCaptor.getValue();
        assertTrue(codigo.matches("\\d{6}"));
        assertNotEquals(codigo, token.getCodeHash());
        assertTrue(passwordEncoder.matches(codigo, token.getCodeHash()));

        when(tokenRepository.findTopByUsuarioCorreoAndUsedAtIsNullOrderByCreatedAtDesc("reset@example.com"))
                .thenReturn(Optional.of(token));

        service.verificarCodigo("reset@example.com", codigo);
        assertTrue(token.fueVerificado());

        service.restablecerContrasena("reset@example.com", codigo, "NuevaClave123");

        assertTrue(token.fueUsado());
        assertTrue(passwordEncoder.matches("NuevaClave123", usuario.getContrasena()));
    }
}
