function Sidebar({
  usuario,
  playlists,
  favoritos,
  activeView,
  onGoHome,
  onOpenPlaylist,
  onOpenFavorites,
  onOpenHistory,
  onOpenRecommendations,
  onCreatePlaylist,
  onPlay
}) {
  return (
    <aside className="sidebar glass-panel">
      <div className="brand-block">
        <span className="brand-mark">B</span>
        <div>
          <h2>BanduMusic</h2>
          <p>{usuario.nombreUsuario}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button className={activeView.type === 'home' ? 'active' : ''} onClick={onGoHome}>
          Inicio
        </button>
        <button className={activeView.type === 'favorites' ? 'active' : ''} onClick={onOpenFavorites}>
          Tus favoritos
          <small>{favoritos.length}</small>
        </button>
        <button className={activeView.type === 'history' ? 'active' : ''} onClick={onOpenHistory}>
          Historial
        </button>
        <button className={activeView.type === 'recommendations' ? 'active' : ''} onClick={onOpenRecommendations}>
          Recomendaciones
        </button>
      </nav>

      <button className="create-playlist-button" onClick={onCreatePlaylist}>
        Crear nueva playlist
      </button>

      <section className="sidebar-section">
        <div className="sidebar-section-title">
          <span>Playlists</span>
          <small>{playlists.length}</small>
        </div>

        <div className="playlist-list">
          {playlists.map((playlist) => (
            <button
              key={playlist.id}
              className={activeView.type === 'playlist' && activeView.playlistId === playlist.id ? 'active' : ''}
              onClick={() => onOpenPlaylist(playlist.id)}
            >
              <span>{playlist.nombre}</span>
              <small>{(playlist.contenidos || []).length} pistas</small>
            </button>
          ))}
        </div>
      </section>

      <section className="sidebar-section favorites-mini">
        <div className="sidebar-section-title">
          <span>Tus favoritos</span>
          <small>{favoritos.length}</small>
        </div>

        <div className="favorite-list">
          {favoritos.slice(0, 6).map((item) => (
            <button key={item.id} onClick={() => onPlay(item)}>
              <strong>{item.titulo}</strong>
              <small>{item.artista || item.anfitrion || 'Sin autor'}</small>
            </button>
          ))}
          {favoritos.length === 0 && <p className="empty-note">Marca contenido con favoritos.</p>}
        </div>
      </section>
    </aside>
  );
}

export default Sidebar;
