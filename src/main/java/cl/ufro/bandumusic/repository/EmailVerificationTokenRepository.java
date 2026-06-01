package cl.ufro.bandumusic.repository;

import cl.ufro.bandumusic.model.EmailVerificationToken;
import cl.ufro.bandumusic.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, String> {

    Optional<EmailVerificationToken> findByToken(String token);

    Optional<EmailVerificationToken> findTopByUsuarioCorreoAndUsedAtIsNullOrderByCreatedAtDesc(String correo);

    List<EmailVerificationToken> findByUsuarioAndUsedAtIsNull(Usuario usuario);
}
