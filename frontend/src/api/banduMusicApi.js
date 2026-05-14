const JSON_HEADERS = {
  'Content-Type': 'application/json'
};

async function request(path, options = {}) {
  const response = await fetch(path, options);

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
    headers: JSON_HEADERS,
    body: JSON.stringify({ nombreUsuario, correo, contrasena })
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

export function buscarYoutube(query) {
  return request(`/api/youtube/buscar?query=${encodeURIComponent(query)}`);
}
