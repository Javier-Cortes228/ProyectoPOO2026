package cl.ufro.bandumusic.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RestablecerContrasenaRequest(
        @NotBlank(message = "El correo es obligatorio.")
        @Email(message = "El correo debe tener un formato valido.")
        @Size(max = 120, message = "El correo no puede superar 120 caracteres.")
        String correo,

        @NotBlank(message = "El codigo de recuperacion es obligatorio.")
        @Pattern(regexp = "\\d{6}", message = "El codigo debe tener 6 digitos numericos.")
        String codigo,

        @NotBlank(message = "La nueva contrasena es obligatoria.")
        @Size(min = 8, max = 72, message = "La nueva contrasena debe tener entre 8 y 72 caracteres.")
        String nuevaContrasena
) {
}
