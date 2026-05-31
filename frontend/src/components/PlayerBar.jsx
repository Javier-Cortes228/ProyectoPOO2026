function PlayerBar({ pista, jamendoTrack, queue, onPlayLocal }) {
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
        <strong>{pista?.titulo || jamendoTrack?.titulo || 'Selecciona contenido'}</strong>
        <small>{pista ? (pista.artista || pista.anfitrion) : jamendoTrack?.artista || 'Catalogo local o Jamendo'}</small>
      </div>

      {pista && (
        <div className="local-player">
          <button onClick={previous} disabled={currentIndex <= 0}>Anterior</button>
          <audio controls autoPlay src={`/audio/${pista.id}.mp3`} />
          <button onClick={next} disabled={currentIndex < 0 || currentIndex >= queue.length - 1}>Siguiente</button>
        </div>
      )}

      {jamendoTrack && (
        <div className="external-player">
          <audio key={jamendoTrack.id} controls autoPlay preload="auto" src={jamendoTrack.audioUrl} />
          <a href={jamendoTrack.jamendoUrl} target="_blank" rel="noreferrer">Ver en Jamendo</a>
        </div>
      )}
    </footer>
  );
}

export default PlayerBar;
