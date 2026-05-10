package cl.ufro.bandumusic.repository;

import cl.ufro.bandumusic.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, String> {

    boolean existsByCorreo(String correo);
    Usuario findByCorreo(String correo);
}