package cl.ufro.bandumusic.controller;

import cl.ufro.bandumusic.exception.UsuarioDuplicadoException;
import cl.ufro.bandumusic.model.Usuario;
import cl.ufro.bandumusic.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/usuarios") // Esta es la URL a la que llamará el Frontend
@CrossOrigin(origins = "*") // Permite que el frontend se conecte sin bloqueos de seguridad
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    //Metodo para registrar un nuevo Usuario
    @PostMapping("/registrar")
    public ResponseEntity<?> registrarUsuario(@RequestBody Usuario nuevoUsuario) {

        if (usuarioRepository.existsByCorreo(nuevoUsuario.getCorreo())) {
            throw new UsuarioDuplicadoException("El correo " + nuevoUsuario.getCorreo() + " ya está registrado.");
        }

        nuevoUsuario.setId(UUID.randomUUID().toString());
        Usuario usuarioGuardado = usuarioRepository.save(nuevoUsuario);

        return ResponseEntity.ok(usuarioGuardado);
    }

    //Metodo para el Login
    @PostMapping("/login")
    public ResponseEntity<?> loginUsuario(@RequestBody Usuario credenciales) {

        Usuario usuarioEnBaseDatos = usuarioRepository.findByCorreo(credenciales.getCorreo());

        if (usuarioEnBaseDatos != null && usuarioEnBaseDatos.verificarCredenciales(credenciales.getCorreo(), credenciales.getContrasena())) {
            return ResponseEntity.ok(usuarioEnBaseDatos);
        } else {
            return ResponseEntity.status(401).body("Credenciales incorrectas");
        }
    }
}