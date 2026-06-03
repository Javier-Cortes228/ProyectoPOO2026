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
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">BanduMusic</h2>
          <p className="text-xs text-textSub truncate max-w-[120px]">@{usuario?.nombreUsuario || 'usuario'}</p>
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
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${activeView.type === 'playlist' && activeView.playlistId === playlist.id ? 'bg-primary/20 text-primary' : 'text-textSub hover:bg-white/5 hover:text-white'}`}
                onClick={() => onOpenPlaylist(playlist.id)}
              >
                <div className="flex items-center gap-3 truncate">
                  <ListMusic size={16} className={activeView.type === 'playlist' && activeView.playlistId === playlist.id ? 'text-primary' : 'text-textSub'} />
                  <span className="truncate">{playlist.nombre}</span>
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
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${active ? 'bg-primary/20 text-primary shadow-[inset_0_0_10px_rgba(59,130,246,0.2)]' : 'text-textSub hover:bg-white/5 hover:text-white'}`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      {badge !== undefined && (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-surface text-textSub">{badge}</span>
      )}
    </button>
  );
}

export default Sidebar;
