package cl.ufro.bandumusic.dto.response;

public record AuthResponse(
        String token,
        String tokenType,
        UsuarioResponse usuario
) {
    public static AuthResponse bearer(String token, UsuarioResponse usuario) {
        return new AuthResponse(token, "Bearer", usuario);
    }
}
