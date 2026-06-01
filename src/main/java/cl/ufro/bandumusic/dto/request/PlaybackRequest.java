package cl.ufro.bandumusic.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record PlaybackRequest(
        @NotBlank(message = "El id del contenido es obligatorio.")
        @Size(max = 120, message = "El id del contenido no puede superar 120 caracteres.")
        String id,

        @NotBlank(message = "El titulo es obligatorio.")
        @Size(max = 160, message = "El titulo no puede superar 160 caracteres.")
        String titulo,

        @PositiveOrZero(message = "La duracion no puede ser negativa.")
        int duracionSegundos,

        @Size(max = 40, message = "El tipo no puede superar 40 caracteres.")
        String tipo,

        @Size(max = 160, message = "El artista no puede superar 160 caracteres.")
        String artista,

        @Size(max = 160, message = "El album no puede superar 160 caracteres.")
        String album,

        @Size(max = 160, message = "El anfitrion no puede superar 160 caracteres.")
        String anfitrion,

        @Size(max = 100, message = "El genero no puede superar 100 caracteres.")
        String genero,

        @Size(max = 500, message = "La URL de imagen no puede superar 500 caracteres.")
        String imagenUrl,

        @Size(max = 500, message = "La URL de audio no puede superar 500 caracteres.")
        String audioUrl,

        @Size(max = 500, message = "La URL de licencia no puede superar 500 caracteres.")
        String licenciaUrl,

        @Size(max = 500, message = "La URL de Jamendo no puede superar 500 caracteres.")
        String jamendoUrl,

        @NotBlank(message = "La fuente es obligatoria.")
        @Size(max = 20, message = "La fuente no puede superar 20 caracteres.")
        String fuente
) {
}
