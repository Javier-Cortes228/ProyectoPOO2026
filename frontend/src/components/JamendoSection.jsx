import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, Play, Plus, Heart, ExternalLink } from 'lucide-react';

const QUICK_SEARCHES = ['rock', 'electronic', 'jazz', 'relaxation'];

function JamendoSection({
  resultados,
  activeTrackId,
  currentQuery,
  hasMore,
  playlists,
  favoriteSet,
  onBuscar,
  onPlay,
  onPreload,
  onToggleFavorito,
  onAddToPlaylist,
  onError
}) {
  const [query, setQuery] = useState('');
  const [cargando, setCargando] = useState(false);
  const [cargandoMas, setCargandoMas] = useState(false);
  const [playlistSeleccionada, setPlaylistSeleccionada] = useState('');

  async function submit(event) {
    event.preventDefault();
    await buscar(query);
  }

  async function buscar(valor) {
    const termino = valor.trim();
    if (!termino) {
      return;
    }

    setCargando(true);
    try {
      await onBuscar(termino);
    } catch (error) {
      onError(error.message);
    } finally {
      setCargando(false);
    }
  }

  async function cargarMas() {
    const termino = currentQuery || query.trim();
    if (!termino) {
      return;
    }

    setCargandoMas(true);
    try {
      await onBuscar(termino, true);
    } catch (error) {
      onError(error.message);
    } finally {
      setCargandoMas(false);
    }
  }

  return (
    <section className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <p className="text-secondary text-sm font-medium mb-1">Catálogo Externo</p>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            Descubrir en Jamendo
            <ExternalLink size={20} className="text-textSub" />
          </h2>
        </div>
        <span className="text-sm text-textSub font-medium px-3 py-1 rounded-full bg-surface">{resultados.length} resultados</span>
      </div>

      <div className="glass p-6 rounded-2xl border border-white/5 space-y-6">
        <form onSubmit={submit} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textSub w-5 h-5" />
            <input
              className="w-full bg-background border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors placeholder:text-textSub"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar música independiente (canción, artista, género)..."
            />
          </div>
          <button
            disabled={cargando}
            className="px-8 py-3 bg-secondary hover:bg-secondary/90 text-background font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] disabled:opacity-50 flex items-center justify-center min-w-[120px]"
          >
            {cargando ? <Loader2 className="animate-spin" size={20} /> : 'Buscar'}
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-textSub uppercase tracking-wider font-semibold mr-2">Tendencias:</span>
          {QUICK_SEARCHES.map((termino) => (
            <button
              type="button"
              key={termino}
              onClick={() => {
                setQuery(termino);
                buscar(termino);
              }}
              className="px-4 py-1.5 rounded-full text-sm font-medium bg-surface/50 border border-white/5 text-textSub hover:text-white hover:bg-surface hover:border-secondary/30 transition-all"
            >
              {termino}
            </button>
          ))}
        </div>
      </div>

      {resultados.length > 0 && (
        <div className="glass p-4 rounded-xl border border-white/5 flex items-center gap-4 sticky top-24 z-10">
           <span className="text-sm font-medium text-textSub">Acción por lote:</span>
           <select
             value={playlistSeleccionada}
             onChange={(event) => setPlaylistSeleccionada(event.target.value)}
             className="bg-background border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary"
           >
            <option value="">Selecciona playlist destino...</option>
            {(playlists || []).map((playlist) => (
              <option key={playlist.id} value={playlist.id}>{playlist.nombre}</option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {resultados.map((track) => (
          <motion.article
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`group relative glass rounded-xl p-4 flex gap-4 overflow-hidden border-2 transition-colors ${activeTrackId === track.id ? 'border-secondary bg-secondary/5' : 'border-transparent hover:border-white/10'}`}
            key={track.id}
            onFocus={() => onPreload(track)}
            onMouseEnter={() => onPreload(track)}
          >
            {activeTrackId === track.id && (
              <div className="absolute inset-0 bg-secondary/10 pointer-events-none" />
            )}

            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => onPlay(track)}>
              <img src={track.imagenUrl} alt={track.titulo} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <Play size={24} className="text-white fill-current" />
              </div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <strong className="block text-base font-semibold truncate text-white cursor-pointer hover:text-secondary transition-colors" onClick={() => onPlay(track)}>{track.titulo}</strong>
              <small className="block text-sm text-textSub truncate mt-0.5">{track.artista || 'Artista Jamendo'}</small>
              <em className="block text-xs text-textSub/70 mt-1 not-italic">
                {[track.album || 'Single', track.genero, formatDuration(track.duracionSegundos)].filter(Boolean).join(' • ')}
              </em>
            </div>

            <div className="flex flex-col justify-between items-end z-10">
               <button
                type="button"
                className={`p-2 rounded-full transition-all ${favoriteSet?.has(track.id) ? 'text-secondary bg-secondary/10' : 'text-textSub hover:bg-white/10'}`}
                title={favoriteSet?.has(track.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                onClick={() => onToggleFavorito(track)}
              >
                <Heart size={18} className={favoriteSet?.has(track.id) ? 'fill-current' : ''} />
              </button>

              <button
                type="button"
                className="p-2 rounded-full bg-surface text-textSub hover:text-white hover:bg-primary/20 hover:text-primary transition-all disabled:opacity-30 disabled:hover:bg-surface disabled:hover:text-textSub"
                disabled={!playlistSeleccionada}
                title="Agregar a playlist seleccionada"
                onClick={() => onAddToPlaylist(track, playlistSeleccionada)}
              >
                <Plus size={18} />
              </button>
            </div>
          </motion.article>
        ))}
      </div>

      {resultados.length === 0 && (
        <div className="p-12 rounded-2xl border border-dashed border-white/20 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-4">
            <Search size={32} className="text-textSub" />
          </div>
          <p className="text-lg font-medium text-white mb-2">Comienza tu búsqueda</p>
          <p className="text-textSub max-w-md">Busca música en Jamendo para reproducir contenido online de forma gratuita sin modificar tu catálogo local.</p>
        </div>
      )}

      {resultados.length > 0 && hasMore && (
        <div className="flex justify-center mt-8">
          <button
            className="px-8 py-3 bg-surface/50 hover:bg-surface text-white font-medium rounded-full border border-white/10 transition-all flex items-center gap-2"
            type="button"
            disabled={cargandoMas}
            onClick={cargarMas}
          >
            {cargandoMas ? (
              <><Loader2 size={18} className="animate-spin" /> Cargando...</>
            ) : (
              'Cargar más resultados'
            )}
          </button>
        </div>
      )}
    </section>
  );
}

function formatDuration(seconds) {
  const safeSeconds = Number.isFinite(seconds) ? seconds : 0;
  const minutes = Math.floor(safeSeconds / 60);
  const remaining = String(safeSeconds % 60).padStart(2, '0');
  return `${minutes}:${remaining}`;
}

export default JamendoSection;
