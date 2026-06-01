import TrackCard from './TrackCard.jsx';

function PlaylistView({
  playlist,
  favoriteSet,
  pistaActual,
  onPlay,
  onAddMusic,
  onRemove,
  onDeletePlaylist,
  onToggleFavorito
}) {
  const contenidos = playlist.contenidos || [];

  return (
    <section className="playlist-view">
      <div className="playlist-hero glass-panel">
        <div>
          <p className="eyebrow">Playlist</p>
          <h1>{playlist.nombre}</h1>
          <span>{contenidos.length} pistas agregadas</span>
        </div>
        <div className="playlist-actions">
          <button className="primary-button" onClick={onAddMusic}>Agregar musica</button>
          <button className="danger-button" onClick={onDeletePlaylist}>Eliminar playlist</button>
        </div>
      </div>

      <div className="track-grid">
        {contenidos.map((item) => (
          <TrackCard
            key={item.id}
            item={item}
            active={pistaActual?.id === item.id}
            favorite={favoriteSet.has(item.id)}
            onPlay={() => onPlay(item)}
            onToggleFavorite={() => onToggleFavorito(item)}
            onRemove={() => onRemove(item)}
          />
        ))}
      </div>

      {contenidos.length === 0 && (
        <div className="empty-state glass-panel">
          Esta playlist esta vacia. Usa "Agregar musica" para sumar canciones o podcasts.
        </div>
      )}
    </section>
  );
}

export default PlaylistView;
