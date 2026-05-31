import { useEffect, useMemo, useState } from 'react';
import {
  agregarContenidoAPlaylist,
  buscarJamendo,
  cargarCatalogo,
  crearPlaylist,
  login,
  obtenerUsuarioActual,
  registrar,
  removerContenidoDePlaylist,
  setAuthToken
} from './api/banduMusicApi.js';
import AddMusicModal from './components/AddMusicModal.jsx';
import AuthPanel from './components/AuthPanel.jsx';
import CreatePlaylistModal from './components/CreatePlaylistModal.jsx';
import MainContent from './components/MainContent.jsx';
import PlayerBar from './components/PlayerBar.jsx';
import Sidebar from './components/Sidebar.jsx';

const TOKEN_STORAGE_KEY = 'bandumusic:auth-token';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(() => window.localStorage.getItem(TOKEN_STORAGE_KEY) || '');
  const [authReady, setAuthReady] = useState(false);
  const [catalogo, setCatalogo] = useState([]);
  const [activeView, setActiveView] = useState({ type: 'home' });
  const [pistaActual, setPistaActual] = useState(null);
  const [jamendoActual, setJamendoActual] = useState(null);
  const [jamendoResultados, setJamendoResultados] = useState([]);
  const [jamendoQuery, setJamendoQuery] = useState('');
  const [jamendoOffset, setJamendoOffset] = useState(0);
  const [jamendoHasMore, setJamendoHasMore] = useState(false);
  const [jamendoPreloadUrl, setJamendoPreloadUrl] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [isCreatePlaylistOpen, setCreatePlaylistOpen] = useState(false);
  const [isAddMusicOpen, setAddMusicOpen] = useState(false);

  useEffect(() => {
    setAuthToken(token);

    if (token) {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
      return;
    }

    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  }, [token]);

  useEffect(() => {
    if (!token) {
      setAuthReady(true);
      return;
    }

    obtenerUsuarioActual()
      .then((data) => setUsuario(normalizarUsuario(data)))
      .catch(() => cerrarSesionLocal())
      .finally(() => setAuthReady(true));
  }, []);

  useEffect(() => {
    if (!usuario) {
      return;
    }

    cargarCatalogo()
      .then(setCatalogo)
      .catch((error) => setMensaje(error.message));
  }, [usuario]);

  const playlists = usuario?.playlist || [];
  const playlistFavoritos = useMemo(() => {
    return playlists.find((playlist) => esPlaylistFavoritos(playlist)) || null;
  }, [playlists]);
  const playlistsVisibles = useMemo(() => {
    return playlists.filter((playlist) => !esPlaylistFavoritos(playlist));
  }, [playlists]);

  const activePlaylist = useMemo(() => {
    if (activeView.type !== 'playlist') {
      return null;
    }
    return playlists.find((playlist) => playlist.id === activeView.playlistId) || null;
  }, [activeView, playlists]);

  const favoritos = useMemo(() => {
    return playlistFavoritos?.contenidos || [];
  }, [playlistFavoritos]);

  const favoritosIds = useMemo(() => favoritos.map((item) => item.id), [favoritos]);

  async function handleLogin(form) {
    setMensaje('');
    const data = await login(form.correo, form.contrasena);
    setToken(data.token);
    setAuthToken(data.token);
    setUsuario(normalizarUsuario(data.usuario));
    setActiveView({ type: 'home' });
  }

  async function handleRegistro(form) {
    setMensaje('');
    const data = await registrar(form.nombreUsuario, form.correo, form.contrasena);
    setToken(data.token);
    setAuthToken(data.token);
    setUsuario(normalizarUsuario(data.usuario));
    setActiveView({ type: 'home' });
  }

  function handleLogout() {
    cerrarSesionLocal();
  }

  function cerrarSesionLocal() {
    setToken('');
    setAuthToken('');
    setUsuario(null);
    setCatalogo([]);
    setPistaActual(null);
    setJamendoActual(null);
    setJamendoResultados([]);
    setJamendoQuery('');
    setJamendoOffset(0);
    setJamendoHasMore(false);
    setJamendoPreloadUrl('');
    setActiveView({ type: 'home' });
  }

  async function handleCrearPlaylist(nombre) {
    if (!usuario) {
      return;
    }

    const nuevaPlaylist = normalizarPlaylist(await crearPlaylist(usuario.id, nombre));
    setUsuario((actual) => ({
      ...actual,
      playlist: [...(actual.playlist || []), nuevaPlaylist]
    }));
    setActiveView({ type: 'playlist', playlistId: nuevaPlaylist.id });
    setCreatePlaylistOpen(false);
  }

  async function handleAgregarMusica(contenidoIds) {
    if (!activePlaylist || contenidoIds.length === 0) {
      setAddMusicOpen(false);
      return;
    }

    const existentes = new Set((activePlaylist.contenidos || []).map((item) => item.id));
    const nuevosIds = contenidoIds.filter((id) => !existentes.has(id));

    await Promise.all(nuevosIds.map((id) => agregarContenidoAPlaylist(activePlaylist.id, id)));

    const nuevosContenidos = catalogo.filter((item) => nuevosIds.includes(item.id));
    setUsuario((actual) => ({
      ...actual,
      playlist: actual.playlist.map((playlist) => {
        if (playlist.id !== activePlaylist.id) {
          return playlist;
        }

        return {
          ...playlist,
          contenidos: [...(playlist.contenidos || []), ...nuevosContenidos],
          duracionTotalSegundos: calcularDuracion([...(playlist.contenidos || []), ...nuevosContenidos])
        };
      })
    }));
    setAddMusicOpen(false);
  }

  function actualizarPlaylist(playlistId, actualizar) {
    setUsuario((actual) => ({
      ...actual,
      playlist: (actual.playlist || []).map((playlist) => (
        playlist.id === playlistId ? actualizar(playlist) : playlist
      ))
    }));
  }

  async function toggleFavorito(itemId) {
    if (!playlistFavoritos) {
      setMensaje('No existe una playlist de Favoritos para este usuario.');
      return;
    }

    const yaEsFavorito = favoritosIds.includes(itemId);

    try {
      if (yaEsFavorito) {
        await removerContenidoDePlaylist(playlistFavoritos.id, itemId);
        actualizarPlaylist(playlistFavoritos.id, (playlist) => ({
          ...playlist,
          contenidos: (playlist.contenidos || []).filter((item) => item.id !== itemId),
          duracionTotalSegundos: calcularDuracion((playlist.contenidos || []).filter((item) => item.id !== itemId))
        }));
        return;
      }

      await agregarContenidoAPlaylist(playlistFavoritos.id, itemId);
      const contenido = catalogo.find((item) => item.id === itemId);
      if (!contenido) {
        return;
      }

      actualizarPlaylist(playlistFavoritos.id, (playlist) => {
        const contenidos = [...(playlist.contenidos || []), contenido];
        return {
          ...playlist,
          contenidos,
          duracionTotalSegundos: calcularDuracion(contenidos)
        };
      });
    } catch (error) {
      setMensaje(error.message);
    }
  }

  function reproducirLocal(item) {
    setJamendoActual(null);
    setPistaActual(item);
  }

  function reproducirJamendo(track) {
    setPistaActual(null);
    setJamendoPreloadUrl(track.audioUrl);
    setJamendoActual(track);
  }

  function preloadJamendo(track) {
    if (track?.audioUrl) {
      setJamendoPreloadUrl(track.audioUrl);
    }
  }

  async function handleBuscarJamendo(query, append = false) {
    setMensaje('');
    const limit = 30;
    const offset = append ? jamendoOffset : 0;
    const resultados = await buscarJamendo(query, { limit, offset });
    setJamendoResultados((actuales) => (append ? [...actuales, ...resultados] : resultados));
    setJamendoQuery(query);
    setJamendoOffset(offset + resultados.length);
    setJamendoHasMore(resultados.length === limit);

    if (resultados[0]) {
      setJamendoPreloadUrl(resultados[0].audioUrl);
    }
  }

  if (!authReady) {
    return (
      <main className="auth-shell">
        <div className="auth-card glass-panel">
          <h1>BanduMusic</h1>
          <span>Cargando sesion...</span>
        </div>
      </main>
    );
  }

  if (!usuario) {
    return (
      <main className="auth-shell">
        <AuthPanel onLogin={handleLogin} onRegistro={handleRegistro} mensaje={mensaje} />
      </main>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar
        usuario={usuario}
        playlists={playlistsVisibles}
        favoritos={favoritos}
        activeView={activeView}
        onGoHome={() => setActiveView({ type: 'home' })}
        onOpenPlaylist={(playlistId) => setActiveView({ type: 'playlist', playlistId })}
        onOpenFavorites={() => setActiveView({ type: 'favorites' })}
        onCreatePlaylist={() => setCreatePlaylistOpen(true)}
        onPlay={reproducirLocal}
      />

      <MainContent
        activeView={activeView}
        activePlaylist={activePlaylist}
        catalogo={catalogo}
        favoritos={favoritos}
        favoritosIds={favoritosIds}
        mensaje={mensaje}
        pistaActual={pistaActual}
        jamendoActual={jamendoActual}
        jamendoResultados={jamendoResultados}
        jamendoQuery={jamendoQuery}
        jamendoHasMore={jamendoHasMore}
        onClearMessage={() => setMensaje('')}
        onError={setMensaje}
        onPlayLocal={reproducirLocal}
        onPlayJamendo={reproducirJamendo}
        onPreloadJamendo={preloadJamendo}
        onToggleFavorito={toggleFavorito}
        onAddMusic={() => setAddMusicOpen(true)}
        onBuscarJamendo={handleBuscarJamendo}
        onLogout={handleLogout}
      />

      <PlayerBar
        pista={pistaActual}
        jamendoTrack={jamendoActual}
        queue={activeView.type === 'favorites' ? favoritos : catalogo}
        onPlayLocal={reproducirLocal}
      />

      {jamendoPreloadUrl && <audio className="audio-preload" src={jamendoPreloadUrl} preload="auto" />}

      <CreatePlaylistModal
        open={isCreatePlaylistOpen}
        onCancel={() => setCreatePlaylistOpen(false)}
        onAccept={handleCrearPlaylist}
      />

      <AddMusicModal
        open={isAddMusicOpen}
        catalogo={catalogo}
        playlist={activePlaylist}
        onCancel={() => setAddMusicOpen(false)}
        onAccept={handleAgregarMusica}
      />
    </div>
  );
}

function normalizarUsuario(usuario) {
  return {
    ...usuario,
    playlist: (usuario.playlist || []).map(normalizarPlaylist)
  };
}

function normalizarPlaylist(playlist) {
  return {
    ...playlist,
    contenidos: playlist.contenidos || [],
    duracionTotalSegundos: playlist.duracionTotalSegundos || 0
  };
}

function calcularDuracion(items) {
  return items.reduce((total, item) => total + (item.duracionSegundos || 0), 0);
}

function esPlaylistFavoritos(playlist) {
  return playlist?.nombre?.trim().toLowerCase() === 'favoritos';
}

export default App;
