package cl.ufro.bandumusic;

import cl.ufro.bandumusic.dto.request.JamendoPlaylistItemRequest;
import cl.ufro.bandumusic.model.PlayList;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class PlaylistJamendoTest {

    @Test
    void playlistAceptaContenidoJamendoSinArchivoLocal() {
        PlayList lista = new PlayList("p4", "Online");
        JamendoPlaylistItemRequest request = new JamendoPlaylistItemRequest(
                "j1",
                "Independent Song",
                180,
                "Jam Artist",
                "Jam Album",
                "rock",
                "https://cdn.example.test/image.jpg",
                "https://cdn.example.test/audio.mp3",
                "https://creativecommons.org/licenses/by-sa/3.0/",
                "https://www.jamendo.com/track/j1"
        );

        lista.agregarContenidoJamendo(request);

        assertEquals(1, lista.getContenidos().size());
        assertEquals("JAMENDO", lista.getContenidos().get(0).getOrigen().name());
        assertEquals("rock", lista.getContenidos().get(0).getGenero());
    }
}
