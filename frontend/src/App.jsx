import { useEffect, useMemo, useState } from 'react';
import {
  buscarYoutube,
  cargarCatalogo,
  crearPlaylist,
  login,
  registrar
} from './api/banduMusicApi.js';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [catalogo, setCatalogo] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [pistaActual, setPistaActual] = useState(null);
  const [youtubeActual, setYoutubeActual] = useState(null);
  const [youtubeResultados, setYoutubeResultados] = useState([]);
  const [youtubeQuery, setYoutubeQuery] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!usuario) {
      return;
    }

    cargarCatalogo()
      .then(setCatalogo)
      .catch((error) => setMensaje(error.message));
  }, [usuario]);

  const catalogoFiltrado = useMemo(() => {
    const filtro = busqueda.trim().toLowerCase();
    if (!filtro) {
      return catalogo;
    }

    return catalogo.filter((item) => {
      const creador = item.artista || item.anfitrion || '';
      return item.titulo.toLowerCase().includes(filtro) || creador.toLowerCase().includes(filtro);
    });
  }, [catalogo, busqueda]);

  async function handleLogin({ correo, contrasena }) {
    setMensaje('');
    const data = await login(correo, contrasena);
    setUsuario(data);
  }

  async function handleRegistro({ nombreUsuario, correo, contrasena }) {
    setMensaje('');
    const data = await registrar(nombreUsuario, correo, contrasena);
    setUsuario(data);
  }

  async function handleCrearPlaylist(nombre) {
    if (!usuario) {
      return;
    }

    const nuevaPlaylist = await crearPlaylist(usuario.id, nombre);
    setUsuario({
      ...usuario,
      playlist: [...usuario.playlist, nuevaPlaylist]
    });
  }

  async function handleBuscarYoutube(event) {
    event.preventDefault();
    if (!youtubeQuery.trim()) {
      return;
    }

    setCargando(true);
    setMensaje('');

    try {
      const resultados = await buscarYoutube(youtubeQuery);
      setYoutubeResultados(resultados);
    } catch (error) {
      setMensaje(error.message);
    } finally {
      setCargando(false);
    }
  }

  function reproducirLocal(item) {
    setYoutubeActual(null);
    setPistaActual(item);
  }

  function reproducirYoutube(video) {
    setPistaActual(null);
    setYoutubeActual(video);
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
      <Sidebar usuario={usuario} onCrearPlaylist={handleCrearPlaylist} onError={setMensaje} />

      <main className="content">
        <header className="topbar">
          <input
            className="search-input"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            placeholder="Buscar en catalogo local"
          />
          <button className="ghost-button" onClick={() => setUsuario(null)}>Salir</button>
        </header>

        {mensaje && <div className="status-message">{mensaje}</div>}

        <section className="section-block">
          <div className="section-heading">
            <div>
              <p>Biblioteca local</p>
              <h1>Catalogo BanduMusic</h1>
            </div>
            <span>{catalogoFiltrado.length} resultados</span>
          </div>

          <div className="track-grid">
            {catalogoFiltrado.map((item) => (
              <TrackCard
                key={item.id}
                item={item}
                active={pistaActual?.id === item.id}
                onPlay={() => reproducirLocal(item)}
              />
            ))}
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <div>
              <p>Proveedor externo</p>
              <h2>YouTube</h2>
            </div>
          </div>

          <form className="youtube-search" onSubmit={handleBuscarYoutube}>
            <input
              value={youtubeQuery}
              onChange={(event) => setYoutubeQuery(event.target.value)}
              placeholder="Buscar videos oficiales o contenido permitido"
            />
            <button disabled={cargando}>{cargando ? 'Buscando...' : 'Buscar'}</button>
          </form>

          <div className="youtube-list">
            {youtubeResultados.map((video) => (
              <button
                className={`youtube-item ${youtubeActual?.videoId === video.videoId ? 'active' : ''}`}
                key={video.videoId}
                onClick={() => reproducirYoutube(video)}
              >
                <img src={video.thumbnailUrl} alt="" />
                <span>
                  <strong>{video.titulo}</strong>
                  <small>{video.canal}</small>
                </span>
              </button>
            ))}
          </div>
        </section>
      </main>

      <PlayerBar pista={pistaActual} youtubeVideo={youtubeActual} catalogo={catalogo} onPlayLocal={reproducirLocal} />
    </div>
  );
}

