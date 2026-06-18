package cl.ufro.bandumusic.service;

import cl.ufro.bandumusic.exception.TokenVerificacionException;
import cl.ufro.bandumusic.model.PasswordResetToken;
import cl.ufro.bandumusic.model.Usuario;
import cl.ufro.bandumusic.repository.PasswordResetTokenRepository;
import cl.ufro.bandumusic.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Locale;
import java.util.UUID;

@Service
public class PasswordResetService {

    private static final Logger LOGGER = LoggerFactory.getLogger(PasswordResetService.class);

    private final PasswordResetTokenRepository tokenRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final EmailAddressValidator emailAddressValidator;
    private final UserInputValidator userInputValidator;
    private final long expirationMinutes;
    private final int maxAttempts;
    private final SecureRandom secureRandom = new SecureRandom();

    public PasswordResetService(
            PasswordResetTokenRepository tokenRepository,
            UsuarioRepository usuarioRepository,
            EmailService emailService,
            PasswordEncoder passwordEncoder,
            EmailAddressValidator emailAddressValidator,
            UserInputValidator userInputValidator,
            @Value("${app.password-reset.expiration-minutes:10}") long expirationMinutes,
            @Value("${app.password-reset.max-attempts:5}") int maxAttempts
    ) {
        this.tokenRepository = tokenRepository;
        this.usuarioRepository = usuarioRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
        this.emailAddressValidator = emailAddressValidator;
        this.userInputValidator = userInputValidator;
        this.expirationMinutes = Math.max(1, expirationMinutes);
        this.maxAttempts = Math.max(1, maxAttempts);
    }

    @Transactional
    public void solicitarCodigo(String correo) {
        String correoNormalizado = emailAddressValidator.validarYNormalizar(correo);
        usuarioRepository.findByCorreo(correoNormalizado)
                .ifPresentOrElse(this::crearYEnviarCodigo, () ->
                        LOGGER.info("Solicitud de recuperacion para correo no registrado: {}", correoNormalizado));
    }

    @Transactional
    public void verificarCodigo(String correo, String codigo) {
        PasswordResetToken token = obtenerTokenActivo(correo, codigo);
        LocalDateTime ahora = LocalDateTime.now();
        token.marcarComoVerificado(ahora);
        tokenRepository.save(token);
    }

    @Transactional
    public void restablecerContrasena(String correo, String codigo, String nuevaContrasena) {
        userInputValidator.validarContrasena(nuevaContrasena);
        PasswordResetToken token = obtenerTokenActivo(correo, codigo);
        if (!token.fueVerificado()) {
            token.marcarComoVerificado(LocalDateTime.now());
        }

        LocalDateTime ahora = LocalDateTime.now();
        Usuario usuario = token.getUsuario();
        usuario.setContrasena(passwordEncoder.encode(nuevaContrasena));
        token.marcarComoUsado(ahora);
        usuarioRepository.save(usuario);
        tokenRepository.save(token);
        LOGGER.info("Contrasena restablecida correctamente para {}", usuario.getCorreo());
    }

    private void crearYEnviarCodigo(Usuario usuario) {
        LocalDateTime ahora = LocalDateTime.now();
        tokenRepository.findByUsuarioAndUsedAtIsNull(usuario)
                .forEach(token -> token.marcarComoUsado(ahora));

        String codigo = generarCodigoNumerico();
        PasswordResetToken token = new PasswordResetToken(
                UUID.randomUUID().toString(),
                passwordEncoder.encode(codigo),
                usuario,
                ahora,
                ahora.plusMinutes(expirationMinutes)
        );
        tokenRepository.save(token);
        emailService.enviarCodigoRecuperacion(
                usuario.getCorreo(),
                usuario.getNombreUsuario(),
                codigo,
                expirationMinutes
        );
    }

    private PasswordResetToken obtenerTokenActivo(String correo, String codigo) {
        if (correo == null || codigo == null || codigo.isBlank()) {
            throw new TokenVerificacionException("El codigo de recuperacion es invalido.");
        }

        String correoNormalizado = correo.trim().toLowerCase(Locale.ROOT);
        PasswordResetToken token = tokenRepository
                .findTopByUsuarioCorreoAndUsedAtIsNullOrderByCreatedAtDesc(correoNormalizado)
                .orElseThrow(() -> new TokenVerificacionException("El codigo de recuperacion es invalido o ya expiro."));

        LocalDateTime ahora = LocalDateTime.now();
        if (token.estaExpirado(ahora) || token.excedeIntentos(maxAttempts)) {
            token.marcarComoUsado(ahora);
            tokenRepository.save(token);
            throw new TokenVerificacionException("El codigo de recuperacion expiro. Solicita un nuevo codigo.");
        }

        if (!passwordEncoder.matches(codigo, token.getCodeHash())) {
            token.registrarIntentoFallido();
            if (token.excedeIntentos(maxAttempts)) {
                token.marcarComoUsado(ahora);
            }
            tokenRepository.save(token);
            throw new TokenVerificacionException(token.fueUsado()
                    ? "Se alcanzo el maximo de intentos. Solicita un nuevo codigo."
                    : "El codigo de recuperacion es incorrecto.");
        }

        return token;
    }

    private String generarCodigoNumerico() {
        return String.format("%06d", secureRandom.nextInt(1_000_000));
    }
}
