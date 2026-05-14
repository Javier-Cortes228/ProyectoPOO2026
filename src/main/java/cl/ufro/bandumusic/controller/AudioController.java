package cl.ufro.bandumusic.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/audio")
public class AudioController {

    @GetMapping("/{nombre}.mp3")
    public ResponseEntity<Resource> obtenerAudio(@PathVariable String nombre) {

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