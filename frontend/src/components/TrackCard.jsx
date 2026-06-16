import { motion, AnimatePresence } from 'framer-motion';
import { Play, Heart, Trash2, Music2, Mic, Plus, Check } from 'lucide-react';

function TrackCard({ item, active, favorite, isSaved, onPlay, onToggleFavorite, onOpenAddToPlaylist, onRemove }) {
    const creador = item.artista || item.anfitrion || 'Sin autor';
    const Icon = item.tipo === 'PODCAST' ? Mic : Music2;

    function toggle(event) {
        event.stopPropagation();
        onToggleFavorite();
    }

    function remove(event) {
        event.stopPropagation();
        onRemove();
    }

    return (
        <motion.article
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className={`group relative glass rounded-xl p-4 flex flex-col gap-3 cursor-pointer overflow-hidden border-2 transition-colors ${active ? 'border-primary bg-primary/5' : 'border-transparent hover:border-white/10'}`}
            onClick={onPlay}
        >
            {active && (
                <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
            )}

            <div className="flex items-start justify-between z-10">
                <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center text-textSub group-hover:text-primary transition-colors">
                    {active ? (
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                            <Play size={24} className="fill-current" />
                        </motion.div>
                    ) : (
                        <Icon size={24} />
                    )}
                </div>

                <div className="flex items-center gap-1.5">
                    <button
                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${favorite ? 'text-[#22D3EE] bg-[#22D3EE]/10' : 'text-textSub hover:bg-white/10 opacity-0 group-hover:opacity-100'}`}
                        aria-label={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                        onClick={toggle}
                    >
                        <Heart size={18} className={favorite ? 'fill-current' : ''} />
                    </button>

                    <button
                        type="button"
                        className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all shadow-[0_0_10px_rgba(34,211,238,0.2)] ${isSaved ? 'bg-[#22D3EE] border-[#22D3EE] text-background hover:bg-[#22D3EE]/90' : 'border-[#22D3EE] text-[#22D3EE] hover:bg-[#22D3EE] hover:text-background opacity-0 group-hover:opacity-100'}`}
                        onClick={(e) => { e.stopPropagation(); onOpenAddToPlaylist(); }}
                        title="Agregar a playlist"
                    >
                        <AnimatePresence mode="wait">
                            {isSaved ? (
                                <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.15 }}>
                                    <Check size={18} strokeWidth={2.5} />
                                </motion.div>
                            ) : (
                                <motion.div key="plus" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.15 }}>
                                    <Plus size={18} strokeWidth={2.5} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>

                    {onRemove && (
                        <button
                            className="w-8 h-8 flex items-center justify-center rounded-full text-textSub hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all ml-1"
                            aria-label="Quitar de la playlist"
                            onClick={remove}
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>
            </div>

            <div className="z-10 mt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1 block">{item.tipo}</span>
                <strong className="block text-base font-semibold truncate text-white">{item.titulo}</strong>
                <small className="block text-sm text-textSub truncate mt-0.5">{creador}</small>
                {item.genero && <em className="block text-xs text-textSub/70 mt-1 not-italic border border-white/10 rounded-full px-2 py-0.5 w-fit">{item.genero}</em>}
            </div>
        </motion.article>
    );
}

export default TrackCard;