package cl.ufro.bandumusic.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

import java.time.LocalDateTime;

@Entity
public class EmailVerificationToken {

    @Id
    private String id;

    @Column(nullable = false, unique = true, length = 120)
    private String token;

    @Column(length = 120)
    private String codeHash;

    @ManyToOne(optional = false)
    private Usuario usuario;

    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    private LocalDateTime usedAt;

    @Column(columnDefinition = "integer default 0")
    private int attempts;

    protected EmailVerificationToken() {
    }

    public EmailVerificationToken(
            String id,
            String token,
            String codeHash,
            Usuario usuario,
            LocalDateTime createdAt,
            LocalDateTime expiresAt
    ) {
        this.id = id;
        this.token = token;
        this.codeHash = codeHash;
        this.usuario = usuario;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
        this.attempts = 0;
    }

    public boolean estaExpirado(LocalDateTime ahora) {
        return expiresAt.isBefore(ahora);
    }

    public boolean fueUsado() {
        return usedAt != null;
    }

    public void marcarComoUsado(LocalDateTime ahora) {
        this.usedAt = ahora;
    }

    public void registrarIntentoFallido() {
        this.attempts++;
    }

    public boolean excedeIntentos(int maxAttempts) {
        return attempts >= maxAttempts;
    }

    public String getId() {
        return id;
    }

    public String getToken() {
        return token;
    }

    public String getCodeHash() {
        return codeHash;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public LocalDateTime getUsedAt() {
        return usedAt;
    }

    public int getAttempts() {
        return attempts;
    }
}
