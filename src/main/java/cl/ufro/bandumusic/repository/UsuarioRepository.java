package cl.ufro.bandumusic.repository;

import cl.ufro.bandumusic.model.Usuario;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, String> {

    boolean existsByCorreo(String correo);

    Optional<Usuario> findByCorreo(String correo);

    @EntityGraph(attributePaths = "playlist")
    @Query("select u from Usuario u where u.correo = :correo")
    Optional<Usuario> findWithPlaylistByCorreo(@Param("correo") String correo);

    @EntityGraph(attributePaths = "playlist")
    @Query("select u from Usuario u where u.id = :id")
    Optional<Usuario> findWithPlaylistById(@Param("id") String id);
}
