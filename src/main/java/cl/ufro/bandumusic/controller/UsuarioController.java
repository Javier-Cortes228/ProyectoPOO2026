package cl.ufro.bandumusic.controller;

import cl.ufro.bandumusic.dto.request.LoginRequest;
import cl.ufro.bandumusic.dto.request.RegistroUsuarioRequest;
import cl.ufro.bandumusic.dto.response.AuthResponse;
import cl.ufro.bandumusic.dto.response.UsuarioResponse;
import cl.ufro.bandumusic.model.Usuario;
import cl.ufro.bandumusic.service.JwtService;
import cl.ufro.bandumusic.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final JwtService jwtService;

    public UsuarioController(UsuarioService usuarioService, JwtService jwtService) {
        this.usuarioService = usuarioService;
        this.jwtService = jwtService;
    }

    @PostMapping("/registrar")
    public ResponseEntity<AuthResponse> registrarUsuario(@Valid @RequestBody RegistroUsuarioRequest request) {
        Usuario usuarioGuardado = usuarioService.registrar(request);
        String token = jwtService.generarToken(usuarioGuardado.getCorreo());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(AuthResponse.bearer(token, UsuarioResponse.from(usuarioGuardado)));
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
}
