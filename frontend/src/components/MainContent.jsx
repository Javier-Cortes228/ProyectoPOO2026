import { useMemo, useState } from 'react';
import JamendoSection from './JamendoSection.jsx';
import PlaylistView from './PlaylistView.jsx';
import TrackCard from './TrackCard.jsx';

function MainContent({
  activeView,
  activePlaylist,
  catalogo,
  favoritos,
  favoritosIds,
  mensaje,
  pistaActual,
  jamendoActual,
  jamendoResultados,
  onClearMessage,
  onError,
  onPlayLocal,
  onPlayJamendo,
  onToggleFavorito,
  onAddMusic,
  onBuscarJamendo,
  onLogout
}) {
  const [busqueda, setBusqueda] = useState('');
  const [catalogoActivo, setCatalogoActivo] = useState('local');

  const catalogoFiltrado = useMemo(() => {
    const filtro = busqueda.trim().toLowerCase();
    if (!filtro) {
      return catalogo;
    }

    return catalogo.filter((item) => coincideConFiltro(item, filtro));
  }, [catalogo, busqueda]);

  const favoriteSet = useMemo(() => new Set(favoritosIds), [favoritosIds]);

  if (activeView.type === 'playlist' && activePlaylist) {
    return (
      <main className="content">
        <Topbar busqueda={busqueda} setBusqueda={setBusqueda} onLogout={onLogout} />
        <Message mensaje={mensaje} onClear={onClearMessage} />
        <PlaylistView
          playlist={activePlaylist}
          favoriteSet={favoriteSet}
          pistaActual={pistaActual}
          onPlay={onPlayLocal}
          onAddMusic={onAddMusic}
          onToggleFavorito={onToggleFavorito}
        />
      </main>
    );
  }

  if (activeView.type === 'favorites') {
    return (
      <main className="content">
        <Topbar busqueda={busqueda} setBusqueda={setBusqueda} onLogout={onLogout} />
        <Message mensaje={mensaje} onClear={onClearMessage} />
        <LibrarySection
          title="Tus favoritos"
          subtitle="Contenido marcado con corazon"
          items={favoritos.filter((item) => coincideConFiltro(item, busqueda.trim().toLowerCase()))}
          favoriteSet={favoriteSet}
          pistaActual={pistaActual}
          onPlay={onPlayLocal}
          onToggleFavorito={onToggleFavorito}
        />
      </main>
    );
  }

  return (
    <main className="content">
      <Topbar busqueda={busqueda} setBusqueda={setBusqueda} onLogout={onLogout} />
      <Message mensaje={mensaje} onClear={onClearMessage} />
      <HeroStats total={catalogo.length} favoritos={favoritos.length} />
      <CatalogSwitch active={catalogoActivo} onChange={setCatalogoActivo} />

      {catalogoActivo === 'local' ? (
        <LibrarySection
          title="Catalogo local BanduMusic"
          subtitle="Biblioteca local persistida"
          items={catalogoFiltrado}
          favoriteSet={favoriteSet}
          pistaActual={pistaActual}
          onPlay={onPlayLocal}
          onToggleFavorito={onToggleFavorito}
        />
      ) : (
        <JamendoSection
          resultados={jamendoResultados}
          activeTrackId={jamendoActual?.id}
          onBuscar={onBuscarJamendo}
          onPlay={onPlayJamendo}
          onError={onError}
        />
      )}
    </main>
  );
}

function Topbar({ busqueda, setBusqueda, onLogout }) {
  return (
    <header className="topbar glass-panel">
      <input
        className="search-input"
        value={busqueda}
        onChange={(event) => setBusqueda(event.target.value)}
        placeholder="Buscar por nombre o artista"
      />
      <button className="ghost-button" onClick={onLogout}>Salir</button>
    </header>
  );
}

function CatalogSwitch({ active, onChange }) {
  return (
    <div className="catalog-switch glass-panel" role="tablist" aria-label="Selector de catalogo">
      <button type="button" className={active === 'local' ? 'active' : ''} onClick={() => onChange('local')}>
        Catalogo local
      </button>
      <button type="button" className={active === 'online' ? 'active' : ''} onClick={() => onChange('online')}>
        Catalogo online
      </button>
    </div>
  );
}

function Message({ mensaje, onClear }) {
  if (!mensaje) {
    return null;
  }

  return (
    <div className="status-message">
      <span>{mensaje}</span>
      <button onClick={onClear}>Cerrar</button>
    </div>
  );
}

function HeroStats({ total, favoritos }) {
  return (
    <section className="hero-band glass-panel">
      <div>
        <p className="eyebrow">Experiencia premium</p>
        <h1>Tu biblioteca musical, playlists y favoritos en un solo lugar.</h1>
      </div>
      <div className="hero-metrics">
        <span><strong>{total}</strong> contenidos</span>
        <span><strong>{favoritos}</strong> favoritos</span>
      </div>
    </section>
  );
}

function LibrarySection({ title, subtitle, items, favoriteSet, pistaActual, onPlay, onToggleFavorito }) {
  return (
    <section className="section-block">
      <div className="section-heading">
        <div>
          <p>{subtitle}</p>
          <h2>{title}</h2>
        </div>
        <span>{items.length} resultados</span>
      </div>

      <div className="track-grid">
        {items.map((item) => (
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

      {items.length === 0 && <p className="empty-state">No hay contenido para mostrar.</p>}
    </section>
  );
}

function coincideConFiltro(item, filtro) {
  if (!filtro) {
    return true;
  }

  const titulo = item.titulo || '';
  const creador = item.artista || item.anfitrion || '';
  return titulo.toLowerCase().includes(filtro) || creador.toLowerCase().includes(filtro);
}

export default MainContent;
