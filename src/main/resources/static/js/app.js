let colaReproduccion = [];

async function iniciarSesion() {
    const correo = document.getElementById('login-correo').value;
    const contrasena = document.getElementById('login-contrasena').value;
    const errorEl = document.getElementById('login-error');

    // Limpiamos errores previos en la pantalla
    errorEl.textContent = "";

    try {
        const respuesta = await fetch('/api/usuarios/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, contrasena })
        });

        if (respuesta.ok) {
            const usuarioLogueado = await respuesta.json();

            // 1. Ocultar Login y Mostrar App
            document.getElementById('auth-container').style.display = 'none';
            document.getElementById('app-container').style.display = 'flex';

            // 2. Mostrar nombre del usuario en el header
            document.getElementById('user-info').textContent = "Hola, " + usuarioLogueado.nombreUsuario;

            // 3. Cargar la música desde la base de datos
            cargarCatalogo();
        } else {
            errorEl.textContent = "Credenciales incorrectas.";
        }
    } catch (e) {
        errorEl.textContent = "Error de conexión con el servidor.";
    }
}

async function cargarCatalogo() {
    try {
        const res = await fetch('/api/catalogo/buscar?titulo=');
        colaReproduccion = await res.json();

        const contenedor = document.getElementById('lista-canciones');
        contenedor.innerHTML = ''; // Limpiar catálogo previo

        colaReproduccion.forEach((item) => {
            // Inyectamos el HTML de cada tarjeta musical
            contenedor.innerHTML += `
                <div class="song-card" onclick="reproducirPista('${item.id}', '${item.titulo}', '${item.artista || item.anfitrion}')">
                    <h4 style="margin: 0 0 10px 0;">${item.titulo}</h4>
                    <p style="margin: 0; color: gray; font-size: 14px;">${item.artista || item.anfitrion}</p>
                </div>
            `;
        });
    } catch (e) {
        console.error("Error al cargar el catálogo", e);
    }
}

function reproducirPista(id, titulo, artista) {
    const player = document.getElementById('audio-player');

    // El id ('c1', 'p1') coincide con el nombre de tu archivo mp3 local
    player.src = `/audio/${id}.mp3`;
    player.play();

    // Actualizar la interfaz visual del reproductor
    document.getElementById('track-title').textContent = titulo;
    document.getElementById('track-artist').textContent = artista;
    document.getElementById('play-pause-btn').textContent = "⏸";
}

function togglePlay() {
    const player = document.getElementById('audio-player');
    const btn = document.getElementById('play-pause-btn');

    if (player.paused) {
        player.play();
        btn.textContent = "⏸";
    } else {
        player.pause();
        btn.textContent = "▶";
    }
}