package cl.ufro.bandumusic.service;

import cl.ufro.bandumusic.dto.request.LoginRequest;
import cl.ufro.bandumusic.dto.request.RegistroUsuarioRequest;
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

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Usuario registrar(RegistroUsuarioRequest request) {
        String correoNormalizado = normalizarCorreo(request.correo());

        if (usuarioRepository.existsByCorreo(correoNormalizado)) {
            throw new UsuarioDuplicadoException("El correo " + correoNormalizado + " ya esta registrado.");
        }

        Usuario usuario = new Usuario(
                UUID.randomUUID().toString(),
                request.nombreUsuario().trim(),
                correoNormalizado,
                passwordEncoder.encode(request.contrasena())
        );

        return usuarioRepository.save(usuario);
    }

    @Transactional
    public Usuario login(LoginRequest request) {
        String correoNormalizado = normalizarCorreo(request.correo());
        Usuario usuario = usuarioRepository.findByCorreo(correoNormalizado)
                .orElseThrow(() -> new CredencialesInvalidasException("Credenciales incorrectas."));

        if (passwordEncoder.matches(request.contrasena(), usuario.getContrasena())) {
            return usuario;
        }

        // Compatibilidad: permite iniciar sesion con usuarios antiguos y migra su contrasena a BCrypt.
        if (!esHashBCrypt(usuario.getContrasena()) && usuario.verificarCredenciales(correoNormalizado, request.contrasena())) {
            usuario.setContrasena(passwordEncoder.encode(request.contrasena()));
            return usuarioRepository.save(usuario);
        }

        throw new CredencialesInvalidasException("Credenciales incorrectas.");
    }

    private String normalizarCorreo(String correo) {
        return correo.trim().toLowerCase(Locale.ROOT);
    }

    private boolean esHashBCrypt(String contrasenaGuardada) {
        return contrasenaGuardada != null && contrasenaGuardada.matches("^\\$2[aby]\\$.{56}$");
    }
}
