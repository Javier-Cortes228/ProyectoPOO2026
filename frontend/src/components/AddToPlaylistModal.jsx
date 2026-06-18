import { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Heart, X, Check, Music } from 'lucide-react';
import Modal from './Modal.jsx';
import CreatePlaylistModal from './CreatePlaylistModal.jsx';

function AddToPlaylistModal({ open, onClose, track, playlists, favoritosIds, onToggleFavorito, onTogglePlaylist, onCreatePlaylist }) {
    const [busqueda, setBusqueda] = useState('');
    const [draftFavorito, setDraftFavorito] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [draftPlaylists, setDraftPlaylists] = useState(new Set());

    useEffect(() => {
        if (open && track) {
            setDraftFavorito(favoritosIds.includes(track.id));
            setDraftPlaylists(new Set(
                playlists.filter(p => p.contenidos?.some(c => c.id === track.id)).map(p => p.id)
            ));
            setBusqueda('');
        }
    }, [open, track, playlists, favoritosIds]);

    const playlistsFiltradas = useMemo(() => {
        if (!busqueda) return playlists;
        return playlists.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()));
    }, [playlists, busqueda]);

    if (!track) return null;

    const toggleDraftFavorito = () => setDraftFavorito(!draftFavorito);
    const toggleDraftPlaylist = (id) => {
        setDraftPlaylists(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleSave = () => {
        const isCurrentlyFavorito = favoritosIds.includes(track.id);
        if (draftFavorito !== isCurrentlyFavorito) {
            onToggleFavorito(track);
        }

        playlists.forEach(p => {
            const wasInPlaylist = p.contenidos?.some(c => c.id === track.id);
            const isNowInDraft = draftPlaylists.has(p.id);
            if (wasInPlaylist !== isNowInDraft) {
                onTogglePlaylist(p.id, track, wasInPlaylist);
            }
        });

        onClose();
    };

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <div className="flex flex-col h-[500px] max-h-[80vh] w-full sm:w-[400px]">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
                        <h2 className="text-xl font-bold text-white">Agregar a playlist</h2>
                        <button onClick={onClose} className="p-2 text-textSub hover:text-white transition-colors rounded-full hover:bg-white/5">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-4 shrink-0 space-y-4 border-b border-white/5 pb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textSub w-4 h-4" />
                            <input
                                className="w-full bg-surface/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#22D3EE] transition-colors placeholder:text-textSub"
                                placeholder="Busca una playlist"
                                value={busqueda}
                                onChange={e => setBusqueda(e.target.value)}
                            />
                        </div>
                        <button
                            className="flex items-center gap-3 w-full p-2 text-white hover:text-[#22D3EE] font-medium transition-colors group"
                            onClick={() => setShowCreateModal(true)}
                        >
                            <div className="w-10 h-10 bg-surface/50 group-hover:bg-[#22D3EE]/20 rounded-lg flex items-center justify-center transition-colors">
                                <Plus size={20} />
                            </div>
                            Nueva playlist
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
                        <p className="px-2 py-2 text-xs font-semibold text-textSub uppercase tracking-wider">Guardar en</p>

                        <button
                            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors text-left"
                            onClick={toggleDraftFavorito}
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-primary to-[#22D3EE] rounded-lg flex items-center justify-center shrink-0 shadow-glow">
                                <Heart size={20} className="text-white fill-current" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate">Tus Favoritos</p>
                                <p className="text-xs text-textSub flex items-center gap-1"><span className="text-[#22D3EE]">★</span> {favoritosIds.length} canciones</p>
                            </div>
                            {draftFavorito ? (
                                <Check size={20} className="text-[#22D3EE] shrink-0" />
                            ) : (
                                <div className="shrink-0 w-4 h-4 mr-1 rounded-full border border-white/20 group-hover:border-white/60 transition-colors" />
                            )}
                        </button>

                        <div className="my-2 border-b border-white/5" />

                        {playlistsFiltradas.map(playlist => {
                            const isSelected = draftPlaylists.has(playlist.id);
                            return (
                                <button
                                    key={playlist.id}
                                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors text-left group"
                                    onClick={() => toggleDraftPlaylist(playlist.id)}
                                >
                                    <div className="w-12 h-12 bg-surface rounded-lg flex items-center justify-center shrink-0 border border-white/5">
                                        <Music size={20} className="text-textSub group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-white truncate">{playlist.nombre}</p>
                                        <p className="text-xs text-textSub">{playlist.contenidos?.length || 0} canciones</p>
                                    </div>
                                    <div className="shrink-0 w-6 h-6 flex items-center justify-center">
                                        {isSelected ? (
                                            <Check size={20} className="text-[#22D3EE]" />
                                        ) : (
                                            <div className="w-4 h-4 rounded-full border border-white/20 group-hover:border-white/60 transition-colors" />
                                        )}
                                    </div>
                                </button>
                            );
                        })}

                        {playlistsFiltradas.length === 0 && (
                            <p className="text-sm text-textSub text-center py-4">No se encontraron playlists.</p>
                        )}
                    </div>

                    <div className="p-4 border-t border-white/5 bg-surface/30 flex items-center justify-between shrink-0">
                        <button
                            className="px-6 py-2.5 rounded-xl text-sm font-medium text-textSub hover:text-white hover:bg-white/5 transition-colors"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            className="px-8 py-2.5 rounded-xl text-sm font-bold bg-[#22D3EE] hover:bg-[#22D3EE]/90 text-background transition-colors shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                            onClick={handleSave}
                        >
                            Listo
                        </button>
                    </div>
                </div>
            </Modal>

            <CreatePlaylistModal
                open={showCreateModal}
                onCancel={() => setShowCreateModal(false)}
                onAccept={(nombre) => {
                    if (nombre) {
                        onCreatePlaylist(nombre, track);
                        setShowCreateModal(false);
                        onClose();
                    }
                }}
            />
        </>
    );
}

export default AddToPlaylistModal;
