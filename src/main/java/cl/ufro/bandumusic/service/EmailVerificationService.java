package cl.ufro.bandumusic.service;

import cl.ufro.bandumusic.exception.TokenVerificacionException;
import cl.ufro.bandumusic.model.EmailVerificationToken;
import cl.ufro.bandumusic.model.Usuario;
import cl.ufro.bandumusic.repository.EmailVerificationTokenRepository;
import cl.ufro.bandumusic.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Locale;
import java.util.UUID;

@Service
public class EmailVerificationService {

    private final EmailVerificationTokenRepository tokenRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final long codeExpirationMinutes;
    private final int maxAttempts;
    private final SecureRandom secureRandom = new SecureRandom();

    public EmailVerificationService(
            EmailVerificationTokenRepository tokenRepository,
            UsuarioRepository usuarioRepository,
            EmailService emailService,
            PasswordEncoder passwordEncoder,
            @Value("${app.email-verification.expiration-minutes:10}") long codeExpirationMinutes,
            @Value("${app.email-verification.max-attempts:5}") int maxAttempts
    ) {
        this.tokenRepository = tokenRepository;
        this.usuarioRepository = usuarioRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
        this.codeExpirationMinutes = codeExpirationMinutes;
        this.maxAttempts = maxAttempts;
    }

    @Transactional
    public void crearYEnviarCodigo(Usuario usuario) {
        if (usuario.isCorreoVerificado()) {
            return;
        }

        LocalDateTime ahora = LocalDateTime.now();
        tokenRepository.findByUsuarioAndUsedAtIsNull(usuario)
                .forEach(token -> token.marcarComoUsado(ahora));

        String codigo = generarCodigoNumerico();
        EmailVerificationToken verificationToken = new EmailVerificationToken(
                UUID.randomUUID().toString(),
                generarTokenSeguro(),
                passwordEncoder.encode(codigo),
                usuario,
                ahora,
                ahora.plusMinutes(codeExpirationMinutes)
        );
        tokenRepository.save(verificationToken);
        emailService.enviarCodigoVerificacion(
                usuario.getCorreo(),
                usuario.getNombreUsuario(),
                codigo,
                codeExpirationMinutes
        );
    }

    @Transactional
    public void verificarCodigo(String correo, String codigo) {
        String correoNormalizado = correo.trim().toLowerCase(Locale.ROOT);
        EmailVerificationToken verificationToken = tokenRepository
                .findTopByUsuarioCorreoAndUsedAtIsNullOrderByCreatedAtDesc(correoNormalizado)
                .orElseThrow(() -> new TokenVerificacionException("El codigo de verificacion es invalido o ya expiro."));

        LocalDateTime ahora = LocalDateTime.now();
        if (verificationToken.estaExpirado(ahora) || verificationToken.excedeIntentos(maxAttempts)) {
            verificationToken.marcarComoUsado(ahora);
            tokenRepository.save(verificationToken);
            throw new TokenVerificacionException("El codigo de verificacion expiro. Solicita un nuevo codigo.");
        }

        if (!passwordEncoder.matches(codigo, verificationToken.getCodeHash())) {
            verificationToken.registrarIntentoFallido();
            tokenRepository.save(verificationToken);
            throw new TokenVerificacionException("El codigo de verificacion es incorrecto.");
        }

        Usuario usuario = verificationToken.getUsuario();
        usuario.marcarCorreoComoVerificado();
        verificationToken.marcarComoUsado(ahora);
        usuarioRepository.save(usuario);
        tokenRepository.save(verificationToken);
    }

    @Transactional
    public void verificar(String token) {
        EmailVerificationToken verificationToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new TokenVerificacionException("El enlace de verificacion no existe."));

        LocalDateTime ahora = LocalDateTime.now();
        if (verificationToken.fueUsado() || verificationToken.estaExpirado(ahora)) {
            throw new TokenVerificacionException("El enlace de verificacion expiro o ya fue utilizado.");
        }

        Usuario usuario = verificationToken.getUsuario();
        usuario.marcarCorreoComoVerificado();
        verificationToken.marcarComoUsado(ahora);
        usuarioRepository.save(usuario);
        tokenRepository.save(verificationToken);
    }

    private String generarTokenSeguro() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String generarCodigoNumerico() {
        return String.format("%06d", secureRandom.nextInt(1_000_000));
    }
}
