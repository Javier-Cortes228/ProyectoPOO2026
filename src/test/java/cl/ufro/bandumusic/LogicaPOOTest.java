package cl.ufro.bandumusic;

import cl.ufro.bandumusic.model.Cancion;
import cl.ufro.bandumusic.model.PlayList;
import cl.ufro.bandumusic.model.Usuario;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import cl.ufro.bandumusic.exception.PlaylistLlenaException;
import cl.ufro.bandumusic.exception.CancionNoEncontradaException;
import cl.ufro.bandumusic.model.Catalogo;

public class LogicaPOOTest {

    // TEST 1: Comprobar que el login funciona con datos correctos
    @Test
    public void testVerificarCredencialesCorrectas() {
        Usuario user = new Usuario("1", "Javier", "j.cortes10@ufromail.cl", "1234");

        boolean resultado = user.verificarCredenciales("j.cortes10@ufromail.cl", "1234");

        assertTrue(resultado, "Las credenciales correctas deberían devolver true");
    }

    // TEST 2: Comprobar que el login bloquea contraseñas falsas
    @Test
    public void testVerificarCredencialesIncorrectas() {
        Usuario user = new Usuario("1", "Javier", "j.cortes10@ufromail.cl", "1234");

        boolean resultado = user.verificarCredenciales("j.cortes10@ufromail.cl", "admin_falso");

        assertFalse(resultado, "Las credenciales incorrectas deberían devolver false");
    }

    // TEST 3: Comprobar la Composición (Crear listas en el usuario)
    @Test
    public void testCrearPlaylistAumentaLista() {
        Usuario user = new Usuario("1", "Javier", "j.cortes10@ufromail.cl", "1234");
        // Por nuestro código, al nacer el usuario ya tiene la lista "Favoritos"

        user.crearPlaylist("Rock Clásico");

        assertEquals(2, user.getPlaylist().size(), "El usuario debería tener 2 playlists en total");
    }

    // TEST 4: Comprobar la lógica matemática de la herencia y agregación
    @Test
    public void testCalcularDuracionTotalPlaylist() {
        PlayList lista = new PlayList("p1", "Mi Musica");
        Cancion c1 = new Cancion("c1", "Cancion 1", 120, "Artista A", "Album A");
        Cancion c2 = new Cancion("c2", "Cancion 2", 180, "Artista B", "Album B");

        lista.agregarContenido(c1);
        lista.agregarContenido(c2);

        // 120 + 180 = 300 segundos
        assertEquals(300, lista.calcularDuracionTotal(), "La suma de duración debe ser 300 segundos");
    }

    // TEST 5: Excepción al intentar crear usuario sin nombre
    @Test
    public void testCrearUsuarioSinNombreLanzaExcepcion() {
        assertThrows(IllegalArgumentException.class, () -> {
            new Usuario("2", "", "test@correo.cl", "1234");
        }, "Debería fallar al crear un usuario con nombre vacío");
    }

    // TEST 6: Excepción al intentar crear playlist sin título
    @Test
    public void testCrearPlaylistSinNombreLanzaExcepcion() {
        assertThrows(IllegalArgumentException.class, () -> {
            new PlayList("p2", "   "); // Nombre en blanco
        }, "Debería fallar al crear playlist sin título");
    }

    // TEST 7: Comprobar PlaylistLlenaException
    @Test
    public void testPlaylistLlenaLanzaExcepcion() {
        PlayList lista = new PlayList("p3", "Mi Mix");

        // Llenamos la lista al límite (300)
        for(int i = 0; i < 300; i++) {
            lista.agregarContenido(new Cancion("c"+i, "Cancion", 100, "Art", "Alb"));
        }

        // La número 301 debe detonar la excepción
        assertThrows(PlaylistLlenaException.class, () -> {
            lista.agregarContenido(new Cancion("c3001", "Exceso", 100, "Art", "Alb"));
        });
    }

    // TEST 8: Comprobar CancionNoEncontradaException
    @Test
    public void testCancionNoEncontradaLanzaExcepcion() {
        Catalogo catalogo = new Catalogo();
        catalogo.agregarAlCatalogo(new Cancion("1", "Bohemian Rhapsody", 354, "Queen", "A Night at the Opera"));

        assertThrows(CancionNoEncontradaException.class, () -> {
            catalogo.buscarPorTitulo("Despacito"); // No existe en el catálogo
        });
    }

    // TEST 9: Probar la Programación Funcional (Filtrar por Artista)
    @Test
    public void testFiltrarPorArtistaFuncional() {
        Catalogo catalogo = new Catalogo();
        catalogo.agregarAlCatalogo(new Cancion("1", "Song 1", 200, "Queen", "Album A"));
        catalogo.agregarAlCatalogo(new Cancion("2", "Song 2", 200, "Queen", "Album B"));
        catalogo.agregarAlCatalogo(new Cancion("3", "Song 3", 200, "The Beatles", "Album C"));

        var resultados = catalogo.filtrarPorArtista("Queen");

        assertEquals(2, resultados.size(), "Debería encontrar exactamente 2 canciones de Queen");
    }

    // TEST 10: Probar remover contenido (Lambda)
    @Test
    public void testRemoverContenidoPlaylist() {
        PlayList lista = new PlayList("p1", "Rock");
        Cancion c1 = new Cancion("c1", "Thunderstruck", 300, "AC/DC", "The Razors Edge");
        lista.agregarContenido(c1);

        lista.removerContenido("c1");

        assertTrue(lista.getContenidos().isEmpty(), "La playlist debería quedar vacía tras remover la canción");
    }
}