import { motion, AnimatePresence } from 'framer-motion';
import { Play, SkipBack, SkipForward, ExternalLink, Music } from 'lucide-react';

function PlayerBar({ pista, jamendoTrack, queue, onPlayLocal }) {
  const current = pista || jamendoTrack;
  const currentIndex = current ? queue.findIndex((item) => item.id === current.id) : -1;

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

  if (!current) {
    return (
      <footer className="h-24 glass border-t border-white/5 px-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-4 opacity-50">
          <div className="w-14 h-14 rounded-lg bg-surface flex items-center justify-center">
            <Music size={24} className="text-textSub" />
          </div>
          <div>
            <strong className="block text-white text-sm font-medium">Selecciona contenido</strong>
            <small className="text-textSub text-xs">Catálogo local o Jamendo</small>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="h-24 glass border-t border-white/10 px-6 flex flex-col md:flex-row items-center justify-between z-50 shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-4 w-full md:w-1/3 mb-2 md:mb-0">
         <div className="relative w-14 h-14 rounded-lg bg-surface flex items-center justify-center overflow-hidden flex-shrink-0">
           {jamendoTrack?.imagenUrl ? (
             <img src={jamendoTrack.imagenUrl} alt="Cover" className="w-full h-full object-cover" />
           ) : (
             <Music size={24} className="text-primary" />
           )}
           <div className="absolute inset-0 bg-primary/20 animate-pulse pointer-events-none mix-blend-overlay" />
         </div>
        <div className="overflow-hidden">
          <strong className="block text-white text-sm font-semibold truncate">{pista?.titulo || jamendoTrack?.titulo}</strong>
          <small className="block text-textSub text-xs truncate mt-0.5">{pista ? (pista.artista || pista.anfitrion) : jamendoTrack?.artista}</small>
        </div>
      </div>

      <div className="flex-1 w-full md:w-1/3 flex flex-col items-center justify-center">
        <div className="flex items-center gap-6">
          <button onClick={previous} disabled={currentIndex <= 0} className="text-textSub hover:text-white disabled:opacity-30 disabled:hover:text-textSub transition-colors">
            <SkipBack size={24} />
          </button>

          <div className="w-full max-w-[400px]">
             {pista && (
               <audio className="w-full h-10 filter-audio" controls autoPlay src={`/audio/${pista.id}.mp3`} />
             )}
             {jamendoTrack && (
               <audio key={jamendoTrack.id} className="w-full h-10 filter-audio" controls autoPlay preload="auto" src={jamendoTrack.audioUrl} />
             )}
          </div>

          <button onClick={next} disabled={currentIndex < 0 || currentIndex >= queue.length - 1} className="text-textSub hover:text-white disabled:opacity-30 disabled:hover:text-textSub transition-colors">
            <SkipForward size={24} />
          </button>
        </div>
      </div>

      <div className="w-full md:w-1/3 flex justify-end">
        {jamendoTrack && (
          <a
            href={jamendoTrack.jamendoUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors text-sm font-medium"
          >
            Ver en Jamendo
            <ExternalLink size={16} />
          </a>
        )}
      </div>
    </footer>
  );
}

export default PlayerBar;
