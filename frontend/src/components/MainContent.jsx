import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LogOut, Music, Heart, X, Trash2, RefreshCw } from 'lucide-react';
import JamendoSection from './JamendoSection.jsx';
import PlaylistView from './PlaylistView.jsx';
import TrackCard from './TrackCard.jsx';
import Modal from './Modal.jsx';

function MainContent({
                         usuario,
                         activeView,
                         activePlaylist,
                         catalogo,
                         favoritos,
                         historial,
                         recomendaciones,
                         favoritosIds,
                         mensaje,
                         pistaActual,
                         jamendoActual,
                         jamendoResultados,
                         jamendoQuery,
                         jamendoHasMore,
                         onClearMessage,
                         onError,
                         onPlayLocal,
                         onPlayJamendo,
                         onPreloadJamendo,
                         onToggleFavorito,
                         onAddMusic,
                         onRemoveFromPlaylist,
                         onDeletePlaylist,
                         onBuscarJamendo,
                         playlists,
                         onAddJamendoToPlaylist,
                         onLogout,
                         onVaciarHistorial,
                         onResetRecomendaciones,
                         onOpenAddToPlaylist
                     }) {
    const [busqueda, setBusqueda] = useState('');
    const [catalogoActivo, setCatalogoActivo] = useState('local');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showRecConfirmModal, setShowRecConfirmModal] = useState(false);
    const ultimaBusquedaGlobal = useRef('');
    const filtroGlobal = busqueda.trim().toLowerCase();

    const catalogoFiltrado = useMemo(() => {
        if (!filtroGlobal) return catalogo;
        return catalogo.filter((item) => coincideConFiltro(item, filtroGlobal));
    }, [catalogo, filtroGlobal]);

    const jamendoFiltrado = useMemo(() => {
        if (!filtroGlobal) return jamendoResultados;
        return jamendoResultados.filter((item) => coincideConFiltro(item, filtroGlobal));
    }, [jamendoResultados, filtroGlobal]);

    const favoriteSet = useMemo(() => new Set(favoritosIds), [favoritosIds]);

    useEffect(() => {
        if (activeView.type !== 'home' || filtroGlobal.length < 2) {
            if (filtroGlobal.length === 0) ultimaBusquedaGlobal.current = '';
            return;
        }
        if (ultimaBusquedaGlobal.current === filtroGlobal) return;

        const timeoutId = window.setTimeout(() => {
            ultimaBusquedaGlobal.current = filtroGlobal;
            onBuscarJamendo(busqueda).catch((error) => onError(error.message));
        }, 450);

        return () => window.clearTimeout(timeoutId);
    }, [activeView.type, busqueda, filtroGlobal.length, onBuscarJamendo, onError]);

    let content;

    if (activeView.type === 'playlist' && activePlaylist) {
        content = <PlaylistView playlist={activePlaylist} favoriteSet={favoriteSet} pistaActual={pistaActual} onPlay={onPlayLocal} onAddMusic={onAddMusic} onRemove={onRemoveFromPlaylist} onDeletePlaylist={onDeletePlaylist} onToggleFavorito={onToggleFavorito} />;
    } else if (activeView.type === 'favorites') {
        content = <LibrarySection title="Tus favoritos" subtitle="Contenido marcado como favorito" items={favoritos.filter((item) => coincideConFiltro(item, filtroGlobal))} favoriteSet={favoriteSet} playlists={playlists} pistaActual={pistaActual} onPlay={onPlayLocal} onToggleFavorito={onToggleFavorito} onOpenAddToPlaylist={onOpenAddToPlaylist} />;
    } else if (activeView.type === 'history') {
        content = <LibrarySection
            title="Historial reciente"
            subtitle="Tú historial de reproducción"
            items={(historial || []).filter((item) => coincideConFiltro(item, filtroGlobal))}
            favoriteSet={favoriteSet}
            playlists={playlists}
            pistaActual={pistaActual}
            jamendoActual={jamendoActual}
            onPlay={onPlayLocal}
            onToggleFavorito={onToggleFavorito}
            onOpenAddToPlaylist={onOpenAddToPlaylist}
            emptyMessage="Aún no hay reproducciones registradas."
            actionButton={
                historial.length > 0 && (
                    <button
                        onClick={() => setShowConfirmModal(true)}
                        className="text-sm font-semibold text-[#22D3EE] hover:text-white bg-surface hover:bg-white/5 border border-white/10 px-5 py-2.5 rounded-full transition-colors flex items-center gap-2 shadow-soft"
                    >
                        <Trash2 size={16} /> Vaciar historial
                    </button>
                )
            }
        />;
    } else if (activeView.type === 'recommendations') {
        content = <LibrarySection
            title="Recomendaciones para ti"
            subtitle="Contenido personalizado sugerido para tí"
            items={(recomendaciones || []).filter((item) => coincideConFiltro(item, filtroGlobal))}
            favoriteSet={favoriteSet}
            playlists={playlists}
            pistaActual={pistaActual}
            jamendoActual={jamendoActual}
            onPlay={onPlayLocal}
            onToggleFavorito={onToggleFavorito}
            onOpenAddToPlaylist={onOpenAddToPlaylist}
            emptyMessage="Reproduce canciones para generar recomendaciones personalizadas."
            actionButton={
                recomendaciones?.length > 0 && (
                    <button
                        onClick={() => setShowRecConfirmModal(true)}
                        className="text-sm font-semibold text-[#22D3EE] hover:text-white bg-surface hover:bg-white/5 border border-white/10 px-5 py-2.5 rounded-full transition-colors flex items-center gap-2 shadow-soft"
                    >
                        <RefreshCw size={16} /> Resetear sugerencias
                    </button>
                )
            }
        />;
    } else {
        content = (
            <div className="space-y-8">
                <DynamicHeader usuario={usuario} playlistsCount={playlists.length} favoritos={favoritos.length} />

                {filtroGlobal ? (
                    <div className="space-y-10">
                        <LibrarySection title="BanduMusic" subtitle="Encuentra tu próxima canción favorita." items={catalogoFiltrado} favoriteSet={favoriteSet} playlists={playlists} pistaActual={pistaActual} onPlay={onPlayLocal} onToggleFavorito={onToggleFavorito} onOpenAddToPlaylist={onOpenAddToPlaylist} emptyMessage="No hay coincidencias en el catálogo local." />
                        <LibrarySection title="Jamendo" subtitle="Cátalogo externo." items={jamendoFiltrado} favoriteSet={favoriteSet} playlists={playlists} pistaActual={pistaActual} jamendoActual={jamendoActual} onPlay={onPlayLocal} onToggleFavorito={onToggleFavorito} onOpenAddToPlaylist={onOpenAddToPlaylist} emptyMessage="No hay resultados online para esta búsqueda." />
                    </div>
                ) : (
                    <>
                        <CatalogSwitch active={catalogoActivo} onChange={setCatalogoActivo} />
                        {catalogoActivo === 'local' ? (
                            <LibrarySection title="Descubre en BanduMusic" subtitle="Encuentra tu próxima canción favorita." items={catalogoFiltrado} favoriteSet={favoriteSet} playlists={playlists} pistaActual={pistaActual} onPlay={onPlayLocal} onToggleFavorito={onToggleFavorito} onOpenAddToPlaylist={onOpenAddToPlaylist} />
                        ) : (
                            <JamendoSection resultados={jamendoResultados} activeTrackId={jamendoActual?.id} currentQuery={jamendoQuery} hasMore={jamendoHasMore} onBuscar={onBuscarJamendo} onPlay={onPlayJamendo} onPreload={onPreloadJamendo} playlists={playlists} favoriteSet={favoriteSet} onToggleFavorito={onToggleFavorito} onOpenAddToPlaylist={onOpenAddToPlaylist} onError={onError} />
                        )}
                    </>
                )}
            </div>
        );
    }

    return (
        <main className="flex-1 flex flex-col h-full bg-background overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#22D3EE]/10 rounded-full blur-[100px] pointer-events-none" />

            <Topbar busqueda={busqueda} setBusqueda={setBusqueda} onLogout={onLogout} />

            <div className="flex-1 overflow-y-auto p-6 md:p-8 z-10">
                <AnimatePresence>
                    {mensaje && <Message mensaje={mensaje} onClear={onClearMessage} />}
                </AnimatePresence>

                <motion.div
                    key={activeView.type + (activePlaylist?.id || '') + catalogoActivo + Boolean(filtroGlobal)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {content}
                </motion.div>
            </div>

            {/* MODAL 1: HISTORIAL */}
            <Modal open={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
                <div className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 mx-auto flex items-center justify-center mb-6">
                        <Trash2 size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">¿Vaciar historial?</h2>
                    <p className="text-textSub mb-8">Esta acción eliminará de forma permanente todas las canciones que has reproducido. No se puede deshacer.</p>
                    <div className="flex items-center justify-center gap-3">
                        <button className="px-6 py-2.5 rounded-xl text-sm font-medium text-textSub hover:text-white hover:bg-white/5 transition-colors" onClick={() => setShowConfirmModal(false)}>Cancelar</button>
                        <button className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors shadow-[0_0_15px_rgba(239,68,68,0.4)]" onClick={() => { onVaciarHistorial(); setShowConfirmModal(false); }}>Sí, vaciar</button>
                    </div>
                </div>
            </Modal>

            {/* MODAL 2: RECOMENDACIONES */}
            <Modal open={showRecConfirmModal} onClose={() => setShowRecConfirmModal(false)}>
                <div className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-[#22D3EE]/10 text-[#22D3EE] mx-auto flex items-center justify-center mb-6">
                        <RefreshCw size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">¿Resetear sugerencias?</h2>
                    <p className="text-textSub mb-8">Esto limpiará las recomendaciones actuales de la pantalla. Nuevas sugerencias aparecerán a medida que escuches más música.</p>
                    <div className="flex items-center justify-center gap-3">
                        <button className="px-6 py-2.5 rounded-xl text-sm font-medium text-textSub hover:text-white hover:bg-white/5 transition-colors" onClick={() => setShowRecConfirmModal(false)}>Cancelar</button>
                        <button className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#22D3EE] hover:bg-[#22D3EE]/90 text-background transition-colors shadow-[0_0_15px_rgba(34,211,238,0.4)]" onClick={() => { onResetRecomendaciones(); setShowRecConfirmModal(false); }}>Sí, resetear</button>
                    </div>
                </div>
            </Modal>
        </main>
    );
}

function DynamicHeader({ usuario, playlistsCount, favoritos }) {
    return (
        <section className="relative -mt-6 md:-mt-8 -mx-6 md:-mx-8 px-6 md:px-8 pt-10 pb-8 mb-8 bg-gradient-to-b from-primary/10 to-transparent border-b border-white/5">
            <div className="relative z-10 flex flex-col items-center text-center">
                <h1 className="text-4xl md:text-5xl font-outfit font-bold text-white mb-6">
                    ¡Bienvenido de nuevo, <span className="text-[#22D3EE]">{usuario?.nombreUsuario || 'Usuario'}</span>!
                </h1>
                <div className="flex items-center justify-center gap-4 text-textSub text-sm font-medium">
                    <span className="flex items-center gap-1.5"><Music size={16} className="text-primary"/> {playlistsCount} Playlists en total</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="flex items-center gap-1.5"><Heart size={16} className="text-[#22D3EE]"/> {favoritos} Favoritos</span>
                </div>
            </div>
        </section>
    );
}

function Topbar({ busqueda, setBusqueda, onLogout }) {
    return (
        <header className="h-20 px-8 flex items-center justify-between glass border-b border-white/5 z-20 sticky top-0">
            <div className="relative w-full max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textSub w-5 h-5" />
                <input
                    className="w-full bg-surface/50 border border-white/10 rounded-full pl-12 pr-12 py-2.5 text-sm text-textMain focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors duration-300 ease-in-out placeholder:text-textSub"
                    value={busqueda}
                    onChange={(event) => setBusqueda(event.target.value)}
                    placeholder="¿Qué quieres reproducir?"
                />
                {busqueda && (
                    <button
                        type="button"
                        onClick={() => setBusqueda('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-textSub hover:text-white transition-colors"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>
            <div className="flex items-center gap-4">
                <button
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface/50 text-textSub hover:text-white hover:bg-red-500/20 hover:border-red-500/30 transition-colors border border-white/5"
                    onClick={onLogout}
                >
                    <span className="text-sm font-medium">Cerrar sesión</span>
                    <LogOut size={16} />
                </button>
            </div>
        </header>
    );
}

function CatalogSwitch({ active, onChange }) {
    return (
        <div className="flex p-1 bg-surface/50 rounded-xl border border-white/5 w-fit mb-8" role="tablist">
            <button type="button" className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${active === 'local' ? 'bg-primary text-white shadow-glow' : 'text-textSub hover:text-white'}`} onClick={() => onChange('local')}>
                BanduMusic Hub
            </button>
            <button type="button" className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${active === 'online' ? 'bg-[#22D3EE] text-white shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'text-textSub hover:text-white'}`} onClick={() => onChange('online')}>
                Jamendo Hub
            </button>
        </div>
    );
}

function Message({ mensaje, onClear }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-between p-4 mb-6 rounded-xl bg-primary/10 border border-primary/20 text-primary-light backdrop-blur-md"
        >
            <span className="text-sm font-medium">{mensaje}</span>
            <button onClick={onClear} className="text-primary hover:text-white transition-colors text-sm font-semibold">Cerrar</button>
        </motion.div>
    );
}

function LibrarySection({ title, subtitle, items, favoriteSet, playlists, pistaActual, jamendoActual, onPlay, onToggleFavorito, onOpenAddToPlaylist, emptyMessage = 'No hay contenido para mostrar.', actionButton }) {
    const subtitleColor = title === 'Descubre en BanduMusic' ? 'text-[#22D3EE]' : 'text-textSub';

    return (
        <section className="mb-12">
            <div className="flex items-end justify-between mb-6">
                <div>
                    <p className={`${subtitleColor} text-sm font-medium mb-1`}>{subtitle}</p>
                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                </div>
                <div className="flex items-center gap-4">
                    {actionButton}
                    <span className="text-sm text-[#22D3EE] font-medium px-3 py-1 rounded-full bg-surface">
                        {items.length} resultados
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {items.map((item) => {
                    const isSaved = favoriteSet?.has(item.id) || playlists?.some(p => p.contenidos?.some(c => c.id === item.id));

                    return (
                        <TrackCard
                            key={item.historialId || `${item.fuente || 'LOCAL'}-${item.id}`}
                            item={item}
                            active={pistaActual?.id === item.id || jamendoActual?.id === item.id}
                            favorite={favoriteSet?.has(item.id)}
                            isSaved={isSaved}
                            onPlay={() => onPlay(item)}
                            onToggleFavorite={() => onToggleFavorito(item)}
                            onOpenAddToPlaylist={() => onOpenAddToPlaylist(item)}
                        />
                    );
                })}
            </div>

            {items.length === 0 && (
                <div className="p-8 rounded-2xl border border-dashed border-white/20 text-center text-textSub">
                    {emptyMessage}
                </div>
            )}
        </section>
    );
}

function coincideConFiltro(item, filtro) {
    if (!filtro) return true;
    const campos = [item.titulo, item.artista, item.anfitrion, item.album, item.genero, item.tipo, item.fuente];
    return campos.some((campo) => (campo || '').toLowerCase().includes(filtro));
}

export default MainContent;