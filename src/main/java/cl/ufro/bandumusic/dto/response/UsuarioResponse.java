package cl.ufro.bandumusic.dto.response;

import cl.ufro.bandumusic.model.Usuario;

import java.util.List;

public record UsuarioResponse(
        String id,
        String nombreUsuario,
        String correo,
        List<PlayListResponse> playlist
) {

    public static UsuarioResponse from(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNombreUsuario(),
                usuario.getCorreo(),
                usuario.getPlaylist().stream()
                        .map(PlayListResponse::from)
                        .toList()
        );
    }
}
