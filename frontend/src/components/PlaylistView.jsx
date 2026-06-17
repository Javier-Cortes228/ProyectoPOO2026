import { useMemo, useState, useRef, useEffect } from 'react';
import { Play, Pause, Clock, Trash2, Plus, Music, Shuffle, Search, ListFilter, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TrackCard from './TrackCard.jsx';
import Modal from './Modal.jsx';

const SORT_OPTIONS = [
    { id: 'recent', label: 'Agregado recientemente' },
    { id: 'title', label: 'Título (A-Z)' },
    { id: 'artist', label: 'Artista (A-Z)' },
    { id: 'bandumusic', label: 'Solo BanduMusic' },
    { id: 'jamendo', label: 'Solo Jamendo' }
];

function PlaylistView({
                          playlist,
                          favoriteSet,
                          pistaActual,
                          jamendoActual,
                          onPlay,
                          onAddMusic,
                          onRemove,
                          onDeletePlaylist,
                          onToggleFavorito,
                          isShuffle,
                          onToggleShuffle,
                          globalIsPlaying
                      }) {

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('recent');
    const [showSortMenu, setShowSortMenu] = useState(false);
    const sortMenuRef = useRef(null);

    const contenidos = playlist?.contenidos || [];

    const currentTrack = pistaActual || jamendoActual;
    const isThisPlaylistPlaying = currentTrack && contenidos.some(c => c.id === currentTrack.id);

    const duracionFormat = useMemo(() => {
        const totalSegundos = playlist?.duracionTotalSegundos || 0;
        const horas = Math.floor(totalSegundos / 3600);
        const minutos = Math.floor((totalSegundos % 3600) / 60);
        if (horas > 0) return `${horas} h ${minutos} min`;
        return `${minutos} min`;
    }, [playlist?.duracionTotalSegundos]);

    const processedTracks = useMemo(() => {
        let result = [...contenidos].filter(Boolean);

        if (searchQuery.trim()) {
            const lowerQ = String(searchQuery).trim().toLowerCase();
            result = result.filter(t => {
                const titulo = String(t.titulo || '').toLowerCase();
                const artista = String(t.artista || t.anfitrion || '').toLowerCase();
                return titulo.includes(lowerQ) || artista.includes(lowerQ);
            });
        }

        if (sortOption === 'bandumusic') {
            result = result.filter(t => t.fuente !== 'JAMENDO' && t.tipo !== 'JAMENDO');
        } else if (sortOption === 'jamendo') {
            result = result.filter(t => t.fuente === 'JAMENDO' || t.tipo === 'JAMENDO');
        }

        if (sortOption === 'title') {
            result.sort((a, b) => String(a.titulo || '').localeCompare(String(b.titulo || '')));
        } else if (sortOption === 'artist') {
            result.sort((a, b) => {
                const artistA = String(a.artista || a.anfitrion || '');
                const artistB = String(b.artista || b.anfitrion || '');
                return artistA.localeCompare(artistB);
            });
        }

        return result;
    }, [contenidos, searchQuery, sortOption]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
                setShowSortMenu(false);
            }
        }
        if (showSortMenu) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showSortMenu]);

    const handleMainPlay = () => {
        if (processedTracks.length === 0) return;

        if (isThisPlaylistPlaying) {
            window.dispatchEvent(new CustomEvent('bandu-toggle-play'));
            return;
        }

        if (isShuffle) {
            const randomTrack = processedTracks[Math.floor(Math.random() * processedTracks.length)];
            onPlay(randomTrack);
        } else {
            onPlay(processedTracks[0]);
        }
    };

    if (!playlist) return null;

    return (
        <section className="flex flex-col h-full -mx-6 md:-mx-8 -mt-6 md:-mt-8">
            <div className="relative pt-24 pb-8 px-6 md:px-8 bg-gradient-to-b from-[#3a89ff]/20 to-transparent border-b border-white/5 flex flex-col md:flex-row items-end gap-6 shrink-0">
                <div className="w-40 h-40 md:w-52 md:h-52 rounded-2xl bg-surface border border-white/10 shadow-[0_15px_50px_rgba(0,0,0,0.5)] flex items-center justify-center shrink-0 overflow-hidden relative group">
                    {contenidos.length > 0 && contenidos[0].imagenUrl ? (
                        <img src={contenidos[0].imagenUrl} alt="Portada" className="w-full h-full object-cover blur-sm opacity-50 absolute inset-0" />
                    ) : null}
                    <Music size={64} className="text-[#3a89ff] relative z-10 drop-shadow-lg" />
                </div>

                <div className="flex-1 min-w-0 pb-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#22D3EE] mb-2 block">Playlist Pública</span>
                    <h1 className="text-4xl md:text-6xl font-outfit font-bold text-white mb-4 truncate">{playlist.nombre}</h1>
                    <div className="flex items-center gap-2 text-sm text-textSub font-medium">
                        <span className="text-white">{contenidos.length} pistas</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock size={14} /> {duracionFormat}</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6 md:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            className="w-14 h-14 bg-[#3a89ff] hover:bg-[#3a89ff]/90 text-white rounded-full flex items-center justify-center transition-transform hover:scale-105 shadow-[0_0_20px_rgba(58,137,255,0.4)] disabled:opacity-50"
                            onClick={handleMainPlay}
                            disabled={processedTracks.length === 0}
                            title={isThisPlaylistPlaying ? "Sonando actualmente" : "Reproducir playlist"}
                        >
                            {isThisPlaylistPlaying && globalIsPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
                        </button>

                        <button
                            type="button"
                            onClick={onToggleShuffle}
                            className={`relative p-3 rounded-full transition-all ${isShuffle ? 'text-[#22D3EE]' : 'text-textSub hover:text-white hover:bg-white/5'}`}
                            title="Reproducción aleatoria"
                        >
                            <Shuffle size={24} />
                            {isShuffle && (
                                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#22D3EE] rounded-full shadow-[0_0_5px_#22D3EE]" />
                            )}
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-full border border-white/10 transition-colors flex items-center gap-2"
                            onClick={onAddMusic}
                        >
                            <Plus size={18} className="text-[#22D3EE]" /> Agregar Música
                        </button>
                        <button
                            type="button"
                            className="p-2.5 text-textSub hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors"
                            onClick={() => setShowDeleteModal(true)}
                            title="Eliminar Playlist"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>

                {contenidos.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                        {/* FORMULARIO FANTASMA PARA BLOQUEAR EL ENTER */}
                        <form
                            className="relative w-full sm:w-72"
                            onSubmit={(e) => {
                                e.preventDefault();
                                document.activeElement?.blur(); // Oculta el teclado en celulares al darle Enter
                            }}
                        >
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textSub w-4 h-4" />
                            <input
                                type="text"
                                className="w-full bg-surface/50 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#3a89ff] transition-colors placeholder:text-textSub"
                                placeholder="Buscar en esta playlist..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-textSub hover:text-white"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </form>

                        <div className="relative z-20" ref={sortMenuRef}>
                            <button
                                type="button"
                                onClick={() => setShowSortMenu(!showSortMenu)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-textSub hover:text-white hover:bg-white/5 transition-colors font-medium"
                            >
                                {sortOption === 'recent' ? 'Agregado recientemente' : SORT_OPTIONS.find(o => o.id === sortOption)?.label}
                                <ListFilter size={18} className={sortOption !== 'recent' ? 'text-[#22D3EE]' : ''} />
                            </button>

                            <AnimatePresence>
                                {showSortMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 top-[calc(100%+8px)] w-56 bg-surface/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] py-2"
                                    >
                                        <div className="px-4 py-2 text-xs font-bold text-textSub uppercase tracking-wider mb-1">Filtrar por</div>
                                        {SORT_OPTIONS.map(option => (
                                            <button
                                                type="button"
                                                key={option.id}
                                                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${sortOption === option.id ? 'text-[#22D3EE] bg-[#22D3EE]/10' : 'text-white hover:bg-white/5'}`}
                                                onClick={() => {
                                                    setSortOption(option.id);
                                                    setShowSortMenu(false);
                                                }}
                                            >
                                                {option.label}
                                                {sortOption === option.id && <Check size={16} className="text-[#22D3EE]" />}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                )}

                {contenidos.length > 0 ? (
                    processedTracks.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                            {processedTracks.map(item => (
                                <TrackCard
                                    key={item.id}
                                    item={item}
                                    active={currentTrack?.id === item.id}
                                    favorite={favoriteSet.has(item.id)}
                                    isSaved={true}
                                    onPlay={() => onPlay(item)}
                                    onToggleFavorite={() => onToggleFavorito(item)}
                                    onOpenAddToPlaylist={() => {}}
                                    onRemove={() => onRemove(item)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center text-textSub">
                            <Search size={32} className="mb-4 opacity-30" />
                            <p className="text-sm">No se encontraron pistas que coincidan con tu filtro o búsqueda.</p>
                            <button type="button" onClick={() => { setSearchQuery(''); setSortOption('recent'); }} className="mt-4 text-[#22D3EE] hover:text-white font-medium text-sm transition-colors">
                                Limpiar filtro/búsqueda
                            </button>
                        </div>
                    )
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/10 rounded-3xl bg-surface/30">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <Music size={28} className="text-textSub" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Playlist vacía</h3>
                        <p className="text-textSub max-w-md mb-6">Esta playlist aún no tiene contenido. Explora BanduMusic o Jamendo para agregar tus canciones favoritas.</p>
                        <button
                            type="button"
                            className="px-6 py-2.5 bg-[#3a89ff] hover:bg-[#3a89ff]/90 text-white font-semibold rounded-full transition-colors shadow-glow"
                            onClick={onAddMusic}
                        >
                            Explorar música
                        </button>
                    </div>
                )}
            </div>

            <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <div className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 mx-auto flex items-center justify-center mb-6">
                        <Trash2 size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">¿Borrar tu playlist?</h2>
                    <p className="text-textSub mb-8">Esta acción eliminará la playlist "{playlist.nombre}" de forma permanente. No se puede deshacer.</p>
                    <div className="flex items-center justify-center gap-3">
                        <button
                            type="button"
                            className="px-6 py-2.5 rounded-xl text-sm font-medium text-textSub hover:text-white hover:bg-white/5 transition-colors"
                            onClick={() => setShowDeleteModal(false)}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                            onClick={() => {
                                onDeletePlaylist();
                                setShowDeleteModal(false);
                            }}
                        >
                            Sí, eliminar
                        </button>
                    </div>
                </div>
            </Modal>
        </section>
    );
}

export default PlaylistView;