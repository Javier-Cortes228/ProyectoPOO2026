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
        // Solo inyectamos los datos si el catálogo está vacío
        if (contenidoAudioRepository.count() == 0) {
            System.out.println("Base de datos vacía detectada. Sembrando catálogo final de 70 pistas...");
            cargarCanciones();
            cargarPodcasts();
            System.out.println("Catálogo musical sembrado con éxito.");
        }

        // Solo inyectamos usuarios si la tabla está vacía
        if (usuarioRepository.count() == 0) {
            System.out.println("Sembrando usuarios por defecto...");
            usuarioRepository.save(new Usuario("u1", "Admin", "admin@ufro.cl", "1234"));
            usuarioRepository.save(new Usuario("u2", "Test", "test@ufro.cl", "1234"));
            System.out.println("Usuarios listos.");
        }
    }

    private void cargarCanciones() {
        contenidoAudioRepository.save(new Cancion("c1", "Medal", 126, "moodmode", "Velocity Dreams"));
        contenidoAudioRepository.save(new Cancion("c2", "Exciting Sports", 57, "Sunsides", "Neon Pulse"));
        contenidoAudioRepository.save(new Cancion("c3", "High Impact", 62, "soundbycam", "Adrenaline Rush"));
        contenidoAudioRepository.save(new Cancion("c4", "Power Surge", 156, "Denys_Brodovskyi", "Limit Break"));
        contenidoAudioRepository.save(new Cancion("c5", "Confidence", 140, "Begench_Bengenjov", "Rise Above"));
        contenidoAudioRepository.save(new Cancion("c6", "Positive Way", 120, "RomanSenykMusic", "Endless Motion"));
        contenidoAudioRepository.save(new Cancion("c7", "Energetic Happy & Upbeat Rock Music", 115, "RocknStock", "Fire Within"));
        contenidoAudioRepository.save(new Cancion("c8", "Action Sport Rock", 112, "BoDleasons", "Thunder Road"));
        contenidoAudioRepository.save(new Cancion("c9", "Power Sport Extreme Trailer", 66, "Diamond_Tunes", "Extreme Horizon"));
        contenidoAudioRepository.save(new Cancion("c10", "Blessed Curse (Sport Rock)", 47, "Alex_Kizenkov", "Urban Legends"));
        contenidoAudioRepository.save(new Cancion("c11", "Sport Trap", 105, "SoundGalleryBy", "Shadow Velocity"));
        contenidoAudioRepository.save(new Cancion("c12", "Phonk - Phonk Music", 105, "The_Mountain", "Midnight Asphalt"));
        contenidoAudioRepository.save(new Cancion("c13", "Phonk - Phonk Drift", 111, "MondaMusic", "Tokyo Drift Nights"));
        contenidoAudioRepository.save(new Cancion("c14", "Hard Phonk", 64, "Watermello", "Dark Engine"));
        contenidoAudioRepository.save(new Cancion("c15", "Brazilian Phonk", 141, "AbsoluteSound", "Rio Bass Culture"));
        contenidoAudioRepository.save(new Cancion("c16", "Slowed Phonk", 195, "XXXDOLM", "Echoes in Slow Motion"));
        contenidoAudioRepository.save(new Cancion("c17", "Sports Phonk", 216, "XXXDOLM", "Nitro League"));
        contenidoAudioRepository.save(new Cancion("c18", "Energy Phonk", 161, "SOULFULIJAMTRACKS", "Voltage Dreams"));
        contenidoAudioRepository.save(new Cancion("c19", "Asia Drift Phonk", 127, "vjgalaxy", "Neon Sakura Streets"));
        contenidoAudioRepository.save(new Cancion("c20", "Toxic Drift", 178, "White_Records", "Smoke & Venom"));
        contenidoAudioRepository.save(new Cancion("c21", "Ambient Celestial", 144, "RedProductions", "Stellar Horizons"));
        contenidoAudioRepository.save(new Cancion("c22", "Cosmic Space", 168, "AudioCoffe", "Beyond the Nebula"));
        contenidoAudioRepository.save(new Cancion("c23", "Drone Space", 152, "Good_B_Music", "Deep Orbit Signals"));
        contenidoAudioRepository.save(new Cancion("c24", "Retail", 123, "The_Mountain", "Modern Aisles"));
        contenidoAudioRepository.save(new Cancion("c25", "The Truth", 159, "The_Mountain", "Hidden Frequencies"));
        contenidoAudioRepository.save(new Cancion("c26", "Earth Day", 82, "penguinmusic", "Planet Awakening"));
        contenidoAudioRepository.save(new Cancion("c27", "Eclipse", 89, "penguinmusic", "Lunar Shadows"));
        contenidoAudioRepository.save(new Cancion("c28", "Simple Background", 137, "The_Mountain", "Minimal Atmospheres"));
        contenidoAudioRepository.save(new Cancion("c29", "Midnight Forest", 168, "Syouki_Takahashi", "Whispers of the Pines"));
        contenidoAudioRepository.save(new Cancion("c30", "Mysterious Pulsings Synths", 144, "Keyframe_Audio", "Synthetic Echoes"));
        contenidoAudioRepository.save(new Cancion("c31", "Chil Boom", 155, "Alex_MakeMusic", "Tropical Vibes"));
        contenidoAudioRepository.save(new Cancion("c32", "Jungle Waves", 132, "DIMMYSAD", "Emerald Tides"));
        contenidoAudioRepository.save(new Cancion("c33", "House Upbeat", 72, "Loksii", "Neon House Nights"));
        contenidoAudioRepository.save(new Cancion("c34", "Nostalgia", 155, "GiorgioVitté", "Memories in Motion"));
        contenidoAudioRepository.save(new Cancion("c35", "Nothing to Lose", 232, "Denys_Brodovskyi", "Final Stand"));
        contenidoAudioRepository.save(new Cancion("c36", "Beach", 167, "VladislavDrahuta", "Ocean Escape"));
        contenidoAudioRepository.save(new Cancion("c37", "Candy", 104, "FASSounds", "Sweet Delight"));
        contenidoAudioRepository.save(new Cancion("c38", "Pop Party", 131, "Alex_MakeMusic", "Electric Celebration"));
        contenidoAudioRepository.save(new Cancion("c39", "A Latin Dance", 119, "MomotMusic", "Ritmo Caliente"));
        contenidoAudioRepository.save(new Cancion("c40", "Latina noche", 114, "White_Records", "Noches de Fuego"));
        contenidoAudioRepository.save(new Cancion("c41", "Groobe Machine", 102, "Diamond_Tunes", "Rhythm Factory"));
        contenidoAudioRepository.save(new Cancion("c42", "Positive Funk Groove", 107, "Universfield", "Funk Avenue"));
        contenidoAudioRepository.save(new Cancion("c43", "A Real Groove", 102, "Crab_Audio", "Urban Groove Sessions"));
        contenidoAudioRepository.save(new Cancion("c44", "Vinyl Funk", 88, "AllissiaBeats", "Retro Spin"));
        contenidoAudioRepository.save(new Cancion("c45", "Kids Music", 113, "BombinSounds", "Happy Playground"));
        contenidoAudioRepository.save(new Cancion("c46", "Percussion Trailer", 84, "Alec_Koff", "Tribal Impact"));
        contenidoAudioRepository.save(new Cancion("c47", "Upbeat Drums", 59, "MrClaps_", "Beat Motion"));
        contenidoAudioRepository.save(new Cancion("c48", "Stomp Drum Percussion", 83, "EnergySound", "Thunder Percussion"));
        contenidoAudioRepository.save(new Cancion("c49", "Fresh Urban Stomp", 65, "ViachevsalvStarostin", "Street Pulse"));
        contenidoAudioRepository.save(new Cancion("c50", "Stomp", 64, "sounddelicious", "Raw Stomp Energy"));
        contenidoAudioRepository.save(new Cancion("c51", "Everday Is A Holiday", 161, "Brotheration_Records", "Endless Vacation"));
        contenidoAudioRepository.save(new Cancion("c52", "Summer", 72, "Elijah_K", "Golden Coast"));
        contenidoAudioRepository.save(new Cancion("c53", "Summer Afro Tropical", 143, "OiBeats", "Afro Sunset"));
        contenidoAudioRepository.save(new Cancion("c54", "Reggae", 124, "AlexGuz", "Island Rhythms"));
        contenidoAudioRepository.save(new Cancion("c55", "Reggae Town", 139, "JuliusH", "Kingston Lights"));
        contenidoAudioRepository.save(new Cancion("c56", "A Quiet Joy", 108, "stevekaldes", "Peaceful Moments"));
        contenidoAudioRepository.save(new Cancion("c57", "April", 128, "folk_acoustic", "Spring Letters"));
        contenidoAudioRepository.save(new Cancion("c58", "Sedative", 181, "music_for_video", "Silent Therapy"));
        contenidoAudioRepository.save(new Cancion("c59", "Calm", 52, "geoffharvey", "Gentle Horizons"));
        contenidoAudioRepository.save(new Cancion("c60", "Summer Walk", 198, "folk_acoustic", "Sunset Avenue"));
    }

    private void cargarPodcasts() {
        contenidoAudioRepository.save(new Podcast("p1", "Corporate", 149, "Eliveta", 12));
        contenidoAudioRepository.save(new Podcast("p2", "Inspiring Minimal", 154, "pinguin", 8));
        contenidoAudioRepository.save(new Podcast("p3", "Upbeat", 122, "kornevmusic", 14));
        contenidoAudioRepository.save(new Podcast("p4", "Fun like", 110, "FASSounds", 4));
        contenidoAudioRepository.save(new Podcast("p5", "Instagram Reels", 146, "STAROSTIN", 9));
        contenidoAudioRepository.save(new Podcast("p6", "Omalicha Nwa", 137, "artbybigvee", 3));
        contenidoAudioRepository.save(new Podcast("p7", "Vlog Hip-hop", 104, "ProducesPla", 10));
        contenidoAudioRepository.save(new Podcast("p8", "Advertising Music", 147, "SoundGalley", 8));
        contenidoAudioRepository.save(new Podcast("p9", "Summer Top", 122, "MomotMusic", 15));
        contenidoAudioRepository.save(new Podcast("p10", "Luxury Ambience", 110, "MomotMusic", 2));
    }
}