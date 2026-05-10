package cl.ufro.bandumusic.repository;

import cl.ufro.bandumusic.model.ContenidoAudio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContenidoAudioRepository extends JpaRepository<ContenidoAudio, String> {
}