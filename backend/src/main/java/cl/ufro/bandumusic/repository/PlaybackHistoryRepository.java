package cl.ufro.bandumusic.repository;

import cl.ufro.bandumusic.model.PlaybackHistoryItem;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlaybackHistoryRepository extends JpaRepository<PlaybackHistoryItem, String> {

    List<PlaybackHistoryItem> findByUsuarioCorreoOrderByReproducidoEnDesc(String correo, Pageable pageable);

    long deleteByUsuarioCorreo(String correo);

    long countByUsuarioCorreo(String correo);
}
