package cl.ufro.bandumusic.service;

import cl.ufro.bandumusic.exception.CredencialesInvalidasException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class JwtService {

    private static final String HMAC_ALGORITHM = "HmacSHA256";

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${app.jwt.secret:bandumusic-dev-secret-change-me-please-2026}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-seconds:86400}")
    private long expirationSeconds;

    public String generarToken(String correo) {
        Instant ahora = Instant.now();

        Map<String, Object> header = Map.of(
                "alg", "HS256",
                "typ", "JWT"
        );

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("sub", correo);
        payload.put("iat", ahora.getEpochSecond());
        payload.put("exp", ahora.plusSeconds(expirationSeconds).getEpochSecond());

        String headerCodificado = codificarJson(header);
        String payloadCodificado = codificarJson(payload);
        String datosFirmados = headerCodificado + "." + payloadCodificado;
        return datosFirmados + "." + firmar(datosFirmados);
    }

    public String obtenerCorreo(String token) {
        Map<String, Object> payload = obtenerPayloadVerificado(token);
        Object subject = payload.get("sub");

        if (!(subject instanceof String correo) || correo.isBlank()) {
            throw new CredencialesInvalidasException("Token invalido.");
        }

        return correo;
    }

    public boolean esTokenValido(String token) {
        try {
            obtenerPayloadVerificado(token);
            return true;
        } catch (RuntimeException ex) {
            return false;
        }
    }

    private Map<String, Object> obtenerPayloadVerificado(String token) {
        String[] partes = token.split("\\.");
        if (partes.length != 3) {
            throw new CredencialesInvalidasException("Token invalido.");
        }

        String datosFirmados = partes[0] + "." + partes[1];
        String firmaEsperada = firmar(datosFirmados);

        if (!firmaEsperada.equals(partes[2])) {
            throw new CredencialesInvalidasException("Token invalido.");
        }

        try {
            byte[] payloadBytes = Base64.getUrlDecoder().decode(partes[1]);
            Map<String, Object> payload = objectMapper.readValue(payloadBytes, new TypeReference<Map<String, Object>>() {
            });

            Object expiracion = payload.get("exp");
            long exp = expiracion instanceof Number number ? number.longValue() : 0;
            if (exp < Instant.now().getEpochSecond()) {
                throw new CredencialesInvalidasException("Token expirado.");
            }

            return payload;
        } catch (CredencialesInvalidasException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new CredencialesInvalidasException("Token invalido.");
        }
    }

    private String codificarJson(Map<String, Object> valor) {
        try {
            return Base64.getUrlEncoder()
                    .withoutPadding()
                    .encodeToString(objectMapper.writeValueAsBytes(valor));
        } catch (Exception ex) {
            throw new IllegalStateException("No fue posible generar el token.", ex);
        }
    }

    private String firmar(String datos) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            mac.init(new SecretKeySpec(jwtSecret.getBytes(StandardCharsets.UTF_8), HMAC_ALGORITHM));
            return Base64.getUrlEncoder()
                    .withoutPadding()
                    .encodeToString(mac.doFinal(datos.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception ex) {
            throw new IllegalStateException("No fue posible firmar el token.", ex);
        }
    }
}
