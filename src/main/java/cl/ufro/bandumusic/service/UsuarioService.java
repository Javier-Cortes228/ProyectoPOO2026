package cl.ufro.bandumusic.service;

import cl.ufro.bandumusic.dto.request.LoginRequest;
import cl.ufro.bandumusic.dto.request.RegistroUsuarioRequest;
import cl.ufro.bandumusic.exception.CorreoNoVerificadoException;
import cl.ufro.bandumusic.exception.CredencialesInvalidasException;
import cl.ufro.bandumusic.exception.UsuarioDuplicadoException;
import cl.ufro.bandumusic.model.Usuario;
import cl.ufro.bandumusic.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.UUID;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailVerificationService emailVerificationService;
    private final EmailAddressValidator emailAddressValidator;
    private final UserInputValidator userInputValidator;

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            EmailVerificationService emailVerificationService,
            EmailAddressValidator emailAddressValidator,
            UserInputValidator userInputValidator
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailVerificationService = emailVerificationService;
        this.emailAddressValidator = emailAddressValidator;
        this.userInputValidator = userInputValidator;
    }

    @Transactional
    public Usuario registrar(RegistroUsuarioRequest request) {
        String nombreUsuario = userInputValidator.validarNombreUsuario(request.nombreUsuario());
        userInputValidator.validarContrasena(request.contrasena());
        String correoNormalizado = emailAddressValidator.validarYNormalizar(request.correo());

        if (usuarioRepository.existsByCorreo(correoNormalizado)) {
            throw new UsuarioDuplicadoException("El correo " + correoNormalizado + " ya esta registrado.");
        }

        Usuario usuario = new Usuario(
                UUID.randomUUID().toString(),
                nombreUsuario,
                correoNormalizado,
                passwordEncoder.encode(request.contrasena())
        );

        Usuario usuarioGuardado = usuarioRepository.save(usuario);
        emailVerificationService.crearYEnviarCodigo(usuarioGuardado);
        cargarPlaylists(usuarioGuardado);
        return usuarioGuardado;
    }

    @Transactional
    public Usuario login(LoginRequest request) {
        String correoNormalizado = normalizarCorreo(request.correo());
        Usuario usuario = obtenerPorCorreo(correoNormalizado);

        if (passwordEncoder.matches(request.contrasena(), usuario.getContrasena())) {
            validarCorreoVerificado(usuario);
            cargarPlaylists(usuario);
            return usuario;
        }

        // Compatibilidad: permite iniciar sesion con usuarios antiguos y migra su contrasena a BCrypt.
        if (!esHashBCrypt(usuario.getContrasena()) && usuario.verificarCredenciales(correoNormalizado, request.contrasena())) {
            validarCorreoVerificado(usuario);
            usuario.setContrasena(passwordEncoder.encode(request.contrasena()));
            Usuario usuarioMigrado = usuarioRepository.save(usuario);
            cargarPlaylists(usuarioMigrado);
            return usuarioMigrado;
        }

        throw new CredencialesInvalidasException("Credenciales incorrectas.");
    }

    @Transactional
    public void reenviarVerificacion(String correo) {
        String correoNormalizado = emailAddressValidator.validarYNormalizar(correo);
        usuarioRepository.findByCorreo(correoNormalizado)
                .ifPresent(emailVerificationService::crearYEnviarCodigo);
    }

    @Transactional
    public void verificarCorreo(String token) {
        emailVerificationService.verificar(token);
    }

    @Transactional
    public void verificarCodigoCorreo(String correo, String codigo) {
        emailVerificationService.verificarCodigo(correo, codigo);
    }

    @Transactional(readOnly = true)
    public Usuario obtenerPorCorreo(String correo) {
        String correoNormalizado = normalizarCorreo(correo);
        Usuario usuario = usuarioRepository.findWithPlaylistByCorreo(correoNormalizado)
                .orElseThrow(() -> new CredencialesInvalidasException("Credenciales incorrectas."));
        cargarPlaylists(usuario);
        return usuario;
    }

    private String normalizarCorreo(String correo) {
        return correo.trim().toLowerCase(Locale.ROOT);
    }

    private void validarCorreoVerificado(Usuario usuario) {
        if (!usuario.isCorreoVerificado()) {
            throw new CorreoNoVerificadoException("Debes verificar tu correo antes de iniciar sesion.");
        }
    }

    private boolean esHashBCrypt(String contrasenaGuardada) {
        return contrasenaGuardada != null && contrasenaGuardada.matches("^\\$2[aby]\\$.{56}$");
    }

    private void cargarPlaylists(Usuario usuario) {
        usuario.getPlaylist().forEach(playlist -> playlist.getContenidos().size());
    }
}
