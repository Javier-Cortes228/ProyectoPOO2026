import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LogOut, Bell } from 'lucide-react';
import JamendoSection from './JamendoSection.jsx';
import PlaylistView from './PlaylistView.jsx';
import TrackCard from './TrackCard.jsx';

function MainContent({
  activeView,
  activePlaylist,
  catalogo,
  favoritos,
  historial,
  recomendaciones,
  favoritosIds,
  mensaje,
  pistaActual,
  jamendoActual,
  jamendoResultados,
  jamendoQuery,
  jamendoHasMore,
  onClearMessage,
  onError,
  onPlayLocal,
  onPlayJamendo,
  onPreloadJamendo,
  onToggleFavorito,
  onAddMusic,
  onRemoveFromPlaylist,
  onDeletePlaylist,
  onBuscarJamendo,
  playlists,
  onAddJamendoToPlaylist,
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

  let content;

  if (activeView.type === 'playlist' && activePlaylist) {
    content = (
      <PlaylistView
        playlist={activePlaylist}
        favoriteSet={favoriteSet}
        pistaActual={pistaActual}
        onPlay={onPlayLocal}
        onAddMusic={onAddMusic}
        onRemove={onRemoveFromPlaylist}
        onDeletePlaylist={onDeletePlaylist}
        onToggleFavorito={onToggleFavorito}
      />
    );
  } else if (activeView.type === 'favorites') {
    content = (
      <LibrarySection
        title="Tus favoritos"
        subtitle="Contenido marcado con corazón"
        items={favoritos.filter((item) => coincideConFiltro(item, busqueda.trim().toLowerCase()))}
        favoriteSet={favoriteSet}
        pistaActual={pistaActual}
        onPlay={onPlayLocal}
        onToggleFavorito={onToggleFavorito}
      />
    );
  } else if (activeView.type === 'history') {
    content = (
      <LibrarySection
        title="Historial reciente"
        subtitle="Últimas canciones reproducidas"
        items={(historial || []).filter((item) => coincideConFiltro(item, busqueda.trim().toLowerCase()))}
        favoriteSet={favoriteSet}
        pistaActual={pistaActual}
        jamendoActual={jamendoActual}
        onPlay={onPlayLocal}
        onToggleFavorito={onToggleFavorito}
        emptyMessage="Aún no hay reproducciones registradas."
      />
    );
  } else if (activeView.type === 'recommendations') {
    content = (
      <LibrarySection
        title="Recomendaciones para ti"
        subtitle="Descubre nuevos sonidos"
        items={(recomendaciones || []).filter((item) => coincideConFiltro(item, busqueda.trim().toLowerCase()))}
        favoriteSet={favoriteSet}
        pistaActual={pistaActual}
        jamendoActual={jamendoActual}
        onPlay={onPlayLocal}
        onToggleFavorito={onToggleFavorito}
        emptyMessage="Reproduce canciones para generar recomendaciones."
      />
    );
  } else {
    content = (
      <div className="space-y-8">
        <HeroStats total={catalogo.length} favoritos={favoritos.length} />
        <CatalogSwitch active={catalogoActivo} onChange={setCatalogoActivo} />

        {catalogoActivo === 'local' ? (
          <LibrarySection
            title="Catálogo Local"
            subtitle="Tu biblioteca personal"
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
            currentQuery={jamendoQuery}
            hasMore={jamendoHasMore}
            onBuscar={onBuscarJamendo}
            onPlay={onPlayJamendo}
            onPreload={onPreloadJamendo}
            playlists={playlists}
            favoriteSet={favoriteSet}
            onToggleFavorito={onToggleFavorito}
            onAddToPlaylist={onAddJamendoToPlaylist}
            onError={onError}
          />
        )}
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col h-full bg-background overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

      <Topbar busqueda={busqueda} setBusqueda={setBusqueda} onLogout={onLogout} />

      <div className="flex-1 overflow-y-auto p-6 md:p-8 z-10">
        <AnimatePresence>
          {mensaje && <Message mensaje={mensaje} onClear={onClearMessage} />}
        </AnimatePresence>

        <motion.div
          key={activeView.type + (activePlaylist?.id || '') + catalogoActivo}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {content}
        </motion.div>
      </div>
    </main>
  );
}

function Topbar({ busqueda, setBusqueda, onLogout }) {
  return (
    <header className="h-20 px-8 flex items-center justify-between glass border-b border-white/5 z-20 sticky top-0">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textSub w-5 h-5" />
        <input
          className="w-full bg-surface/50 border border-white/10 rounded-full pl-12 pr-4 py-2.5 text-sm text-textMain focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-textSub"
          value={busqueda}
          onChange={(event) => setBusqueda(event.target.value)}
          placeholder="Buscar por canción o artista..."
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2.5 rounded-full bg-surface/50 text-textSub hover:text-white hover:bg-surface transition-colors border border-white/5">
          <Bell size={18} />
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface/50 text-textSub hover:text-white hover:bg-red-500/20 hover:border-red-500/30 transition-colors border border-white/5"
          onClick={onLogout}
        >
          <span className="text-sm font-medium">Salir</span>
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}

function CatalogSwitch({ active, onChange }) {
  return (
    <div className="flex p-1 bg-surface/50 rounded-xl border border-white/5 w-fit mb-8" role="tablist">
      <button
        type="button"
        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${active === 'local' ? 'bg-primary text-white shadow-glow' : 'text-textSub hover:text-white'}`}
        onClick={() => onChange('local')}
      >
        Catálogo Local
      </button>
      <button
        type="button"
        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${active === 'online' ? 'bg-secondary text-background shadow-glow' : 'text-textSub hover:text-white'}`}
        onClick={() => onChange('online')}
      >
        Descubrir Jamendo
      </button>
    </div>
  );
}

function Message({ mensaje, onClear }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center justify-between p-4 mb-6 rounded-xl bg-primary/10 border border-primary/20 text-primary-light backdrop-blur-md"
    >
      <span className="text-sm font-medium">{mensaje}</span>
      <button onClick={onClear} className="text-primary hover:text-white transition-colors text-sm font-semibold">Cerrar</button>
    </motion.div>
  );
}

function HeroStats({ total, favoritos }) {
  return (
    <section className="relative overflow-hidden rounded-2xl p-8 mb-8 bg-gradient-to-br from-surface to-background border border-white/10 shadow-soft">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <p className="text-secondary text-sm font-bold tracking-wider uppercase mb-2">Plataforma Premium</p>
          <h1 className="text-3xl md:text-4xl font-bold max-w-xl leading-tight text-white">Tu universo musical en un solo lugar.</h1>
        </div>
        <div className="flex gap-4">
          <div className="glass px-6 py-4 rounded-xl border border-white/10 text-center">
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{total}</p>
            <p className="text-xs text-textSub uppercase tracking-wider mt-1">Pistas</p>
          </div>
          <div className="glass px-6 py-4 rounded-xl border border-white/10 text-center">
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">{favoritos}</p>
            <p className="text-xs text-textSub uppercase tracking-wider mt-1">Favoritos</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function LibrarySection({
  title,
  subtitle,
  items,
  favoriteSet,
  pistaActual,
  jamendoActual,
  onPlay,
  onToggleFavorito,
  emptyMessage = 'No hay contenido para mostrar.'
}) {
  return (
    <section className="mb-12">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-textSub text-sm font-medium mb-1">{subtitle}</p>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        <span className="text-sm text-textSub font-medium px-3 py-1 rounded-full bg-surface">{items.length} resultados</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <TrackCard
            key={item.historialId || item.id}
            item={item}
            active={pistaActual?.id === item.id || jamendoActual?.id === item.id}
            favorite={favoriteSet.has(item.id)}
            onPlay={() => onPlay(item)}
            onToggleFavorite={() => onToggleFavorito(item)}
          />
        ))}
      </div>

      {items.length === 0 && (
        <div className="p-8 rounded-2xl border border-dashed border-white/20 text-center text-textSub">
          {emptyMessage}
        </div>
      )}
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
