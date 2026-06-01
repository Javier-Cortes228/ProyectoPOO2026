package cl.ufro.bandumusic.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegistroUsuarioRequest(
        @NotBlank(message = "El nombre de usuario es obligatorio.")
        @Size(min = 3, max = 40, message = "El nombre de usuario debe tener entre 3 y 40 caracteres.")
        @Pattern(regexp = "^[A-Za-z0-9._-]+$", message = "El nombre de usuario solo puede usar letras, numeros, punto, guion y guion bajo.")
        String nombreUsuario,

        @NotBlank(message = "El correo es obligatorio.")
        @Email(message = "El correo debe tener un formato valido.")
        @Size(max = 120, message = "El correo no puede superar 120 caracteres.")
        String correo,

        @NotBlank(message = "La contrasena es obligatoria.")
        @Size(min = 8, max = 72, message = "La contrasena debe tener entre 8 y 72 caracteres.")
        String contrasena
) {
}
