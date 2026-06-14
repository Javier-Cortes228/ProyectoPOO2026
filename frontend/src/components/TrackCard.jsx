import { motion } from 'framer-motion';
import { Play, Heart, Trash2, Music2, Mic } from 'lucide-react';

function TrackCard({ item, active, favorite, onPlay, onToggleFavorite, onRemove }) {
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
            className={`group relative glass rounded-xl p-3 flex flex-col gap-3 cursor-pointer overflow-hidden border transition-colors ${active ? 'border-primary bg-primary/5' : 'border-white/5 hover:border-white/10'}`}
            onClick={onPlay}
        >
            {/* Contenedor Cuadrado para la Portada (Alternativa A) */}
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-surface flex items-center justify-center flex-shrink-0">
                {item.imagenUrl ? (
                    <img src={item.imagenUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={item.titulo} />
                ) : (
                    <Icon size={48} className="text-textSub group-hover:text-primary transition-colors" />
                )}

                {/* Capa de Hover: Botón Play para las tarjetas no activas */}
                {!active && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <Play size={36} className="text-white fill-current shadow-lg" />
                    </div>
                )}

                {/* Capa de Reproducción Activa: Ecualizador Animado */}
                {active && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-1.5 backdrop-blur-[2px]">
                        <motion.div className="w-1.5 h-6 bg-primary rounded-full" animate={{ height: [12, 24, 12] }} transition={{ repeat: Infinity, duration: 0.5 }} />
                        <motion.div className="w-1.5 h-8 bg-primary rounded-full" animate={{ height: [16, 32, 16] }} transition={{ repeat: Infinity, duration: 0.7 }} />
                        <motion.div className="w-1.5 h-5 bg-primary rounded-full" animate={{ height: [10, 20, 10] }} transition={{ repeat: Infinity, duration: 0.6 }} />
                    </div>
                )}
            </div>

            <div className="flex flex-col flex-1 px-1">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <strong className="block text-base font-semibold truncate text-white">{item.titulo}</strong>
                        <small className="block text-sm text-textSub truncate mt-0.5">{creador}</small>
                    </div>

                    {/* Botones de acción flotantes (Favorito / Eliminar) */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <button
                            className={`p-1.5 rounded-full transition-all ${favorite ? 'text-[#22D3EE]' : 'text-textSub hover:text-white opacity-0 group-hover:opacity-100'}`}
                            onClick={toggle}
                        >
                            <Heart size={16} className={favorite ? 'fill-current' : ''} />
                        </button>
                        {onRemove && (
                            <button
                                className="p-1.5 rounded-full text-textSub hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                onClick={remove}
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.article>
    );
}

export default TrackCard;