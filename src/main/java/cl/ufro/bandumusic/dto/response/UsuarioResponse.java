package cl.ufro.bandumusic.dto.response;

import cl.ufro.bandumusic.model.Usuario;

public record UsuarioResponse(
        String id,
        String nombreUsuario,
        String correo
) {

    public static UsuarioResponse from(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNombreUsuario(),
                usuario.getCorreo()
        );
    }
}