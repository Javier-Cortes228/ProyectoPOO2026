const JSON_HEADERS = {
  'Content-Type': 'application/json'
};

async function request(path, options = {}) {
  const headers = {
    ...(options.body ? JSON_HEADERS : {}),
    ...(options.headers || {})
  };

  let response;
  try {
    response = await fetch(path, { ...options, headers, credentials: 'include' });
  } catch {
    throw new Error('No se pudo conectar con el backend. Verifica que Spring Boot este corriendo en http://localhost:8080.');
  }

  if (!response.ok) {
    const errorBody = await safeJson(response);
    const message = errorBody?.mensaje
      || errorBody?.message
      || (response.status >= 500
        ? 'El backend no esta disponible o fallo al procesar la solicitud. Revisa la consola de Spring Boot.'
        : 'No fue posible completar la solicitud.');
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function safeJson(response) {
  try {
    const text = await response.text();
    if (!text) {
      return null;
    }
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function login(correo, contrasena) {
  return request('/api/usuarios/login', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ correo, contrasena })
  });
}

export function registrar(nombreUsuario, correo, contrasena) {
  return request('/api/usuarios/registrar', {
    method: 'POST',
    body: JSON.stringify({ nombreUsuario, correo, contrasena })
  });
}

export function obtenerUsuarioActual() {
  return request('/api/usuarios/me');
}

export function logout() {
  return request('/api/usuarios/logout', {
    method: 'POST'
  });
}

export function verificarCorreo(token) {
  return request(`/api/usuarios/verificar?token=${encodeURIComponent(token)}`);
}

export function verificarCodigoCorreo(correo, codigo) {
  return request('/api/usuarios/verificar-codigo', {
    method: 'POST',
    body: JSON.stringify({ correo, codigo })
  });
}

export function reenviarVerificacion(correo) {
  return request(`/api/usuarios/reenviar-verificacion?correo=${encodeURIComponent(correo)}`, {
    method: 'POST'
  });
}

export function solicitarRecuperacionContrasena(correo) {
  return request('/api/usuarios/recuperacion/solicitar', {
    method: 'POST',
    body: JSON.stringify({ correo })
  });
}

export function verificarCodigoRecuperacion(correo, codigo) {
  return request('/api/usuarios/recuperacion/verificar', {
    method: 'POST',
    body: JSON.stringify({ correo, codigo })
  });
}

export function restablecerContrasena(correo, codigo, nuevaContrasena) {
  return request('/api/usuarios/recuperacion/restablecer', {
    method: 'POST',
    body: JSON.stringify({ correo, codigo, nuevaContrasena })
  });
}

export function cargarCatalogo(titulo = '') {
  return request(`/api/catalogo/buscar?titulo=${encodeURIComponent(titulo)}`);
}

export function crearPlaylist(usuarioId, nombre) {
  return request(`/api/playlists/${encodeURIComponent(usuarioId)}/crear?nombre=${encodeURIComponent(nombre)}`, {
    method: 'POST'
  });
}

export function agregarContenidoAPlaylist(playlistId, contenidoId) {
  return request(`/api/playlists/${encodeURIComponent(playlistId)}/agregar/${encodeURIComponent(contenidoId)}`, {
    method: 'POST'
  });
}

export function agregarJamendoAPlaylist(playlistId, track) {
  return request(`/api/playlists/${encodeURIComponent(playlistId)}/agregar-jamendo`, {
    method: 'POST',
    body: JSON.stringify({
      id: track.id,
      titulo: track.titulo,
      duracionSegundos: track.duracionSegundos || 0,
      artista: track.artista || '',
      album: track.album || '',
      genero: track.genero || '',
      imagenUrl: track.imagenUrl || '',
      audioUrl: track.audioUrl,
      licenciaUrl: track.licenciaUrl || '',
      jamendoUrl: track.jamendoUrl || ''
    })
  });
}

export function removerContenidoDePlaylist(playlistId, contenidoId) {
  return request(`/api/playlists/${encodeURIComponent(playlistId)}/contenidos/${encodeURIComponent(contenidoId)}`, {
    method: 'DELETE'
  });
}

export function eliminarPlaylist(playlistId) {
  return request(`/api/playlists/${encodeURIComponent(playlistId)}`, {
    method: 'DELETE'
  });
}

export function registrarReproduccion(item) {
  return request('/api/historial/reproducciones', {
    method: 'POST',
    body: JSON.stringify({
      id: item.id,
      titulo: item.titulo,
      duracionSegundos: item.duracionSegundos || 0,
      tipo: item.tipo || '',
      artista: item.artista || '',
      album: item.album || '',
      anfitrion: item.anfitrion || '',
      genero: item.genero || '',
      imagenUrl: item.imagenUrl || '',
      audioUrl: item.audioUrl || '',
      licenciaUrl: item.licenciaUrl || '',
      jamendoUrl: item.jamendoUrl || '',
      fuente: item.fuente || (item.audioUrl ? 'JAMENDO' : 'LOCAL')
    })
  });
}

export function cargarHistorial(limit = 20) {
  return request(`/api/historial/recientes?limit=${encodeURIComponent(limit)}`);
}

export function cargarRecomendaciones(limit = 12) {
  return request(`/api/recomendaciones?limit=${encodeURIComponent(limit)}`);
}

export function buscarJamendo(query, { limit = 30, offset = 0 } = {}) {
  const params = new URLSearchParams({
    query,
    limit: String(limit),
    offset: String(offset)
  });
  return request(`/api/jamendo/buscar?${params.toString()}`);
}

export function vaciarHistorial() {
    return request('/api/historial/vaciar', {
        method: 'DELETE'
    });
}
