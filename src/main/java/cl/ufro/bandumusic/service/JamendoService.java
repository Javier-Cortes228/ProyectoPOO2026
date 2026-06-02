package cl.ufro.bandumusic.service;

import cl.ufro.bandumusic.dto.response.JamendoTrackResponse;
import cl.ufro.bandumusic.exception.IntegracionExternaException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Service
public class JamendoService {

    private static final String JAMENDO_TRACKS_URL = "https://api.jamendo.com/v3.0/tracks/";

    private final RestClient restClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public JamendoService() {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout((int) Duration.ofSeconds(5).toMillis());
        requestFactory.setReadTimeout((int) Duration.ofSeconds(5).toMillis());

        this.restClient = RestClient.builder()
                .requestFactory(requestFactory)
                .build();
    }

    @Value("${jamendo.client-id:}")
    private String clientId;

    @Value("${jamendo.search.max-results:12}")
    private int maxResults;

    public List<JamendoTrackResponse> buscarTracks(String consulta) {
        return buscarTracks(consulta, maxResults, 0);
    }

    public List<JamendoTrackResponse> buscarTracks(String consulta, int limit, int offset) {
        if (clientId == null || clientId.isBlank()) {
            throw new IntegracionExternaException("El Client ID de Jamendo no esta configurado.");
        }

        if (consulta == null || consulta.trim().isEmpty()) {
            throw new IllegalArgumentException("La busqueda de Jamendo es obligatoria.");
        }

        URI uri = UriComponentsBuilder
                .fromUriString(JAMENDO_TRACKS_URL)
                .queryParam("client_id", clientId)
                .queryParam("format", "json")
                .queryParam("limit", limitarResultados(limit))
                .queryParam("offset", normalizarOffset(offset))
                .queryParam("search", consulta.trim())
                .queryParam("include", "musicinfo")
                .queryParam("audioformat", "mp31")
                .queryParam("imagesize", "300")
                .queryParam("type", "single albumtrack")
                .queryParam("order", "relevance")
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
            throw new IntegracionExternaException("No fue posible consultar Jamendo en este momento.", ex);
        }
    }

    private int limitarResultados(int limit) {
        return Math.max(1, Math.min(limit, 200));
    }

    private int normalizarOffset(int offset) {
        return Math.max(0, offset);
    }

    private List<JamendoTrackResponse> mapearRespuesta(String respuestaJson) throws Exception {
        JsonNode raiz = objectMapper.readTree(respuestaJson);
        JsonNode resultadosJson = raiz.path("results");

        List<JamendoTrackResponse> resultados = new ArrayList<>();

        for (JsonNode track : resultadosJson) {
            String id = track.path("id").asText();
            String audioUrl = track.path("audio").asText();

            if (id.isBlank() || audioUrl.isBlank()) {
                continue;
            }

            resultados.add(new JamendoTrackResponse(
                    id,
                    track.path("name").asText(),
                    track.path("duration").asInt(),
                    track.path("artist_name").asText(),
                    track.path("album_name").asText(),
                    extraerGenero(track),
                    track.path("image").asText(),
                    audioUrl,
                    track.path("license_ccurl").asText(),
                    track.path("shareurl").asText(),
                    "JAMENDO"
            ));
        }

        return resultados;
    }

    private String extraerGenero(JsonNode track) {
        JsonNode generos = track.path("musicinfo").path("tags").path("genres");
        if (generos.isArray() && !generos.isEmpty()) {
            return generos.get(0).asText();
        }
        return null;
    }
}
