function TrackCard({ item, active, favorite, onPlay, onToggleFavorite, onRemove }) {
  const creador = item.artista || item.anfitrion || 'Sin autor';

  function toggle(event) {
    event.stopPropagation();
    onToggleFavorite();
  }

  function remove(event) {
    event.stopPropagation();
    onRemove();
  }

  return (
    <article className={`track-card glass-panel ${active ? 'active' : ''}`}>
      <button className="track-play-zone" onClick={onPlay}>
        <span className="track-type">{item.tipo}</span>
        <strong>{item.titulo}</strong>
        <small>{creador}</small>
        {item.genero && <em>{item.genero}</em>}
      </button>

      <button
        className={`favorite-button ${favorite ? 'active' : ''}`}
        aria-label={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        onClick={toggle}
      >
        <span>{favorite ? 'Fav' : '+'}</span>
      </button>

      {onRemove && (
        <button
          className="remove-track-button"
          aria-label="Quitar de la playlist"
          onClick={remove}
        >
          Quitar
        </button>
      )}
    </article>
  );
}

export default TrackCard;
