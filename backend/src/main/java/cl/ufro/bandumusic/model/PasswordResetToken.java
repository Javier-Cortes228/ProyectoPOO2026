package cl.ufro.bandumusic.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

import java.time.LocalDateTime;

@Entity
public class PasswordResetToken {

    @Id
    private String id;

    @Column(nullable = false, length = 120)
    private String codeHash;

    @ManyToOne(optional = false)
    private Usuario usuario;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    private LocalDateTime verifiedAt;

    private LocalDateTime usedAt;

    @Column(columnDefinition = "integer default 0")
    private int attempts;

    protected PasswordResetToken() {
    }

    public PasswordResetToken(
            String id,
            String codeHash,
            Usuario usuario,
            LocalDateTime createdAt,
            LocalDateTime expiresAt
    ) {
        this.id = id;
        this.codeHash = codeHash;
        this.usuario = usuario;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
        this.attempts = 0;
    }

    public boolean estaExpirado(LocalDateTime ahora) {
        return !expiresAt.isAfter(ahora);
    }

    public boolean fueUsado() {
        return usedAt != null;
    }

    public boolean fueVerificado() {
        return verifiedAt != null;
    }

    public void marcarComoVerificado(LocalDateTime ahora) {
        this.verifiedAt = ahora;
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

    public LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public LocalDateTime getUsedAt() {
        return usedAt;
    }

    public int getAttempts() {
        return attempts;
    }
}
