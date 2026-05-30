package cl.ufro.bandumusic.repository;

import cl.ufro.bandumusic.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, String> {

    boolean existsByCorreo(String correo);

    @EntityGraph(attributePaths = "playlist")
    Optional<Usuario> findByCorreo(String correo);

    @EntityGraph(attributePaths = "playlist")
    Optional<Usuario> findWithPlaylistById(String id);
}
