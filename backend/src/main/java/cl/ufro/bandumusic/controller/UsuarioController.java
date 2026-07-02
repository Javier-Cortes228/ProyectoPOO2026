package cl.ufro.bandumusic.controller;

import cl.ufro.bandumusic.config.AuthCookieProperties;
import cl.ufro.bandumusic.dto.request.LoginRequest;
import cl.ufro.bandumusic.dto.request.RecuperacionContrasenaRequest;
import cl.ufro.bandumusic.dto.request.RegistroUsuarioRequest;
import cl.ufro.bandumusic.dto.request.RestablecerContrasenaRequest;
import cl.ufro.bandumusic.dto.request.VerificacionCorreoRequest;
import cl.ufro.bandumusic.dto.request.VerificacionRecuperacionRequest;
import cl.ufro.bandumusic.dto.response.AuthResponse;
import cl.ufro.bandumusic.dto.response.MensajeResponse;
import cl.ufro.bandumusic.dto.response.UsuarioResponse;
import cl.ufro.bandumusic.model.Usuario;
import cl.ufro.bandumusic.service.JwtService;
import cl.ufro.bandumusic.service.UsuarioService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuarios")
@Validated
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final JwtService jwtService;
    private final AuthCookieProperties authCookieProperties;

    public UsuarioController(
            UsuarioService usuarioService,
            JwtService jwtService,
            AuthCookieProperties authCookieProperties
    ) {
        this.usuarioService = usuarioService;
        this.jwtService = jwtService;
        this.authCookieProperties = authCookieProperties;
    }

    @PostMapping("/registrar")
    public ResponseEntity<MensajeResponse> registrarUsuario(@Valid @RequestBody RegistroUsuarioRequest request) {
        usuarioService.registrar(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MensajeResponse("Cuenta creada. Enviamos un código de verificación a tu correo."));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginUsuario(@Valid @RequestBody LoginRequest request) {
        Usuario usuario = usuarioService.login(request);
        String token = jwtService.generarToken(usuario.getCorreo());
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, crearCookieAutenticacion(token).toString())
                .body(AuthResponse.cookie(UsuarioResponse.from(usuario)));
    }

    @PostMapping("/logout")
    public ResponseEntity<MensajeResponse> cerrarSesion() {
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, limpiarCookieAutenticacion().toString())
                .body(new MensajeResponse("Sesion cerrada correctamente."));
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioResponse> obtenerUsuarioActual(Authentication authentication) {
        Usuario usuario = usuarioService.obtenerPorCorreo(authentication.getName());
        return ResponseEntity.ok(UsuarioResponse.from(usuario));
    }

    @GetMapping("/verificar")
    public ResponseEntity<MensajeResponse> verificarCorreo(
            @RequestParam @NotBlank(message = "El token de verificacion es obligatorio.") String token
    ) {
        usuarioService.verificarCorreo(token);
        return ResponseEntity.ok(new MensajeResponse("Correo verificado correctamente. Ya puedes iniciar sesión."));
    }

    @PostMapping("/verificar-codigo")
    public ResponseEntity<MensajeResponse> verificarCodigoCorreo(
            @Valid @RequestBody VerificacionCorreoRequest request
    ) {
        usuarioService.verificarCodigoCorreo(request.correo(), request.codigo());
        return ResponseEntity.ok(new MensajeResponse("Correo verificado correctamente. Ya puedes iniciar sesión."));
    }

    @PostMapping("/reenviar-verificacion")
    public ResponseEntity<MensajeResponse> reenviarVerificacion(
            @RequestParam
            @NotBlank(message = "El correo es obligatorio.")
            @Email(message = "El correo debe tener un formato valido.")
            String correo
    ) {
        usuarioService.reenviarVerificacion(correo);
        return ResponseEntity.ok(new MensajeResponse("Se envió un nuevo código de verificación."));
    }

    @PostMapping("/recuperacion/solicitar")
    public ResponseEntity<MensajeResponse> solicitarRecuperacionContrasena(
            @Valid @RequestBody RecuperacionContrasenaRequest request
    ) {
        usuarioService.solicitarRecuperacionContrasena(request.correo());
        return ResponseEntity.ok(new MensajeResponse("Te enviamos un código de recuperacion, revisa tu correo."));
    }

    @PostMapping("/recuperacion/verificar")
    public ResponseEntity<MensajeResponse> verificarCodigoRecuperacion(
            @Valid @RequestBody VerificacionRecuperacionRequest request
    ) {
        usuarioService.verificarCodigoRecuperacion(request.correo(), request.codigo());
        return ResponseEntity.ok(new MensajeResponse("Código validado. Ahora puedes definir una nueva contraseña."));
    }

    @PostMapping("/recuperacion/restablecer")
    public ResponseEntity<MensajeResponse> restablecerContrasena(
            @Valid @RequestBody RestablecerContrasenaRequest request
    ) {
        usuarioService.restablecerContrasena(request.correo(), request.codigo(), request.nuevaContrasena());
        return ResponseEntity.ok(new MensajeResponse("Contraseña actualizada correctamente. Ya puedes iniciar sesión."));
    }

    private ResponseCookie crearCookieAutenticacion(String token) {
        return ResponseCookie.from(AuthCookieProperties.COOKIE_NAME, token)
                .httpOnly(true)
                .secure(authCookieProperties.isSecure())
                .sameSite(authCookieProperties.getSameSite())
                .path("/")
                .maxAge(authCookieProperties.getExpirationSeconds())
                .build();
    }

    private ResponseCookie limpiarCookieAutenticacion() {
        return ResponseCookie.from(AuthCookieProperties.COOKIE_NAME, "")
                .httpOnly(true)
                .secure(authCookieProperties.isSecure())
                .sameSite(authCookieProperties.getSameSite())
                .path("/")
                .maxAge(0)
                .build();
    }
}