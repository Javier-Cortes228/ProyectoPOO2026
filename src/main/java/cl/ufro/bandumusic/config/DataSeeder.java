package cl.ufro.bandumusic.config;

import cl.ufro.bandumusic.model.Cancion;
import cl.ufro.bandumusic.model.Podcast;
import cl.ufro.bandumusic.model.Usuario;
import cl.ufro.bandumusic.repository.ContenidoAudioRepository;
import cl.ufro.bandumusic.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

//esta clase servira para inyectar datos de prueba automaticamente, para asi poder probar nuestro programa

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private ContenidoAudioRepository contenidoAudioRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public void run(String... args) throws Exception {
        // Solo inyectamos los datos si el catálogo está vacío
        if (contenidoAudioRepository.count() == 0) {
            System.out.println("Base de datos vacía detectada. Sembrando catálogo inicial...");

            // El ID "c1" significa que el frontend buscará el archivo "c1.mp3"
            Cancion c1 = new Cancion("c1", "Aventura Espacial", 185, "Pixel Band", "Galaxia");
            Cancion c2 = new Cancion("c2", "Noches de Rock", 210, "Los Eléctricos", "Voltaje");
            Cancion c3 = new Cancion("c3", "Melodía Suave", 195, "Acoustic Soul", "Desconéctate");
            Cancion c4 = new Cancion("c4", "Bajo Intenso", 150, "DJ Electro", "Beats");

            // Creacion de podcast
            Podcast p1 = new Podcast("p1", "Programación en 10 min", 600, "Juan Coder", 1);
            Podcast p2 = new Podcast("p2", "Historia del Rock", 1200, "Profe Musical", 5);

            // Guardamos en la Base de Datos
            contenidoAudioRepository.save(c1);
            contenidoAudioRepository.save(c2);
            contenidoAudioRepository.save(c3);
            contenidoAudioRepository.save(c4);
            contenidoAudioRepository.save(p1);
            contenidoAudioRepository.save(p2);

            System.out.println("Catálogo musical sembrado con éxito.");
        }

        // Solo inyectamos usuarios si la tabla está vacía
        if (usuarioRepository.count() == 0) {
            System.out.println("Sembrando usuarios de prueba...");

            Usuario admin = new Usuario("u1", "ProfesorEvaluador", "profe@ufro.cl", "1234");
            Usuario test = new Usuario("u2", "UsuarioPrueba", "test@ufro.cl", "1234");

            usuarioRepository.save(admin);
            usuarioRepository.save(test);

            System.out.println("Usuarios de prueba sembrados con éxito.");
        }
    }
}