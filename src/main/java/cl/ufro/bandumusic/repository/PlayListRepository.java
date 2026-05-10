package cl.ufro.bandumusic.repository;

import cl.ufro.bandumusic.model.PlayList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlayListRepository extends JpaRepository<PlayList, String> {
}