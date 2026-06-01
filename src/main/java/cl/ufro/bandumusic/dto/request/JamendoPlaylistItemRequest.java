package cl.ufro.bandumusic.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record JamendoPlaylistItemRequest(
        @NotBlank(message = "El id de Jamendo es obligatorio.")
        @Size(max = 120, message = "El id de Jamendo no puede superar 120 caracteres.")
        String id,

        @NotBlank(message = "El titulo es obligatorio.")
        @Size(max = 160, message = "El titulo no puede superar 160 caracteres.")
        String titulo,

        @PositiveOrZero(message = "La duracion no puede ser negativa.")
        int duracionSegundos,

        @Size(max = 160, message = "El artista no puede superar 160 caracteres.")
        String artista,

        @Size(max = 160, message = "El album no puede superar 160 caracteres.")
        String album,

        @Size(max = 100, message = "El genero no puede superar 100 caracteres.")
        String genero,

        @Size(max = 500, message = "La URL de imagen no puede superar 500 caracteres.")
        String imagenUrl,

        @NotBlank(message = "La URL de audio es obligatoria.")
        @Size(max = 500, message = "La URL de audio no puede superar 500 caracteres.")
        String audioUrl,

        @Size(max = 500, message = "La URL de licencia no puede superar 500 caracteres.")
        String licenciaUrl,

        @Size(max = 500, message = "La URL de Jamendo no puede superar 500 caracteres.")
        String jamendoUrl
) {
}
