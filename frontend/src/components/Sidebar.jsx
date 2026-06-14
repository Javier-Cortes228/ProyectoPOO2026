import { motion } from 'framer-motion';
import { Home, Heart, History, Sparkles, Plus, ListMusic, PlayCircle } from 'lucide-react';

function Sidebar({
                     usuario,
                     playlists,
                     favoritos,
                     activeView,
                     onGoHome,
                     onOpenPlaylist,
                     onOpenFavorites,
                     onOpenHistory,
                     onOpenRecommendations,
                     onCreatePlaylist,
                     onPlay
                 }) {
    return (
        <aside className="w-64 h-full glass flex flex-col border-r border-white/5">
            <div className="p-6 flex items-center gap-4">
                <div>
                    <h2 className="text-2xl font-outfit font-bold"><span className="text-primary">Bandu</span><span className="text-[#22D3EE]">Music</span></h2>
                    <p className="text-sm font-medium text-textSub truncate max-w-[150px]">@{usuario?.nombreUsuario || 'usuario'}</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
                <nav className="space-y-1">
                    <NavItem icon={<Home size={20} />} label="Inicio" active={activeView.type === 'home'} onClick={onGoHome} />
                    <NavItem icon={<Heart size={20} />} label="Tus favoritos" active={activeView.type === 'favorites'} onClick={onOpenFavorites} badge={favoritos.length} />
                    <NavItem icon={<History size={20} />} label="Historial" active={activeView.type === 'history'} onClick={onOpenHistory} />
                    <NavItem icon={<Sparkles size={20} />} label="Para ti" active={activeView.type === 'recommendations'} onClick={onOpenRecommendations} />
                </nav>

                <div>
                    <div className="flex items-center justify-between px-2 mb-2">
                        <span className="text-xs font-semibold text-textSub uppercase tracking-wider">Playlists</span>
                        <button onClick={onCreatePlaylist} className="p-1 text-textSub hover:text-primary transition-colors" title="Crear nueva playlist">
                            <Plus size={16} />
                        </button>
                    </div>
                    <div className="space-y-1">
                        {playlists.map((playlist) => (
                            <button
                                key={playlist.id}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${activeView.type === 'playlist' && activeView.playlistId === playlist.id ? 'bg-primary/10 text-primary' : 'text-textSub hover:bg-white/5 hover:text-white'}`}
                                onClick={() => onOpenPlaylist(playlist.id)}
                            >
                                <div className="flex items-center gap-3 truncate">
                                    <ListMusic size={16} className={activeView.type === 'playlist' && activeView.playlistId === playlist.id ? 'text-primary' : 'text-textSub'} />
                                    <span className="truncate font-medium">{playlist.nombre}</span>
                                </div>
                                <span className="text-xs opacity-50">{(playlist.contenidos || []).length}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between px-2 mb-2">
                        <span className="text-xs font-semibold text-textSub uppercase tracking-wider">Mix Reciente</span>
                    </div>
                    <div className="space-y-2 px-2">
                        {favoritos.slice(0, 4).map((item) => (
                            <div key={item.id} className="group flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer" onClick={() => onPlay(item)}>
                                <div className="w-10 h-10 rounded-md bg-surface flex flex-shrink-0 items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <PlayCircle size={20} className="text-textSub group-hover:text-primary" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-sm font-medium text-white truncate">{item.titulo}</p>
                                    <p className="text-xs text-textSub truncate">{item.artista || item.anfitrion || 'Sin autor'}</p>
                                </div>
                            </div>
                        ))}
                        {favoritos.length === 0 && <p className="text-xs text-textSub italic">Guarda contenido para verlo aquí.</p>}
                    </div>
                </div>
            </div>
        </aside>
    );
}

function NavItem({ icon, label, active, onClick, badge }) {
    return (
        <button
            onClick={onClick}
            className={`relative w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${active ? 'text-white bg-white/5' : 'text-textSub hover:bg-white/5 hover:text-white'}`}
        >
            {active && (
                <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-[#22D3EE] rounded-r-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                />
            )}
            <div className="flex items-center gap-3 z-10">
                <div className={active ? 'text-[#22D3EE]' : ''}>
                    {icon}
                </div>
                <span className="font-medium">{label}</span>
            </div>
            {badge !== undefined && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full z-10 ${active ? 'bg-[#22D3EE]/20 text-[#22D3EE]' : 'bg-surface text-textSub'}`}>
          {badge}
        </span>
            )}
        </button>
    );
}

export default Sidebar;