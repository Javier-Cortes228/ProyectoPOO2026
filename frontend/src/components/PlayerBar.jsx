import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Music, Pause, Play, SkipBack, SkipForward, Volume1, Volume2, VolumeX } from 'lucide-react';

function PlayerBar({ pista, jamendoTrack, queue, onPlayLocal }) {
    const audioRef = useRef(null);
    const current = pista || jamendoTrack;
    const currentIndex = current ? queue.findIndex((item) => item.id === current.id) : -1;
    const [isPlaying, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.85);
    const [isMuted, setMuted] = useState(false);

    // Estados para el tooltip interactivo
    const [hoverProgress, setHoverProgress] = useState(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const progressContainerRef = useRef(null);

    const audioSrc = pista ? `/audio/${pista.id}.mp3` : jamendoTrack?.audioUrl || '';
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
    const effectiveVolume = isMuted ? 0 : volume;

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.volume = effectiveVolume;
    }, [effectiveVolume]);

    useEffect(() => {
        setCurrentTime(0);
        setDuration(0);
        setPlaying(Boolean(current));
    }, [current?.id]);

    function previous() { if (currentIndex > 0) onPlayLocal(queue[currentIndex - 1]); }
    function next() { if (currentIndex >= 0 && currentIndex < queue.length - 1) onPlayLocal(queue[currentIndex + 1]); }

    function togglePlay() {
        const audio = audioRef.current;
        if (!audio) return;
        if (audio.paused) {
            audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
        } else {
            audio.pause();
            setPlaying(false);
        }
    }

    function seek(event) {
        const audio = audioRef.current;
        const value = Number(event.target.value);
        if (!audio || !Number.isFinite(value)) return;
        audio.currentTime = value;
        setCurrentTime(value);
    }

    function changeVolume(event) {
        const nextVolume = Number(event.target.value);
        if (!Number.isFinite(nextVolume)) return;
        setVolume(nextVolume);
        setMuted(nextVolume === 0);
    }

    function toggleMute() { setMuted((actual) => !actual); }

    // Cálculo matemático del seguimiento del mouse para el Tooltip
    function handleMouseMove(e) {
        if (!progressContainerRef.current) return;
        const rect = progressContainerRef.current.getBoundingClientRect();
        let x = e.clientX - rect.left;
        x = Math.max(0, Math.min(x, rect.width));
        setHoverProgress(x / rect.width);
    }

    const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

    if (!current) {
        return (
            <footer className="h-28 shrink-0 glass border-t border-white/5 px-6 flex items-center justify-between z-50">
                <div className="flex items-center gap-4 opacity-50">
                    <div className="w-14 h-14 rounded-lg bg-surface flex items-center justify-center">
                        <Music size={24} className="text-textSub" />
                    </div>
                    <div>
                        <strong className="block text-white text-sm font-medium">Selecciona contenido</strong>
                        <small className="text-textSub text-xs">BanduMusic o Jamendo</small>
                    </div>
                </div>
            </footer>
        );
    }

    return (
        <footer className="h-28 shrink-0 glass border-t border-white/10 px-5 md:px-6 grid grid-cols-1 md:grid-cols-[minmax(180px,1fr)_minmax(320px,1.4fr)_minmax(180px,1fr)] items-center gap-4 z-50 shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.5)]">
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
                </div>
                <div className="overflow-hidden">
                    <strong className="block text-white text-sm font-semibold truncate">{current.titulo}</strong>
                    <small className="block text-textSub text-xs truncate mt-0.5">{current.artista || current.anfitrion || 'Sin autor'}</small>
                    {jamendoTrack && (
                        <a href={jamendoTrack.jamendoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] text-[#22D3EE] hover:text-white transition-colors mt-1">
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
                    >
                        {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-0.5" />}
                    </button>
                    <button onClick={next} disabled={currentIndex < 0 || currentIndex >= queue.length - 1} className="text-textSub hover:text-white disabled:opacity-30 disabled:hover:text-textSub transition-colors">
                        <SkipForward size={22} />
                    </button>
                </div>

                {/* BARRA DE PROGRESO INTERACTIVA */}
                <div className="w-full flex items-center gap-3">
                    <span className="text-[11px] tabular-nums text-primary w-10 text-right">{formatTime(currentTime)}</span>

                    <div
                        className="relative flex-1 h-4 flex items-center group cursor-pointer"
                        ref={progressContainerRef}
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        onMouseMove={handleMouseMove}
                    >
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            step="0.1"
                            value={Math.min(currentTime, duration || currentTime)}
                            onChange={seek}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        />

                        {/* Base (Neutro) */}
                        <div className="absolute left-0 right-0 h-1 bg-white/20 rounded-full transition-all group-hover:h-1.5" />

                        {/* Progreso Activo (Blanco por defecto, se vuelve primary al pasar el puntero) */}
                        <div className="absolute left-0 h-1 bg-white rounded-full pointer-events-none transition-all group-hover:bg-primary group-hover:h-1.5 flex items-center justify-end" style={{ width: `${progress}%` }}>
                            <div className="w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 translate-x-1.5" />
                        </div>

                        {/* Tooltip con los segundos exactos */}
                        <AnimatePresence>
                            {showTooltip && hoverProgress !== null && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute top-[-30px] -translate-x-1/2 bg-surface border border-white/10 px-2 py-1 rounded shadow-lg text-[10px] text-white font-medium pointer-events-none z-50 whitespace-nowrap"
                                    style={{ left: `${hoverProgress * 100}%` }}
                                >
                                    {formatTime(hoverProgress * (duration || 0))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>
                    <span className="text-[11px] tabular-nums text-primary w-10">{formatTime(duration || current.duracionSegundos || 0)}</span>
                </div>
            </div>

            <div className="hidden md:flex items-center justify-end gap-3 group">
                <button onClick={toggleMute} className="text-textSub hover:text-white transition-colors" aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}>
                    <VolumeIcon size={20} />
                </button>

                {/* BARRA DE VOLUMEN INTERACTIVA */}
                <div className="relative w-28 h-4 flex items-center hover-container">
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={effectiveVolume}
                        onChange={changeVolume}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 peer"
                    />
                    <div className="absolute left-0 right-0 h-1 bg-white/20 rounded-full peer-hover:h-1.5 transition-all" />
                    <div className="absolute left-0 h-1 bg-white pointer-events-none peer-hover:h-1.5 peer-hover:bg-primary transition-all flex items-center justify-end" style={{ width: `${effectiveVolume * 100}%` }}>
                        <div className="w-3 h-3 bg-white rounded-full shadow-md opacity-0 peer-hover:opacity-100 translate-x-1.5" />
                    </div>
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