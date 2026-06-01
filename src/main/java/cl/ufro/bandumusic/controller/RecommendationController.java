package cl.ufro.bandumusic.controller;

import cl.ufro.bandumusic.dto.response.ContenidoAudioResponse;
import cl.ufro.bandumusic.service.RecommendationService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/recomendaciones")
@Validated
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping
    public ResponseEntity<List<ContenidoAudioResponse>> recomendar(
            @RequestParam(defaultValue = "12")
            @Min(value = 1, message = "El limite minimo es 1.")
            @Max(value = 30, message = "El limite maximo es 30.")
            int limit,
            Authentication authentication
    ) {
        return ResponseEntity.ok(recommendationService.recomendarPara(authentication.getName(), limit));
    }
}
