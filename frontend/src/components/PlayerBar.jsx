import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Music, Pause, Play, SkipBack, SkipForward, Volume1, Volume2, VolumeX, Plus, X, Search, Check, Heart } from 'lucide-react';
import CreatePlaylistModal from './CreatePlaylistModal.jsx';

function PlayerBar({ pista, jamendoTrack, queue, onPlayLocal, playlists, favoritosIds, onToggleFavorito, onTogglePlaylist, onCreatePlaylist, isShuffle, activePlaylist, setGlobalIsPlaying }) {
    const audioRef = useRef(null);
    const current = pista || jamendoTrack;
    const currentIndex = current ? queue.findIndex((item) => item.id === current.id) : -1;

    const [isPlaying, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const [volume, setVolume] = useState(() => {
        const savedVol = localStorage.getItem('bandu-volume');
        const parsedVolume = savedVol !== null ? Number(savedVol) : 0.85;
        return Number.isFinite(parsedVolume) ? Math.min(1, Math.max(0, parsedVolume)) : 0.85;
    });
    const [isMuted, setMuted] = useState(false);

    const isInitialRender = useRef(true);

    const [showPopover, setShowPopover] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [draftFavorito, setDraftFavorito] = useState(false);
    const [draftPlaylists, setDraftPlaylists] = useState(new Set());
    const popoverRef = useRef(null);

    const [hoverTime, setHoverTime] = useState(null);
    const [hoverX, setHoverX] = useState(0);
    const [hoverVolume, setHoverVolume] = useState(null);
    const [hoverVolumeX, setHoverVolumeX] = useState(0);

    const audioSrc = pista ? `/audio/${pista.id}.mp3` : jamendoTrack?.audioUrl || '';
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
    const effectiveVolume = isMuted ? 0 : volume;

    const isSaved = current ? (favoritosIds.includes(current.id) || playlists.some(p => p.contenidos?.some(c => c.id === current.id))) : false;

    useEffect(() => {
        if (setGlobalIsPlaying) setGlobalIsPlaying(isPlaying);
    }, [isPlaying, setGlobalIsPlaying]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) setShowPopover(false);
        }
        if (showPopover) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showPopover]);

    useEffect(() => {
        if (showPopover && current) {
            setDraftFavorito(favoritosIds.includes(current.id));
            setDraftPlaylists(new Set(playlists.filter(p => p.contenidos?.some(c => c.id === current.id)).map(p => p.id)));
            setBusqueda('');
        }
    }, [showPopover, current, playlists, favoritosIds]);

    useEffect(() => {
        if (!isInitialRender.current) {
            setCurrentTime(0);
            setDuration(0);
        }
        setShowPopover(false);
    }, [current?.id]);

    useEffect(() => {
        const handleToggle = () => {
            const audio = audioRef.current;
            if (!audio) return;
            if (audio.paused) audio.play().catch(() => {});
            else audio.pause();
        };
        window.addEventListener('bandu-toggle-play', handleToggle);
        return () => window.removeEventListener('bandu-toggle-play', handleToggle);
    }, []);

    useEffect(() => {
        function handleKeyDown(e) {
            if (e.code === 'Space') {
                if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
                e.preventDefault();
                const audio = audioRef.current;
                if (!audio) return;
                if (audio.paused) audio.play().catch(() => {});
                else audio.pause();
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    function previous() { if (currentIndex > 0) onPlayLocal(queue[currentIndex - 1]); }

    function next() {
        if (isShuffle && queue.length > 0) {
            let randomIndex = Math.floor(Math.random() * queue.length);
            if (queue.length > 1 && randomIndex === currentIndex) randomIndex = (randomIndex + 1) % queue.length;
            onPlayLocal(queue[randomIndex]);
        } else {
            if (currentIndex >= 0 && currentIndex < queue.length - 1) onPlayLocal(queue[currentIndex + 1]);
        }
    }

    function togglePlay() {
        const audio = audioRef.current;
        if (!audio) return;
        if (audio.paused) audio.play().catch(() => {});
        else audio.pause();
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
        localStorage.setItem('bandu-volume', nextVolume);

        if (audioRef.current) {
            audioRef.current.volume = nextVolume;
        }
    }

    function toggleMute() { setMuted((actual) => !actual); }

    const handleSavePopover = () => {
        const isCurrentlyFavorito = favoritosIds.includes(current.id);
        if (draftFavorito !== isCurrentlyFavorito) onToggleFavorito(current);

        playlists.forEach(p => {
            const wasInPlaylist = p.contenidos?.some(c => c.id === current.id);
            const isNowInDraft = draftPlaylists.has(p.id);
            if (wasInPlaylist !== isNowInDraft) onTogglePlaylist(p.id, current, wasInPlaylist);
        });
        setShowPopover(false);
    };

    const handleProgressHover = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        setHoverX(x);
        setHoverTime(Math.max(0, Math.min(1, x / rect.width)) * duration);
    };

    const handleProgressLeave = () => setHoverTime(null);

    const handleVolumeHover = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        setHoverVolumeX(x);
        setHoverVolume(Math.max(0, Math.min(1, x / rect.width)));
    };

    const handleVolumeLeave = () => setHoverVolume(null);

    const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

    if (!current) {
        return (
            <footer className="h-28 shrink-0 glass border-t border-white/5 px-6 flex items-center justify-between z-50 relative">
                <div className="flex items-center gap-4 opacity-50">
                    <div className="w-14 h-14 rounded-lg bg-surface flex items-center justify-center">
                        <Music size={24} className="text-textSub" />
                    </div>
                    <div>
                        <strong className="block text-white text-sm font-medium">Comienza a reproducir...</strong>
                        <small className="text-textSub text-xs">BanduMusic o Jamendo</small>
                    </div>
                </div>
            </footer>
        );
    }

    const playlistsFiltradas = busqueda ? playlists.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase())) : playlists;

    return (
        <>
            <footer className="h-28 shrink-0 glass border-t border-white/10 px-5 md:px-6 grid grid-cols-1 md:grid-cols-[minmax(180px,1.2fr)_minmax(320px,1.4fr)_minmax(180px,1.2fr)] items-center gap-4 z-50 shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.5)] relative">
                <audio
                    ref={audioRef}
                    key={audioSrc}
                    src={audioSrc}
                    preload="auto"
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    onLoadedMetadata={(event) => {
                        const audio = event.currentTarget;
                        audio.volume = effectiveVolume;

                        if (isInitialRender.current) {
                            const savedTime = localStorage.getItem('bandu-playback-time');
                            if (savedTime) {
                                audio.currentTime = Number(savedTime);
                                setCurrentTime(Number(savedTime));
                            }
                            isInitialRender.current = false;
                        } else {
                            audio.play().catch(() => setPlaying(false));
                        }
                        setDuration(audio.duration || current.duracionSegundos || 0);
                    }}
                    onTimeUpdate={(event) => {
                        const time = event.currentTarget.currentTime || 0;
                        setCurrentTime(time);
                        localStorage.setItem('bandu-playback-time', time);
                    }}
                    onEnded={next}
                />

                <div className="flex items-center gap-4 min-w-0 pr-4">
                    <div className="relative w-14 h-14 rounded-lg bg-surface flex items-center justify-center overflow-hidden flex-shrink-0 border border-white/10">
                        {jamendoTrack?.imagenUrl ? (
                            <img src={jamendoTrack.imagenUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <Music size={24} className="text-primary" />
                        )}
                    </div>

                    <div className="flex items-center justify-between min-w-0 flex-1">
                        <div className="overflow-hidden min-w-0 pr-4">
                            <div className="flex items-center gap-3">
                                <strong className="block text-white text-sm font-semibold truncate">{current.titulo}</strong>
                                <AudioWaveform isPlaying={isPlaying} />
                            </div>
                            <small className="block text-textSub text-xs truncate mt-0.5">{current.artista || current.anfitrion || 'Sin autor'}</small>
                            {jamendoTrack && (
                                <a href={jamendoTrack.jamendoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] text-[#22D3EE] hover:text-white transition-colors mt-1">
                                    Ver en Jamendo <ExternalLink size={11} />
                                </a>
                            )}
                        </div>

                        <div className="relative shrink-0 flex items-center ml-auto" ref={popoverRef}>
                            <button
                                className={`w-7 h-7 flex items-center justify-center rounded-full border-2 transition-all shadow-[0_0_10px_rgba(34,211,238,0.2)] ${isSaved ? 'bg-[#22D3EE] border-[#22D3EE] text-background hover:bg-[#22D3EE]/90' : 'border-[#22D3EE] text-[#22D3EE] hover:bg-[#22D3EE] hover:text-background'}`}
                                onClick={() => setShowPopover(!showPopover)}
                                title="Agregar a playlist"
                            >
                                <AnimatePresence mode="wait">
                                    {isSaved ? (
                                        <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.15 }}>
                                            <Check size={14} strokeWidth={2.5} />
                                        </motion.div>
                                    ) : (
                                        <motion.div key="plus" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.15 }}>
                                            <Plus size={14} strokeWidth={2.5} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>

                            <AnimatePresence>
                                {showPopover && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="absolute bottom-[calc(100%+16px)] left-0 w-72 bg-surface/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-[100] flex flex-col overflow-hidden"
                                    >
                                        <div className="p-4 border-b border-white/5 flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-white">Agregar a playlist</h3>
                                            <button onClick={() => setShowPopover(false)} className="text-textSub hover:text-white transition-colors"><X size={16}/></button>
                                        </div>
                                        <div className="p-3">
                                            <div className="relative mb-2">
                                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-textSub w-4 h-4" />
                                                <input
                                                    className="w-full bg-background/50 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#22D3EE] transition-colors"
                                                    placeholder="Busca una playlist..."
                                                    value={busqueda}
                                                    onChange={e => setBusqueda(e.target.value)}
                                                />
                                            </div>
                                            <button
                                                className="flex items-center gap-2 w-full p-2 text-xs text-white hover:text-[#22D3EE] font-medium transition-colors group rounded-lg hover:bg-white/5"
                                                onClick={() => {
                                                    setShowCreateModal(true);
                                                    setShowPopover(false);
                                                }}
                                            >
                                                <Plus size={16} /> Nueva playlist
                                            </button>
                                        </div>
                                        <div className="flex-1 overflow-y-auto px-2 pb-2 max-h-48 space-y-0.5">
                                            <button
                                                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                                                onClick={() => setDraftFavorito(!draftFavorito)}
                                            >
                                                <div className="w-8 h-8 bg-gradient-to-br from-primary to-[#22D3EE] rounded-md flex items-center justify-center shrink-0 shadow-glow">
                                                    <Heart size={14} className="text-white fill-current" />
                                                </div>
                                                <span className="flex-1 text-xs font-semibold text-white truncate">Tus Favoritos</span>
                                                {draftFavorito && <Check size={16} className="text-[#22D3EE] shrink-0" />}
                                            </button>
                                            <div className="my-1 border-b border-white/5" />
                                            {playlistsFiltradas.map(playlist => {
                                                const isSelected = draftPlaylists.has(playlist.id);
                                                return (
                                                    <button
                                                        key={playlist.id}
                                                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-left group"
                                                        onClick={() => setDraftPlaylists(prev => {
                                                            const next = new Set(prev);
                                                            if(next.has(playlist.id)) next.delete(playlist.id);
                                                            else next.add(playlist.id);
                                                            return next;
                                                        })}
                                                    >
                                                        <div className="w-8 h-8 bg-surface rounded-md flex items-center justify-center shrink-0 border border-white/5">
                                                            <Music size={14} className="text-textSub group-hover:text-white" />
                                                        </div>
                                                        <span className="flex-1 text-xs text-textSub group-hover:text-white truncate transition-colors">{playlist.nombre}</span>
                                                        {isSelected && <Check size={16} className="text-[#22D3EE] shrink-0" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <div className="p-3 border-t border-white/5 bg-background/50 flex justify-end gap-2">
                                            <button className="px-4 py-1.5 rounded-lg text-xs font-medium text-textSub hover:text-white transition-colors" onClick={() => setShowPopover(false)}>Cancelar</button>
                                            <button className="px-5 py-1.5 rounded-lg text-xs font-bold bg-[#22D3EE] text-background hover:bg-[#22D3EE]/90 transition-colors shadow-glow" onClick={handleSavePopover}>Listo</button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
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
                        <button onClick={next} disabled={isShuffle ? queue.length <= 1 : currentIndex < 0 || currentIndex >= queue.length - 1} className="text-textSub hover:text-white disabled:opacity-30 disabled:hover:text-textSub transition-colors">
                            <SkipForward size={22} />
                        </button>
                    </div>

                    <div className="w-full flex items-center gap-3 group">
                        <span className="text-[11px] tabular-nums text-textSub w-10 text-right">{formatTime(currentTime)}</span>

                        <div
                            className="relative flex-1 h-4 flex items-center cursor-pointer"
                            onMouseMove={handleProgressHover}
                            onMouseLeave={handleProgressLeave}
                        >
                            <input
                                type="range"
                                min="0"
                                max={duration || 0}
                                step="0.1"
                                value={Math.min(currentTime, duration || currentTime)}
                                onChange={seek}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 peer"
                            />
                            <div className="absolute left-0 right-0 h-1 bg-white/20 rounded-full transition-all group-hover:h-1.5 peer-hover:h-1.5" />
                            <div className="absolute left-0 h-1 bg-white rounded-full pointer-events-none transition-all group-hover:bg-[#3a89ff] peer-hover:bg-[#3a89ff] group-hover:h-1.5 peer-hover:h-1.5" style={{ width: `${progress}%` }}>
                                <div className="absolute right-0 translate-x-1/2 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 peer-hover:opacity-100 z-30" />
                            </div>

                            <AnimatePresence>
                                {hoverTime !== null && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 5 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute bottom-6 -translate-x-1/2 bg-surface border border-white/10 text-white text-[11px] font-bold px-2 py-1 rounded-md shadow-lg pointer-events-none z-50 whitespace-nowrap"
                                        style={{ left: `${hoverX}px` }}
                                    >
                                        {formatTime(hoverTime)}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <span className="text-[11px] tabular-nums text-textSub w-10">{formatTime(duration || current.duracionSegundos || 0)}</span>
                    </div>
                </div>

                <div className="hidden md:flex items-center justify-end gap-3 group">
                    <button onClick={toggleMute} className="text-textSub hover:text-white transition-colors" aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}>
                        <VolumeIcon size={20} />
                    </button>
                    <div
                        className="relative w-28 h-4 flex items-center cursor-pointer"
                        onMouseMove={handleVolumeHover}
                        onMouseLeave={handleVolumeLeave}
                    >
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={effectiveVolume}
                            onChange={changeVolume}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 peer"
                        />
                        <div className="absolute left-0 right-0 h-1 bg-white/20 rounded-full transition-all group-hover:h-1.5 peer-hover:h-1.5" />
                        <div className="absolute left-0 h-1 bg-white rounded-full pointer-events-none transition-all group-hover:bg-[#3a89ff] peer-hover:bg-[#3a89ff] group-hover:h-1.5 peer-hover:h-1.5" style={{ width: `${effectiveVolume * 100}%` }}>
                            <div className="absolute right-0 translate-x-1/2 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 peer-hover:opacity-100 z-30" />
                        </div>

                        <AnimatePresence>
                            {hoverVolume !== null && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute bottom-6 -translate-x-1/2 bg-surface border border-white/10 text-white text-[11px] font-bold px-2 py-1 rounded-md shadow-lg pointer-events-none z-50 whitespace-nowrap"
                                    style={{ left: `${hoverVolumeX}px` }}
                                >
                                    {Math.round(hoverVolume * 100)}%
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </footer>

            <CreatePlaylistModal
                open={showCreateModal}
                onCancel={() => setShowCreateModal(false)}
                onAccept={(nombre) => {
                    if (nombre) {
                        onCreatePlaylist(nombre, current);
                    }
                    setShowCreateModal(false);
                }}
            />
        </>
    );
}

function formatTime(seconds) {
    const safeSeconds = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
    const minutes = Math.floor(safeSeconds / 60);
    const remaining = String(safeSeconds % 60).padStart(2, '0');
    return `${minutes}:${remaining}`;
}

function AudioWaveform({ isPlaying }) {
    return (
        <div className="flex items-end gap-[2px] h-3.5">
            {[1, 2, 3, 4].map((bar) => (
                <motion.div
                    key={bar}
                    className="w-1 bg-[#3a89ff] rounded-t-sm shadow-[0_0_8px_rgba(58,137,255,0.5)]"
                    animate={isPlaying ? { height: ["20%", "100%", "40%", "80%", "20%"] } : { height: "20%" }}
                    transition={isPlaying ? { duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: bar * 0.1 } : { duration: 0.3 }}
                />
            ))}
        </div>
    );
}

export default PlayerBar;
