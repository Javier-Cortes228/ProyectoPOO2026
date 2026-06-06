import { useEffect, useRef, useState } from 'react';
import {
  ExternalLink,
  Music,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX
} from 'lucide-react';

function PlayerBar({ pista, jamendoTrack, queue, onPlayLocal }) {
  const audioRef = useRef(null);
  const current = pista || jamendoTrack;
  const currentIndex = current ? queue.findIndex((item) => item.id === current.id) : -1;
  const [isPlaying, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setMuted] = useState(false);

  const audioSrc = pista ? `/audio/${pista.id}.mp3` : jamendoTrack?.audioUrl || '';
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const effectiveVolume = isMuted ? 0 : volume;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.volume = effectiveVolume;
  }, [effectiveVolume]);

  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setPlaying(Boolean(current));
  }, [current?.id]);

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

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (audio.paused) {
      audio.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else {
      audio.pause();
      setPlaying(false);
    }
  }

  function seek(event) {
    const audio = audioRef.current;
    const value = Number(event.target.value);
    if (!audio || !Number.isFinite(value)) {
      return;
    }

    audio.currentTime = value;
    setCurrentTime(value);
  }

  function changeVolume(event) {
    const nextVolume = Number(event.target.value);
    if (!Number.isFinite(nextVolume)) {
      return;
    }
    setVolume(nextVolume);
    setMuted(nextVolume === 0);
  }

  function toggleMute() {
    setMuted((actual) => !actual);
  }

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  if (!current) {
    return (
      <footer className="h-28 glass border-t border-white/5 px-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-4 opacity-50">
          <div className="w-14 h-14 rounded-lg bg-surface flex items-center justify-center">
            <Music size={24} className="text-textSub" />
          </div>
          <div>
            <strong className="block text-white text-sm font-medium">Selecciona contenido</strong>
            <small className="text-textSub text-xs">BanduMusic Hub o Jamendo</small>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="h-28 glass border-t border-white/10 px-5 md:px-6 grid grid-cols-1 md:grid-cols-[minmax(180px,1fr)_minmax(320px,1.4fr)_minmax(180px,1fr)] items-center gap-4 z-50 shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.5)]">
      <audio
        ref={audioRef}
        key={audioSrc}
        src={audioSrc}
        autoPlay
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || current.duracionSegundos || 0)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime || 0)}
        onEnded={next}
      />

      <div className="flex items-center gap-4 min-w-0">
        <div className="relative w-14 h-14 rounded-lg bg-surface flex items-center justify-center overflow-hidden flex-shrink-0 border border-white/10">
          {jamendoTrack?.imagenUrl ? (
            <img src={jamendoTrack.imagenUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <Music size={24} className="text-primary" />
          )}
          <div className="absolute inset-0 bg-primary/10 pointer-events-none mix-blend-overlay" />
        </div>
        <div className="overflow-hidden">
          <strong className="block text-white text-sm font-semibold truncate">{current.titulo}</strong>
          <small className="block text-textSub text-xs truncate mt-0.5">{current.artista || current.anfitrion || 'Sin autor'}</small>
          {jamendoTrack && (
            <a href={jamendoTrack.jamendoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] text-secondary hover:text-white transition-colors mt-1">
              Ver en Jamendo <ExternalLink size={11} />
            </a>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-2 min-w-0">
        <div className="flex items-center gap-5">
          <button onClick={previous} disabled={currentIndex <= 0} className="text-textSub hover:text-white disabled:opacity-30 disabled:hover:text-textSub transition-colors">
            <SkipBack size={22} />
          </button>

          <button
            onClick={togglePlay}
            className="w-11 h-11 rounded-full bg-white text-background flex items-center justify-center hover:scale-105 transition-transform shadow-glow"
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-0.5" />}
          </button>

          <button onClick={next} disabled={currentIndex < 0 || currentIndex >= queue.length - 1} className="text-textSub hover:text-white disabled:opacity-30 disabled:hover:text-textSub transition-colors">
            <SkipForward size={22} />
          </button>
        </div>

        <div className="w-full flex items-center gap-3">
          <span className="text-[11px] tabular-nums text-textSub w-10 text-right">{formatTime(currentTime)}</span>
          <div className="relative flex-1 h-2 flex items-center">
            <div className="absolute left-0 right-0 h-1 rounded-full bg-white/10" />
            <div className="absolute left-0 h-1 rounded-full bg-gradient-to-r from-primary to-secondary pointer-events-none" style={{ width: `${progress}%` }} />
            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={Math.min(currentTime, duration || currentTime)}
              onChange={seek}
              className="relative w-full h-2 opacity-0 cursor-pointer"
              aria-label="Progreso de reproduccion"
            />
          </div>
          <span className="text-[11px] tabular-nums text-textSub w-10">{formatTime(duration || current.duracionSegundos || 0)}</span>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-end gap-3">
        <button onClick={toggleMute} className="text-textSub hover:text-white transition-colors" aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}>
          <VolumeIcon size={20} />
        </button>
        <div className="relative w-28 h-2 flex items-center">
          <div className="absolute left-0 right-0 h-1 rounded-full bg-white/10" />
          <div className="absolute left-0 h-1 rounded-full bg-secondary pointer-events-none" style={{ width: `${effectiveVolume * 100}%` }} />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={effectiveVolume}
            onChange={changeVolume}
            className="relative w-full h-2 opacity-0 cursor-pointer"
            aria-label="Volumen"
          />
        </div>
      </div>
    </footer>
  );
}

function formatTime(seconds) {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  const minutes = Math.floor(safeSeconds / 60);
  const remaining = String(safeSeconds % 60).padStart(2, '0');
  return `${minutes}:${remaining}`;
}

export default PlayerBar;
