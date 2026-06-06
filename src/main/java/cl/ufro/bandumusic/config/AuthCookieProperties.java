package cl.ufro.bandumusic.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AuthCookieProperties {

    public static final String COOKIE_NAME = "bandumusic_auth";

    private final boolean secure;
    private final String sameSite;
    private final long expirationSeconds;

    public AuthCookieProperties(
            @Value("${app.auth.cookie.secure:false}") boolean secure,
            @Value("${app.auth.cookie.same-site:Lax}") String sameSite,
            @Value("${app.jwt.expiration-seconds:86400}") long expirationSeconds
    ) {
        this.secure = secure;
        this.sameSite = normalizarSameSite(sameSite);
        this.expirationSeconds = Math.max(60, expirationSeconds);
    }

    public boolean isSecure() {
        return secure;
    }

    public String getSameSite() {
        return sameSite;
    }

    public long getExpirationSeconds() {
        return expirationSeconds;
    }

    private String normalizarSameSite(String valor) {
        if ("Strict".equalsIgnoreCase(valor)) {
            return "Strict";
        }
        if ("None".equalsIgnoreCase(valor)) {
            return "None";
        }
        return "Lax";
    }
}
