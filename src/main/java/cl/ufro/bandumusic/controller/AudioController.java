package cl.ufro.bandumusic.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.regex.Pattern;

@RestController
@RequestMapping("/audio")
public class AudioController {

    private static final Pattern AUDIO_NAME_PATTERN = Pattern.compile("^[A-Za-z0-9_-]{1,80}$");

    @GetMapping("/{nombre}.mp3")
    public ResponseEntity<Resource> obtenerAudio(@PathVariable String nombre) {
        if (nombre == null || !AUDIO_NAME_PATTERN.matcher(nombre).matches()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        try {
            Resource recurso = new ClassPathResource("static/audio/" + nombre + ".mp3");

            if (!recurso.exists()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .header("Content-Type", "audio/mpeg")
                    .body(recurso);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
