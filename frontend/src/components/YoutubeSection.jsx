import { useState } from 'react';

function YoutubeSection({ resultados, activeVideoId, onBuscar, onPlay, onError }) {
  const [query, setQuery] = useState('');
  const [cargando, setCargando] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (!query.trim()) {
      return;
    }

    setCargando(true);
    try {
      await onBuscar(query);
    } catch (error) {
      onError(error.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <section className="section-block">
      <div className="section-heading">
        <div>
          <p>Proveedor externo</p>
          <h2>YouTube</h2>
        </div>
      </div>

      <form className="youtube-search" onSubmit={submit}>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar videos oficiales o contenido permitido" />
        <button disabled={cargando}>{cargando ? 'Buscando...' : 'Buscar'}</button>
      </form>

      <div className="youtube-list">
        {resultados.map((video) => (
          <button
            className={`youtube-item glass-panel ${activeVideoId === video.videoId ? 'active' : ''}`}
            key={video.videoId}
            onClick={() => onPlay(video)}
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
  );
}

export default YoutubeSection;
