package cl.ufro.bandumusic.controller;

import cl.ufro.bandumusic.dto.request.LoginRequest;
import cl.ufro.bandumusic.dto.request.RegistroUsuarioRequest;
import cl.ufro.bandumusic.dto.response.UsuarioResponse;
import cl.ufro.bandumusic.model.Usuario;
import cl.ufro.bandumusic.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/registrar")
    public ResponseEntity<UsuarioResponse> registrarUsuario(@Valid @RequestBody RegistroUsuarioRequest request) {
        Usuario usuarioGuardado = usuarioService.registrar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(UsuarioResponse.from(usuarioGuardado));
    }

    @PostMapping("/login")
    public ResponseEntity<UsuarioResponse> loginUsuario(@Valid @RequestBody LoginRequest request) {
        Usuario usuario = usuarioService.login(request);
        return ResponseEntity.ok(UsuarioResponse.from(usuario));
    }
}
