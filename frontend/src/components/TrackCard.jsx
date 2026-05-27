function TrackCard({ item, active, favorite, onPlay, onToggleFavorite }) {
  const creador = item.artista || item.anfitrion || 'Sin autor';

  function toggle(event) {
    event.stopPropagation();
    onToggleFavorite();
  }

  return (
    <article className={`track-card glass-panel ${active ? 'active' : ''}`}>
      <button className="track-play-zone" onClick={onPlay}>
        <span className="track-type">{item.tipo}</span>
        <strong>{item.titulo}</strong>
        <small>{creador}</small>
      </button>

      <button
        className={`favorite-button ${favorite ? 'active' : ''}`}
        aria-label={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        onClick={toggle}
      >
        <span>{favorite ? '♥' : '♡'}</span>
      </button>
    </article>
  );
}

export default TrackCard;
