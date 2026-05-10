package cl.ufro.bandumusic.config;

import cl.ufro.bandumusic.model.Cancion;
import cl.ufro.bandumusic.model.Podcast;
import cl.ufro.bandumusic.model.Usuario;
import cl.ufro.bandumusic.repository.ContenidoAudioRepository;
import cl.ufro.bandumusic.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private ContenidoAudioRepository contenidoAudioRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public void run(String... args) throws Exception {
        if (contenidoAudioRepository.count() == 0) {
            System.out.println("Sembrando catálogo de prueba...");

            // 10 Canciones de prueba
            for (int i = 1; i <= 10; i++) {
                contenidoAudioRepository.save(new Cancion("c" + i, "Canción Prueba " + i, 180, "Artista " + i, "Álbum " + i));
            }

            // 3 Podcasts de prueba
            for (int i = 1; i <= 3; i++) {
                contenidoAudioRepository.save(new Podcast("p" + i, "Podcast Prueba " + i, 600, "Locutor " + i, i));
            }
            System.out.println("Catálogo de prueba sembrado.");
        }

        if (usuarioRepository.count() == 0) {
            usuarioRepository.save(new Usuario("u1", "Admin", "admin@ufro.cl", "1234"));
            usuarioRepository.save(new Usuario("u2", "Test", "test@ufro.cl", "1234"));
            System.out.println("Usuarios de prueba sembrados.");
        }
    }
}