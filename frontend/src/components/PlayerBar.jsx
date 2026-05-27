function PlayerBar({ pista, youtubeVideo, queue, onPlayLocal }) {
  const currentIndex = pista ? queue.findIndex((item) => item.id === pista.id) : -1;

  function previous() {
    if (currentIndex > 0) {
      onPlayLocal(queue[currentIndex - 1]);
    }
  }

  function next() {
    if (currentIndex >= 0 && currentIndex < queue.length - 1) {
      onPlayLocal(queue[currentIndex + 1]);
    }
  }

  return (
    <footer className="player-bar glass-panel">
      <div className="player-meta">
        <strong>{pista?.titulo || youtubeVideo?.titulo || 'Selecciona contenido'}</strong>
        <small>{pista ? (pista.artista || pista.anfitrion) : youtubeVideo?.canal || 'Catálogo local o YouTube'}</small>
      </div>

      {pista && (
        <div className="local-player">
          <button onClick={previous} disabled={currentIndex <= 0}>Anterior</button>
          <audio controls autoPlay src={`/audio/${pista.id}.mp3`} />
          <button onClick={next} disabled={currentIndex < 0 || currentIndex >= queue.length - 1}>Siguiente</button>
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

export default PlayerBar;
