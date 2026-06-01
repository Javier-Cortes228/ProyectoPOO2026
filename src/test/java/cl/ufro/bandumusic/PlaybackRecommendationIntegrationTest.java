package cl.ufro.bandumusic;

import cl.ufro.bandumusic.dto.request.PlaybackRequest;
import cl.ufro.bandumusic.model.PlaybackHistoryItem;
import cl.ufro.bandumusic.service.PlaybackHistoryService;
import cl.ufro.bandumusic.service.RecommendationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@ActiveProfiles("test")
class PlaybackRecommendationIntegrationTest {

    @Autowired
    private PlaybackHistoryService playbackHistoryService;

    @Autowired
    private RecommendationService recommendationService;

    @Test
    void registraHistorialLocalYGeneraRecomendaciones() {
        PlaybackHistoryItem item = playbackHistoryService.registrar(
                "admin@ufro.cl",
                new PlaybackRequest(
                        "c7",
                        "Energetic Happy & Upbeat Rock Music",
                        115,
                        "CANCION",
                        "RocknStock",
                        "Fire Within",
                        "",
                        "rock",
                        "",
                        "",
                        "",
                        "",
                        "LOCAL"
                )
        );

        var recomendaciones = recommendationService.recomendarPara("admin@ufro.cl", 6);

        assertNotNull(item.getId());
        assertFalse(playbackHistoryService.obtenerRecientes("admin@ufro.cl", 5).isEmpty());
        assertFalse(recomendaciones.isEmpty());
    }
}