function AuthPanel({ onLogin, onRegistro, mensaje }) {
  const [modo, setModo] = useState('login');
  const [form, setForm] = useState({
    nombreUsuario: '',
    correo: 'admin@ufro.cl',
    contrasena: '1234'
  });
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setError('');

    try {
      if (modo === 'login') {
        await onLogin(form);
      } else {
        await onRegistro(form);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  function update(field, value) {
    setForm({ ...form, [field]: value });
  }

  return (
    <form className="auth-card" onSubmit={submit}>
      <div>
        <p>Streaming academico</p>
        <h1>BanduMusic</h1>
      </div>

      <div className="mode-switch">
        <button type="button" className={modo === 'login' ? 'active' : ''} onClick={() => setModo('login')}>Login</button>
        <button type="button" className={modo === 'registro' ? 'active' : ''} onClick={() => setModo('registro')}>Registro</button>
      </div>

      {modo === 'registro' && (
        <label>
          Nombre
          <input value={form.nombreUsuario} onChange={(event) => update('nombreUsuario', event.target.value)} />
        </label>
      )}

      <label>
        Correo
        <input type="email" value={form.correo} onChange={(event) => update('correo', event.target.value)} />
      </label>

      <label>
        Contrasena
        <input type="password" value={form.contrasena} onChange={(event) => update('contrasena', event.target.value)} />
      </label>

      {(error || mensaje) && <div className="form-error">{error || mensaje}</div>}

      <button className="primary-button">{modo === 'login' ? 'Entrar' : 'Crear cuenta'}</button>
    </form>
  );
}

function Sidebar({ usuario, onCrearPlaylist, onError }) {
  const [nombre, setNombre] = useState('');

  async function submit(event) {
    event.preventDefault();
    if (!nombre.trim()) {
      return;
    }

    try {
      await onCrearPlaylist(nombre);
      setNombre('');
    } catch (error) {
      onError(error.message);
    }
  }

  return (
    <aside className="sidebar">
      <div>
        <h2>BanduMusic</h2>
        <p>{usuario.nombreUsuario}</p>
      </div>

      <form className="playlist-form" onSubmit={submit}>
        <label>Nueva playlist</label>
        <input value={nombre} onChange={(event) => setNombre(event.target.value)} placeholder="Nombre" />
        <button>Crear</button>
      </form>

        <nav className="playlist-list">
            {(usuario.playlist || []).map((playlist) => (
                <button key={playlist.id}>
                    <span>{playlist.nombre}</span>
                    <small>{(playlist.contenidos || []).length} pistas</small>
                </button>
            ))}
        </nav>
    </aside>
  );
}

function TrackCard({ item, active, onPlay }) {
  const creador = item.artista || item.anfitrion || 'Sin autor';

  return (
    <button className={`track-card ${active ? 'active' : ''}`} onClick={onPlay}>
      <span className="track-type">{item.tipo}</span>
      <strong>{item.titulo}</strong>
      <small>{creador}</small>
    </button>
  );
}

function PlayerBar({ pista, youtubeVideo, catalogo, onPlayLocal }) {
  const currentIndex = pista ? catalogo.findIndex((item) => item.id === pista.id) : -1;

  function previous() {
    if (currentIndex > 0) {
      onPlayLocal(catalogo[currentIndex - 1]);
    }
  }

  function next() {
    if (currentIndex >= 0 && currentIndex < catalogo.length - 1) {
      onPlayLocal(catalogo[currentIndex + 1]);
    }
  }

  return (
    <footer className="player-bar">
      <div className="player-meta">
        <strong>{pista?.titulo || youtubeVideo?.titulo || 'Selecciona contenido'}</strong>
        <small>{pista ? (pista.artista || pista.anfitrion) : youtubeVideo?.canal || 'Catalogo local o YouTube'}</small>
      </div>

      {pista && (
        <div className="local-player">
          <button onClick={previous} disabled={currentIndex <= 0}>Anterior</button>
            <audio
                controls
                autoPlay
                src={`http://localhost:8080/audio/${pista.id}.mp3`}
            />
          <button onClick={next} disabled={currentIndex < 0 || currentIndex >= catalogo.length - 1}>Siguiente</button>
        </div>
      )}

      {youtubeVideo && (
        <iframe
          className="youtube-player"
          title={youtubeVideo.titulo}
          src={`https://www.youtube.com/embed/${youtubeVideo.videoId}?autoplay=1&origin=${window.location.origin}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      )}
    </footer>
  );
}

export default App;
