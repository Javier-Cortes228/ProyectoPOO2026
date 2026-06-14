import { motion } from 'framer-motion';
import { Plus, Trash2, ListMusic } from 'lucide-react';
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
    <section className="space-y-8">
      <div className="relative glass p-8 rounded-2xl border border-white/10 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="flex items-end gap-6">
            <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-surface to-background border border-white/10 flex items-center justify-center shadow-lg">
              <ListMusic size={48} className="text-primary/50" />
            </div>
            <div className="pb-2">
              <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">PLAYLIST PROPIA</p>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{playlist.nombre}</h1>
              <span className="text-sm text-textSub font-medium">{contenidos.length} pistas en esta lista</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all shadow-glow"
              onClick={onAddMusic}
            >
              <Plus size={18} />
              Agregar Música
            </button>
            <button
              className="p-3 bg-surface/50 hover:bg-red-500/20 text-textSub hover:text-red-400 border border-white/5 hover:border-red-500/30 rounded-xl transition-all"
              onClick={onDeletePlaylist}
              title="Eliminar playlist"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
        <div className="p-12 glass rounded-2xl border border-dashed border-white/20 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-4">
            <ListMusic size={32} className="text-textSub" />
          </div>
          <p className="text-lg font-medium text-white mb-2">Playlist vacía</p>
          <p className="text-textSub max-w-md mb-6">Esta playlist aún no tiene contenido. Comienza agregando tus canciones o podcasts favoritos.</p>
          <button
            className="flex items-center gap-2 px-6 py-2 bg-surface hover:bg-white/10 text-white font-medium rounded-full transition-colors border border-white/5"
            onClick={onAddMusic}
          >
            <Plus size={18} />
            Agregar ahora
          </button>
        </div>
      )}
    </section>
  );
}

export default PlaylistView;
