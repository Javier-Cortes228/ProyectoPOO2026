import { useState, useEffect } from 'react';
import { Search, X, Music, Check, Plus, Loader2, Play, Pause } from 'lucide-react';
import Modal from './Modal.jsx';
import { buscarJamendo } from '../api/banduMusicApi.js';

function AddMusicModal({ open, catalogo, playlist, onCancel, onToggleTrack, pistaActual, jamendoActual, globalIsPlaying, onPlay }) {
    const [tab, setTab] = useState('local');
    const [busqueda, setBusqueda] = useState('');
    const [jamendoResultados, setJamendoResultados] = useState([]);
    const [cargando, setCargando] = useState(false);

    const currentTrack = pistaActual || jamendoActual;

    useEffect(() => {
        if (!open) {
            setBusqueda('');
            setJamendoResultados([]);
            setTab('local');
        }
    }, [open]);

    useEffect(() => {
        if (tab !== 'jamendo' || busqueda.length < 2) {
            if (busqueda.length === 0) setJamendoResultados([]);
            return;
        }
        const delay = setTimeout(async () => {
            setCargando(true);
            try {
                const res = await buscarJamendo(busqueda, { limit: 15 });
                setJamendoResultados(res);
            } catch (e) {
                console.error("Error buscando en Jamendo:", e);
            } finally {
                setCargando(false);
            }
        }, 500);

        return () => clearTimeout(delay);
    }, [busqueda, tab]);

    if (!playlist) return null;

    const filtradosLocal = catalogo.filter(item =>
        item.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        (item.artista || '').toLowerCase().includes(busqueda.toLowerCase())
    );

    const itemsMostrar = tab === 'local' ? filtradosLocal : jamendoResultados;

    return (
        <Modal open={open} onClose={onCancel}>
            <div className="flex flex-col h-[600px] max-h-[85vh] w-full sm:w-[500px] max-w-full overflow-hidden">
                <div className="p-6 border-b border-white/5 flex flex-col gap-4 shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white">Agregar a playlist</h2>
                            <p className="text-sm text-[#22D3EE] font-medium truncate">{playlist.nombre}</p>
                        </div>
                        <button onClick={onCancel} className="p-2 text-textSub hover:text-white transition-colors rounded-full hover:bg-white/5">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex p-1 bg-surface/50 rounded-xl border border-white/5 w-full">
                        <button
                            className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === 'local' ? 'bg-[#3a89ff] text-white shadow-md' : 'text-textSub hover:text-white'}`}
                            onClick={() => { setTab('local'); setBusqueda(''); }}
                        >
                            BanduMusic
                        </button>
                        <button
                            className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === 'jamendo' ? 'bg-[#3a89ff] text-white shadow-md' : 'text-textSub hover:text-white'}`}
                            onClick={() => { setTab('jamendo'); setBusqueda(''); }}
                        >
                            Jamendo
                        </button>
                    </div>

                    <div className="relative mt-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textSub w-4 h-4" />
                        <input
                            className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#22D3EE] transition-colors placeholder:text-textSub"
                            placeholder={tab === 'local' ? "Buscar en BanduMusic..." : "Buscar en Jamendo..."}
                            value={busqueda}
                            onChange={e => setBusqueda(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    {cargando ? (
                        <div className="flex flex-col items-center justify-center h-full text-textSub">
                            <Loader2 size={32} className="animate-spin mb-4 text-[#3a89ff]" />
                            <p className="text-sm">Buscando en Jamendo...</p>
                        </div>
                    ) : itemsMostrar.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-textSub px-6 text-center">
                            <Music size={40} className="mb-4 opacity-20" />
                            <p className="text-sm">No se encontraron resultados.</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {itemsMostrar.map(track => {
                                const isInPlaylist = playlist.contenidos?.some(c => c.id === track.id);
                                const isPlayingThis = currentTrack?.id === track.id && globalIsPlaying;

                                return (
                                    <div key={track.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group">
                                        <div
                                            className="relative w-12 h-12 rounded-lg bg-surface border border-white/5 overflow-hidden shrink-0 cursor-pointer"
                                            onClick={() => {
                                                if (currentTrack?.id === track.id) {
                                                    window.dispatchEvent(new CustomEvent('bandu-toggle-play'));
                                                } else {
                                                    onPlay(track);
                                                }
                                            }}
                                        >
                                            {track.imagenUrl ? (
                                                <img src={track.imagenUrl} alt="" className={`w-full h-full object-cover transition-opacity ${isPlayingThis ? 'opacity-50' : 'group-hover:opacity-50'}`} />
                                            ) : (
                                                <div className={`w-full h-full flex items-center justify-center transition-opacity ${isPlayingThis ? 'opacity-50' : 'group-hover:opacity-50'}`}>
                                                    <Music size={16} className="text-textSub" />
                                                </div>
                                            )}

                                            <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${isPlayingThis ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                                {isPlayingThis ? (
                                                    <Pause size={24} className="text-[#22D3EE] fill-current shadow-lg" />
                                                ) : (
                                                    <Play size={24} className="text-[#22D3EE] fill-current ml-1 drop-shadow-md" />
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-semibold truncate ${isPlayingThis ? 'text-[#22D3EE]' : 'text-white'}`}>{track.titulo}</p>
                                            <p className="text-xs text-textSub truncate">{track.artista || 'Sin autor'}</p>
                                        </div>

                                        <button
                                            className={`shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${isInPlaylist ? 'bg-[#22D3EE] border-[#22D3EE] text-background' : 'border-[#22D3EE] text-[#22D3EE] hover:bg-[#22D3EE] hover:text-background'}`}
                                            onClick={() => onToggleTrack(playlist.id, track, isInPlaylist)}
                                            title={isInPlaylist ? "Quitar de la playlist" : "Agregar a la playlist"}
                                        >
                                            {isInPlaylist ? <Check size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={3} />}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-white/5 bg-surface/30 flex justify-end shrink-0">
                    <button
                        className="px-8 py-2.5 rounded-xl text-sm font-bold bg-[#3a89ff] hover:bg-[#3a89ff]/90 text-white transition-colors shadow-glow"
                        onClick={onCancel}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default AddMusicModal;