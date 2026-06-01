package cl.ufro.bandumusic.repository;

import cl.ufro.bandumusic.model.PlayList;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlayListRepository extends JpaRepository<PlayList, String> {

    @Override
    @EntityGraph(attributePaths = {"contenidos", "contenidos.contenidoLocal"})
    Optional<PlayList> findById(String id);
}
