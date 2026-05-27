import TrackCard from './TrackCard.jsx';

function PlaylistView({ playlist, favoriteSet, pistaActual, onPlay, onAddMusic, onToggleFavorito }) {
  const contenidos = playlist.contenidos || [];

  return (
    <section className="playlist-view">
      <div className="playlist-hero glass-panel">
        <div>
          <p className="eyebrow">Playlist</p>
          <h1>{playlist.nombre}</h1>
          <span>{contenidos.length} pistas agregadas</span>
        </div>
        <button className="primary-button" onClick={onAddMusic}>Agregar música</button>
      </div>

      <div className="track-grid">
        {contenidos.map((item) => (
          <TrackCard
            key={item.id}
            item={item}
            active={pistaActual?.id === item.id}
            favorite={favoriteSet.has(item.id)}
            onPlay={() => onPlay(item)}
            onToggleFavorite={() => onToggleFavorito(item.id)}
          />
        ))}
      </div>

      {contenidos.length === 0 && (
        <div className="empty-state glass-panel">
          Esta playlist está vacía. Usa "Agregar música" para sumar canciones o podcasts.
        </div>
      )}
    </section>
  );
}

export default PlaylistView;
