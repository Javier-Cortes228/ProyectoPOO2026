let colaReproduccion = [];
let indiceActual = -1;

// 1. Nueva variable global para recordar quién es el usuario
let usuarioActual = null;

// 3. Función para enviar los datos a Java
async function crearNuevaPlaylist() {
    const inputNombre = document.getElementById('nombre-nueva-playlist');
    const nombre = inputNombre.value.trim();

    // Validamos que no envíe un nombre vacío
    if (!nombre) {
        alert("Por favor, ingresa un nombre para tu playlist.");
        return;
    }

    try {
        // Hacemos el POST al endpoint que creaste en la Semana 3
        const res = await fetch(`/api/playlists/${usuarioActual.id}/crear?nombre=${encodeURIComponent(nombre)}`, {
            method: 'POST'
        });

        if (res.ok) {
            const nuevaPlaylist = await res.json();

            // Actualizamos la memoria de JS agregando la nueva lista
            usuarioActual.playlist.push(nuevaPlaylist);

            // Repintamos visualmente y limpiamos la caja de texto
            renderizarPlaylists();
            inputNombre.value = "";
        } else {
            const errorMsg = await res.text();
            alert("Error del servidor: " + errorMsg); // Captura tu validación de Java
        }
    } catch (e) {
        console.error("Error al crear playlist", e);
    }
}

// 4. Función para pintar las listas en la barra lateral
function renderizarPlaylists() {
    const contenedor = document.getElementById('lista-mis-playlists');
    contenedor.innerHTML = '';

    if (usuarioActual && usuarioActual.playlist) {
        usuarioActual.playlist.forEach(pl => {
            // Pintamos cada playlist. (Más adelante le agregaremos un onclick para ver sus canciones)
            contenedor.innerHTML += `
                <li style="color: #b3b3b3; margin-bottom: 12px; cursor: pointer; font-size: 14px; transition: color 0.2s;" 
                    onmouseover="this.style.color='white'" 
                    onmouseout="this.style.color='#b3b3b3'">
                    🎵 ${pl.nombre}
                </li>
            `;
        });
    }
}

async function iniciarSesion() {
    const correo = document.getElementById('login-correo').value;
    const contrasena = document.getElementById('login-contrasena').value;
    const errorEl = document.getElementById('login-error');
    errorEl.textContent = "";

    try {
        const respuesta = await fetch('/api/usuarios/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, contrasena })
        });

        if (respuesta.ok) {
            const usuarioLogueado = await respuesta.json();
            usuarioActual = {
                ...usuarioLogueado,
                playlist: []
            };
            renderizarPlaylists();
            document.getElementById('auth-container').style.display = 'none';
            document.getElementById('app-container').style.display = 'flex';
            document.getElementById('user-info').textContent = "👤 " + usuarioLogueado.nombreUsuario;
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
        const datos = await res.json();

        // BARRERA DE SEGURIDAD: Verificamos que el servidor realmente envió una lista
        if (Array.isArray(datos)) {
            colaReproduccion = datos;
            renderizarTarjetas(colaReproduccion);
        } else {
            console.error("El servidor devolvió un error en lugar de una lista:", datos);
        }
    } catch (e) {
        console.error("Error crítico al cargar el catálogo", e);
    }
}

function buscarMusica() {
    // Si la lista está corrupta, evitamos que la web colapse
    if (!Array.isArray(colaReproduccion)) return;

    const query = document.getElementById('busqueda').value.toLowerCase();

    // Filtramos localmente (ultra rápido, sin saturar al servidor)
    const resultados = colaReproduccion.filter(item => {
        const titulo = (item.titulo || "").toLowerCase();
        // Soportamos tanto Canciones (artista) como Podcasts (anfitrion)
        const creador = (item.artista || item.anfitrion || "").toLowerCase();

        return titulo.includes(query) || creador.includes(query);
    });

    if (resultados.length > 0) {
        renderizarTarjetas(resultados);
    } else {
        document.getElementById('lista-canciones').innerHTML =
            '<p style="color: gray; grid-column: 1 / -1; text-align: center;">No encontramos resultados exactos. Intenta con otra palabra.</p>';
    }
}

function renderizarTarjetas(lista) {
    const contenedor = document.getElementById('lista-canciones');
    contenedor.innerHTML = '';

    lista.forEach((item) => {
        // Encontramos la posición original del item en el catálogo general
        const posicionReal = colaReproduccion.findIndex(p => p.id === item.id);

        contenedor.innerHTML += `
            <div class="song-card ${indiceActual === posicionReal ? 'playing' : ''}" 
                 onclick="reproducirPista('${posicionReal}')">
                <h4>${item.titulo}</h4>
                <p>${item.artista || item.anfitrion}</p>
            </div>
        `;
    });
}

function reproducirPista(indexStr) {
    // Forzamos matemáticamente que el valor sea un número para evitar el bug "1"+"1"="11"
    const index = parseInt(indexStr);

    if(isNaN(index) || index < 0 || index >= colaReproduccion.length) return;

    indiceActual = index;
    const pista = colaReproduccion[indiceActual];
    const player = document.getElementById('audio-player');

    player.src = `/audio/${pista.id}.mp3`;
    player.play();

    document.getElementById('track-title').textContent = pista.titulo;
    document.getElementById('track-artist').textContent = pista.artista || pista.anfitrion;
    document.getElementById('play-pause-btn').textContent = "⏸";

    // Repintar para que el marco verde siga a la canción actual incluso si estamos buscando
    buscarMusica();
}

function togglePlay() {
    const player = document.getElementById('audio-player');
    const btn = document.getElementById('play-pause-btn');

    if (!player.src) return;

    if (player.paused) {
        player.play();
        btn.textContent = "⏸";
    } else {
        player.pause();
        btn.textContent = "▶";
    }
}

function reproducirSiguiente() {
    if (indiceActual === -1) return;

    if (indiceActual < colaReproduccion.length - 1) {
        reproducirPista(indiceActual + 1);
    } else {
        reproducirPista(0); // Vuelve a la primera pista (Bucle)
    }
}

function reproducirAnterior() {
    if (indiceActual === -1) return;

    if (indiceActual > 0) {
        reproducirPista(indiceActual - 1);
    } else {
        reproducirPista(0); // Reinicia si está en la primera
    }
}