package cl.ufro.bandumusic.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegistroUsuarioRequest(
        @NotBlank(message = "El nombre de usuario es obligatorio.")
        @Size(max = 60, message = "El nombre de usuario no puede superar 60 caracteres.")
        String nombreUsuario,

        @NotBlank(message = "El correo es obligatorio.")
        @Email(message = "El correo debe tener un formato valido.")
        @Size(max = 120, message = "El correo no puede superar 120 caracteres.")
        String correo,

        @NotBlank(message = "La contrasena es obligatoria.")
        @Size(min = 4, max = 72, message = "La contrasena debe tener entre 4 y 72 caracteres.")
        String contrasena
) {
}
