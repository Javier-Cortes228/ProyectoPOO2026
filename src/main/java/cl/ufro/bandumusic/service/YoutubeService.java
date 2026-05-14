package cl.ufro.bandumusic.service;

import cl.ufro.bandumusic.dto.response.YoutubeVideoResponse;
import cl.ufro.bandumusic.exception.IntegracionExternaException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

@Service
public class YoutubeService {

    private static final String YOUTUBE_SEARCH_URL =
            "https://www.googleapis.com/youtube/v3/search";

    // Se crean manualmente, ya no se inyectan
    private final RestClient restClient = RestClient.create();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${youtube.api.key}")
    private String apiKey;

    @Value("${youtube.search.max-results}")
    private int maxResults;

    public List<YoutubeVideoResponse> buscarVideos(String consulta) {

        if (apiKey == null || apiKey.isBlank()) {
            throw new IntegracionExternaException(
                    "La API Key de YouTube no esta configurada."
            );
        }

        URI uri = UriComponentsBuilder
                .fromUriString(YOUTUBE_SEARCH_URL)
                .queryParam("part", "snippet")
                .queryParam("type", "video")
                .queryParam("maxResults", limitarResultados())
                .queryParam("q", consulta.trim())
                .queryParam("key", apiKey)
                .build()
                .encode()
                .toUri();

        try {

            String respuesta = restClient.get()
                    .uri(uri)
                    .retrieve()
                    .body(String.class);

            return mapearRespuesta(respuesta);

        } catch (Exception ex) {

            throw new IntegracionExternaException(
                    "No fue posible consultar YouTube en este momento.",
                    ex
            );
        }
    }

    private int limitarResultados() {
        return Math.max(1, Math.min(maxResults, 15));
    }

    private List<YoutubeVideoResponse> mapearRespuesta(String respuestaJson)
            throws Exception {

        JsonNode raiz = objectMapper.readTree(respuestaJson);

        JsonNode items = raiz.path("items");

        List<YoutubeVideoResponse> resultados = new ArrayList<>();

        for (JsonNode item : items) {

            String videoId = item.path("id")
                    .path("videoId")
                    .asText();

            JsonNode snippet = item.path("snippet");

            if (videoId == null || videoId.isBlank()) {
                continue;
            }

            resultados.add(
                    new YoutubeVideoResponse(
                            videoId,
                            snippet.path("title").asText(),
                            snippet.path("channelTitle").asText(),
                            snippet.path("description").asText(),
                            snippet.path("thumbnails")
                                    .path("medium")
                                    .path("url")
                                    .asText(),
                            "https://www.youtube.com/watch?v=" + videoId
                    )
            );
        }

        return resultados;
    }
}