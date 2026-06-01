import { useState } from 'react';

const QUICK_SEARCHES = ['rock', 'electronic', 'jazz', 'relaxation'];

function JamendoSection({
  resultados,
  activeTrackId,
  currentQuery,
  hasMore,
  playlists,
  favoriteSet,
  onBuscar,
  onPlay,
  onPreload,
  onToggleFavorito,
  onAddToPlaylist,
  onError
}) {
  const [query, setQuery] = useState('');
  const [cargando, setCargando] = useState(false);
  const [cargandoMas, setCargandoMas] = useState(false);
  const [playlistSeleccionada, setPlaylistSeleccionada] = useState('');

  async function submit(event) {
    event.preventDefault();
    await buscar(query);
  }

  async function buscar(valor) {
    const termino = valor.trim();
    if (!termino) {
      return;
    }

    setCargando(true);
    try {
      await onBuscar(termino);
    } catch (error) {
      onError(error.message);
    } finally {
      setCargando(false);
    }
  }

  async function cargarMas() {
    const termino = currentQuery || query.trim();
    if (!termino) {
      return;
    }

    setCargandoMas(true);
    try {
      await onBuscar(termino, true);
    } catch (error) {
      onError(error.message);
    } finally {
      setCargandoMas(false);
    }
  }

  return (
    <section className="section-block">
      <div className="section-heading">
        <div>
          <p>Proveedor externo</p>
          <h2>Catalogo online Jamendo</h2>
        </div>
        <span>{resultados.length} resultados</span>
      </div>

      <form className="online-search" onSubmit={submit}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar musica independiente por cancion, artista o genero"
        />
        <button disabled={cargando}>{cargando ? 'Buscando...' : 'Buscar'}</button>
      </form>

      <div className="quick-searches" aria-label="Busquedas rapidas">
        {QUICK_SEARCHES.map((termino) => (
          <button
            type="button"
            key={termino}
            onClick={() => {
              setQuery(termino);
              buscar(termino);
            }}
          >
            {termino}
          </button>
        ))}
      </div>

      <div className="online-actions-bar glass-panel">
        <label>
          Agregar resultados a
          <select value={playlistSeleccionada} onChange={(event) => setPlaylistSeleccionada(event.target.value)}>
            <option value="">Selecciona playlist</option>
            {(playlists || []).map((playlist) => (
              <option key={playlist.id} value={playlist.id}>{playlist.nombre}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="online-grid">
        {resultados.map((track) => (
          <article
            className={`online-track glass-panel ${activeTrackId === track.id ? 'active' : ''}`}
            key={track.id}
            onFocus={() => onPreload(track)}
            onMouseEnter={() => onPreload(track)}
          >
            <button className="online-track-main" type="button" onClick={() => onPlay(track)}>
              <img src={track.imagenUrl} alt="" />
              <span>
                <strong>{track.titulo}</strong>
                <small>{track.artista || 'Artista Jamendo'}</small>
                <em>{[track.album || 'Single', track.genero, formatDuration(track.duracionSegundos)].filter(Boolean).join(' - ')}</em>
              </span>
            </button>

            <div className="online-track-actions">
              <button
                type="button"
                className={`favorite-button ${favoriteSet?.has(track.id) ? 'active' : ''}`}
                aria-label={favoriteSet?.has(track.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                onClick={() => onToggleFavorito(track)}
              >
                <span>{favoriteSet?.has(track.id) ? 'Fav' : '+'}</span>
              </button>
              <button
                type="button"
                className="ghost-button compact"
                disabled={!playlistSeleccionada}
                onClick={() => onAddToPlaylist(track, playlistSeleccionada)}
              >
                Agregar
              </button>
            </div>
          </article>
        ))}
      </div>

      {resultados.length === 0 && (
        <p className="empty-state">
          Busca musica en Jamendo para reproducir contenido online sin modificar tu catalogo local.
        </p>
      )}

      {resultados.length > 0 && hasMore && (
        <button className="load-more-button" type="button" disabled={cargandoMas} onClick={cargarMas}>
          {cargandoMas ? 'Cargando...' : 'Cargar mas resultados'}
        </button>
      )}
    </section>
  );
}

function formatDuration(seconds) {
  const safeSeconds = Number.isFinite(seconds) ? seconds : 0;
  const minutes = Math.floor(safeSeconds / 60);
  const remaining = String(safeSeconds % 60).padStart(2, '0');
  return `${minutes}:${remaining}`;
}

export default JamendoSection;
