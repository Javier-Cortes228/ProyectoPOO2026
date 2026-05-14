package cl.ufro.bandumusic.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @NotBlank(message = "El correo es obligatorio.")
        @Email(message = "El correo debe tener un formato valido.")
        String correo,

        @NotBlank(message = "La contrasena es obligatoria.")
        @Size(max = 72, message = "La contrasena no puede superar 72 caracteres.")
        String contrasena
) {
}
