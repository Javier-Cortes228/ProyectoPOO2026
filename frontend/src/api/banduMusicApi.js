const JSON_HEADERS = {
  'Content-Type': 'application/json'
};

let authToken = '';

export function setAuthToken(token) {
  authToken = token || '';
}

async function request(path, options = {}) {
  const headers = {
    ...(options.body ? JSON_HEADERS : {}),
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(path, { ...options, headers });

  if (!response.ok) {
    const errorBody = await safeJson(response);
    const message = errorBody?.mensaje || errorBody?.message || 'No fue posible completar la solicitud.';
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function safeJson(response) {
  try {
    return await response.json();
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

export function removerContenidoDePlaylist(playlistId, contenidoId) {
  return request(`/api/playlists/${encodeURIComponent(playlistId)}/contenidos/${encodeURIComponent(contenidoId)}`, {
    method: 'DELETE'
  });
}

export function buscarJamendo(query, { limit = 30, offset = 0 } = {}) {
  const params = new URLSearchParams({
    query,
    limit: String(limit),
    offset: String(offset)
  });
  return request(`/api/jamendo/buscar?${params.toString()}`);
}
