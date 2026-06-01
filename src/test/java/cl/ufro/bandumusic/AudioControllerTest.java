package cl.ufro.bandumusic;

import cl.ufro.bandumusic.controller.AudioController;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AudioControllerTest {

    private final AudioController controller = new AudioController();

    @Test
    void rechazaNombreDeAudioInvalido() {
        var response = controller.obtenerAudio("..");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }
}
