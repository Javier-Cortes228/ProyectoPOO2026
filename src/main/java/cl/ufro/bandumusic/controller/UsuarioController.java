package cl.ufro.bandumusic.controller;

import cl.ufro.bandumusic.dto.request.LoginRequest;
import cl.ufro.bandumusic.dto.request.RegistroUsuarioRequest;
import cl.ufro.bandumusic.dto.request.VerificacionCorreoRequest;
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

    public UsuarioController(UsuarioService usuarioService, JwtService jwtService) {
        this.usuarioService = usuarioService;
        this.jwtService = jwtService;
    }

    @PostMapping("/registrar")
    public ResponseEntity<MensajeResponse> registrarUsuario(@Valid @RequestBody RegistroUsuarioRequest request) {
        usuarioService.registrar(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MensajeResponse("Cuenta creada. Enviamos un codigo de verificacion a tu correo."));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginUsuario(@Valid @RequestBody LoginRequest request) {
        Usuario usuario = usuarioService.login(request);
        String token = jwtService.generarToken(usuario.getCorreo());
        return ResponseEntity.ok(AuthResponse.bearer(token, UsuarioResponse.from(usuario)));
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
        return ResponseEntity.ok(new MensajeResponse("Correo verificado correctamente. Ya puedes iniciar sesion."));
    }

    @PostMapping("/verificar-codigo")
    public ResponseEntity<MensajeResponse> verificarCodigoCorreo(
            @Valid @RequestBody VerificacionCorreoRequest request
    ) {
        usuarioService.verificarCodigoCorreo(request.correo(), request.codigo());
        return ResponseEntity.ok(new MensajeResponse("Correo verificado correctamente. Ya puedes iniciar sesion."));
    }

    @PostMapping("/reenviar-verificacion")
    public ResponseEntity<MensajeResponse> reenviarVerificacion(
            @RequestParam
            @NotBlank(message = "El correo es obligatorio.")
            @Email(message = "El correo debe tener un formato valido.")
            String correo
    ) {
        usuarioService.reenviarVerificacion(correo);
        return ResponseEntity.ok(new MensajeResponse("Si la cuenta existe y aun no esta verificada, se envio un nuevo codigo."));
    }
}
