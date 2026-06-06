package cl.ufro.bandumusic.service;

import cl.ufro.bandumusic.dto.response.ContenidoAudioResponse;
import cl.ufro.bandumusic.dto.response.JamendoTrackResponse;
import cl.ufro.bandumusic.model.ContenidoAudio;
import cl.ufro.bandumusic.model.PlaybackHistoryItem;
import cl.ufro.bandumusic.repository.ContenidoAudioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Set;

@Service
public class RecommendationService {

    private static final Logger LOGGER = LoggerFactory.getLogger(RecommendationService.class);
    private static final int HISTORY_LIMIT = 20;
    private static final int DEFAULT_LIMIT = 12;
    private static final int JAMENDO_LIMIT_PER_QUERY = 6;

    private final PlaybackHistoryService playbackHistoryService;
    private final ContenidoAudioRepository contenidoAudioRepository;
    private final JamendoService jamendoService;

    public RecommendationService(
            PlaybackHistoryService playbackHistoryService,
            ContenidoAudioRepository contenidoAudioRepository,
            JamendoService jamendoService
    ) {
        this.playbackHistoryService = playbackHistoryService;
        this.contenidoAudioRepository = contenidoAudioRepository;
        this.jamendoService = jamendoService;
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

        List<ContenidoAudioResponse> locales = catalogo.stream()
                .filter(audio -> !idsEscuchados.contains(audio.getId()))
                .filter(audio -> coincidePorCreador(audio, creadores) || coincidePorGenero(audio, generos))
                .limit(limiteSeguro)
                .map(ContenidoAudioResponse::from)
                .toList();

        if (locales.isEmpty()) {
            locales = catalogo.stream()
                    .filter(audio -> !idsEscuchados.contains(audio.getId()))
                    .limit(limiteSeguro)
                    .map(ContenidoAudioResponse::from)
                    .toList();
        }

        List<ContenidoAudioResponse> online = recomendarJamendo(creadores, generos, idsEscuchados, limiteSeguro);
        return mezclar(locales, online, limiteSeguro);
    }

    private List<ContenidoAudioResponse> recomendarJamendo(
            Set<String> creadores,
            Set<String> generos,
            Set<String> idsEscuchados,
            int limiteSeguro
    ) {
        if (!jamendoService.estaConfigurado()) {
            return List.of();
        }

        List<String> consultas = new ArrayList<>();
        consultas.addAll(generos.stream().limit(3).toList());
        consultas.addAll(creadores.stream().limit(2).toList());

        if (consultas.isEmpty()) {
            consultas.add("rock");
            consultas.add("electronic");
        }

        LinkedHashSet<String> idsAgregados = new LinkedHashSet<>();
        List<ContenidoAudioResponse> resultados = new ArrayList<>();

        for (String consulta : consultas) {
            if (resultados.size() >= limiteSeguro) {
                break;
            }

            try {
                List<JamendoTrackResponse> tracks = jamendoService.buscarTracks(consulta, JAMENDO_LIMIT_PER_QUERY, 0);
                for (JamendoTrackResponse track : tracks) {
                    if (idsEscuchados.contains(track.id()) || !idsAgregados.add(track.id())) {
                        continue;
                    }
                    resultados.add(ContenidoAudioResponse.from(track));
                    if (resultados.size() >= limiteSeguro) {
                        break;
                    }
                }
            } catch (RuntimeException ex) {
                LOGGER.warn("No fue posible obtener recomendaciones Jamendo para '{}': {}", consulta, ex.getMessage());
            }
        }

        return resultados;
    }

    private List<ContenidoAudioResponse> mezclar(
            List<ContenidoAudioResponse> locales,
            List<ContenidoAudioResponse> online,
            int limite
    ) {
        List<ContenidoAudioResponse> mezcla = new ArrayList<>();
        int localIndex = 0;
        int onlineIndex = 0;

        while (mezcla.size() < limite && (localIndex < locales.size() || onlineIndex < online.size())) {
            if (localIndex < locales.size()) {
                mezcla.add(locales.get(localIndex++));
            }
            if (mezcla.size() < limite && onlineIndex < online.size()) {
                mezcla.add(online.get(onlineIndex++));
            }
        }

        return mezcla;
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
