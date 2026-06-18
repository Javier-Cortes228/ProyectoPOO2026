package cl.ufro.bandumusic.repository;

import cl.ufro.bandumusic.model.PasswordResetToken;
import cl.ufro.bandumusic.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, String> {

    Optional<PasswordResetToken> findTopByUsuarioCorreoAndUsedAtIsNullOrderByCreatedAtDesc(String correo);

    List<PasswordResetToken> findByUsuarioAndUsedAtIsNull(Usuario usuario);
}
