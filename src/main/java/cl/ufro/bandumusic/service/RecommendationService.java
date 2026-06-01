package cl.ufro.bandumusic.service;

import cl.ufro.bandumusic.dto.response.ContenidoAudioResponse;
import cl.ufro.bandumusic.model.ContenidoAudio;
import cl.ufro.bandumusic.model.PlaybackHistoryItem;
import cl.ufro.bandumusic.repository.ContenidoAudioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Set;

@Service
public class RecommendationService {

    private static final int HISTORY_LIMIT = 20;
    private static final int DEFAULT_LIMIT = 12;

    private final PlaybackHistoryService playbackHistoryService;
    private final ContenidoAudioRepository contenidoAudioRepository;

    public RecommendationService(
            PlaybackHistoryService playbackHistoryService,
            ContenidoAudioRepository contenidoAudioRepository
    ) {
        this.playbackHistoryService = playbackHistoryService;
        this.contenidoAudioRepository = contenidoAudioRepository;
    }

    @Transactional(readOnly = true)
    public List<ContenidoAudioResponse> recomendarPara(String correo, int limit) {
        int limiteSeguro = Math.max(1, Math.min(limit <= 0 ? DEFAULT_LIMIT : limit, 30));
        List<PlaybackHistoryItem> historial = playbackHistoryService.obtenerRecientes(correo, HISTORY_LIMIT);
        List<ContenidoAudio> catalogo = contenidoAudioRepository.findAll();

        Set<String> idsEscuchados = historial.stream()
                .map(PlaybackHistoryItem::getContenidoId)
                .filter(Objects::nonNull)
                .collect(LinkedHashSet::new, LinkedHashSet::add, LinkedHashSet::addAll);

        Set<String> creadores = historial.stream()
                .map(PlaybackHistoryService::creadorDe)
                .filter(RecommendationService::tieneTexto)
                .map(RecommendationService::normalizar)
                .collect(LinkedHashSet::new, LinkedHashSet::add, LinkedHashSet::addAll);

        Set<String> generos = historial.stream()
                .map(PlaybackHistoryItem::getGenero)
                .filter(RecommendationService::tieneTexto)
                .map(RecommendationService::normalizar)
                .collect(LinkedHashSet::new, LinkedHashSet::add, LinkedHashSet::addAll);

        List<ContenidoAudioResponse> recomendadas = catalogo.stream()
                .filter(audio -> !idsEscuchados.contains(audio.getId()))
                .filter(audio -> coincidePorCreador(audio, creadores) || coincidePorGenero(audio, generos))
                .limit(limiteSeguro)
                .map(ContenidoAudioResponse::from)
                .toList();

        if (!recomendadas.isEmpty()) {
            return recomendadas;
        }

        return catalogo.stream()
                .filter(audio -> !idsEscuchados.contains(audio.getId()))
                .limit(limiteSeguro)
                .map(ContenidoAudioResponse::from)
                .toList();
    }

    private static boolean coincidePorCreador(ContenidoAudio audio, Set<String> creadores) {
        String creador = PlaybackHistoryService.creadorDe(audio);
        return tieneTexto(creador) && creadores.contains(normalizar(creador));
    }

    private static boolean coincidePorGenero(ContenidoAudio audio, Set<String> generos) {
        String genero = PlaybackHistoryService.generoDe(audio);
        return tieneTexto(genero) && generos.contains(normalizar(genero));
    }

    private static boolean tieneTexto(String valor) {
        return valor != null && !valor.isBlank();
    }

    private static String normalizar(String valor) {
        return valor.trim().toLowerCase(Locale.ROOT);
    }
}
