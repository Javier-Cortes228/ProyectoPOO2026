import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    agregarJamendoAPlaylist,
    agregarContenidoAPlaylist,
    buscarJamendo,
    cargarCatalogo,
    cargarHistorial,
    cargarRecomendaciones,
    crearPlaylist,
    eliminarPlaylist,
    login,
    logout,
    obtenerUsuarioActual,
    reenviarVerificacion,
    registrarReproduccion,
    registrar,
    removerContenidoDePlaylist,
    verificarCodigoCorreo,
    verificarCorreo
} from './api/banduMusicApi.js';
import AddMusicModal from './components/AddMusicModal.jsx';
import AuthPanel from './components/AuthPanel.jsx';
import CreatePlaylistModal from './components/CreatePlaylistModal.jsx';
import MainContent from './components/MainContent.jsx';
import PlayerBar from './components/PlayerBar.jsx';
import Sidebar from './components/Sidebar.jsx';

function App() {
    const [usuario, setUsuario] = useState(null);
    const [authReady, setAuthReady] = useState(false);
    const [catalogo, setCatalogo] = useState([]);
    const [historial, setHistorial] = useState([]);
    const [recomendaciones, setRecomendaciones] = useState([]);
    const [activeView, setActiveView] = useState({ type: 'home' });
    const [pistaActual, setPistaActual] = useState(null);
    const [jamendoActual, setJamendoActual] = useState(null);
    const [jamendoResultados, setJamendoResultados] = useState([]);
    const [jamendoQuery, setJamendoQuery] = useState('');
    const [jamendoOffset, setJamendoOffset] = useState(0);
    const [jamendoHasMore, setJamendoHasMore] = useState(false);
    const [jamendoPreloadUrl, setJamendoPreloadUrl] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [isCreatePlaylistOpen, setCreatePlaylistOpen] = useState(false);
    const [isAddMusicOpen, setAddMusicOpen] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const verificationToken = params.get('verifyToken');
        if (!verificationToken) return;

        verificarCorreo(verificationToken)
            .then((data) => setMensaje(data.mensaje || 'Correo verificado correctamente.'))
            .catch((error) => setMensaje(error.message))
            .finally(() => {
                params.delete('verifyToken');
                const query = params.toString();
                const cleanUrl = `${window.location.pathname}${query ? `?${query}` : ''}`;
                window.history.replaceState({}, '', cleanUrl);
            });
    }, []);

    useEffect(() => {
        obtenerUsuarioActual()
            .then((data) => setUsuario(normalizarUsuario(data)))
            .catch(() => limpiarSesionLocal())
            .finally(() => setAuthReady(true));
    }, []);

    useEffect(() => {
        if (!usuario?.id) return;

        cargarCatalogo().then(setCatalogo).catch((error) => setMensaje(error.message));
        cargarHistorial().then((items) => setHistorial(items.map(normalizarHistorialItem))).catch((error) => setMensaje(error.message));
        cargarRecomendaciones().then(setRecomendaciones).catch((error) => setMensaje(error.message));
    }, [usuario?.id]);

    const playlists = usuario?.playlist || [];
    const playlistFavoritos = useMemo(() => playlists.find((playlist) => esPlaylistFavoritos(playlist)) || null, [playlists]);
    const playlistsVisibles = useMemo(() => playlists.filter((playlist) => !esPlaylistFavoritos(playlist)), [playlists]);

    const activePlaylist = useMemo(() => {
        if (activeView.type !== 'playlist') return null;
        return playlists.find((playlist) => playlist.id === activeView.playlistId) || null;
    }, [activeView, playlists]);

    const favoritos = useMemo(() => playlistFavoritos?.contenidos || [], [playlistFavoritos]);
    const favoritosIds = useMemo(() => favoritos.map((item) => item.id), [favoritos]);

    async function handleLogin(form) {
        setMensaje('');
        const data = await login(form.correo, form.contrasena);
        setUsuario(normalizarUsuario(data.usuario));
        setActiveView({ type: 'home' });
    }

    async function handleRegistro(form) {
        setMensaje('');
        const data = await registrar(form.nombreUsuario, form.correo, form.contrasena);
        setMensaje(data.mensaje || 'Cuenta creada. Revisa tu correo para obtener el codigo.');
    }

    async function handleReenviarVerificacion(correo) {
        setMensaje('');
        const data = await reenviarVerificacion(correo);
        setMensaje(data.mensaje || 'Se envio un nuevo codigo de verificacion.');
    }

    async function handleVerificarCodigo(form) {
        setMensaje('');
        const data = await verificarCodigoCorreo(form.correo, form.codigo);
        setMensaje(data.mensaje || 'Correo verificado correctamente. Ya puedes iniciar sesion.');
    }

    async function handleLogout() {
        try { await logout(); } catch { } finally { limpiarSesionLocal(); }
    }

    function limpiarSesionLocal() {
        setUsuario(null);
        setCatalogo([]);
        setHistorial([]);
        setRecomendaciones([]);
        setPistaActual(null);
        setJamendoActual(null);
        setJamendoResultados([]);
        setJamendoQuery('');
        setJamendoOffset(0);
        setJamendoHasMore(false);
        setJamendoPreloadUrl('');
        setActiveView({ type: 'home' });
    }

    async function handleCrearPlaylist(nombre) {
        if (!usuario) return;
        const nuevaPlaylist = normalizarPlaylist(await crearPlaylist(usuario.id, nombre));
        setUsuario((actual) => ({ ...actual, playlist: [...(actual.playlist || []), nuevaPlaylist] }));
        setActiveView({ type: 'playlist', playlistId: nuevaPlaylist.id });
        setCreatePlaylistOpen(false);
    }

    async function handleAgregarMusica(contenidoIds) {
        if (!activePlaylist || contenidoIds.length === 0) {
            setAddMusicOpen(false);
            return;
        }
        const existentes = new Set((activePlaylist.contenidos || []).map((item) => item.id));
        const nuevosIds = contenidoIds.filter((id) => !existentes.has(id));

        await Promise.all(nuevosIds.map((id) => agregarContenidoAPlaylist(activePlaylist.id, id)));

        const nuevosContenidos = catalogo.filter((item) => nuevosIds.includes(item.id));
        setUsuario((actual) => ({
            ...actual,
            playlist: actual.playlist.map((playlist) => {
                if (playlist.id !== activePlaylist.id) return playlist;
                return {
                    ...playlist,
                    contenidos: [...(playlist.contenidos || []), ...nuevosContenidos],
                    duracionTotalSegundos: calcularDuracion([...(playlist.contenidos || []), ...nuevosContenidos])
                };
            })
        }));
        setAddMusicOpen(false);
    }

    async function handleRemoverDePlaylist(item) {
        if (!activePlaylist || !item?.id) return;
        try {
            await removerContenidoDePlaylist(activePlaylist.id, item.id);
            actualizarPlaylist(activePlaylist.id, (playlist) => {
                const contenidos = (playlist.contenidos || []).filter((contenido) => contenido.id !== item.id);
                return { ...playlist, contenidos, duracionTotalSegundos: calcularDuracion(contenidos) };
            });
        } catch (error) { setMensaje(error.message); }
    }

    async function handleEliminarPlaylist() {
        if (!activePlaylist) return;
        try {
            await eliminarPlaylist(activePlaylist.id);
            setUsuario((actual) => ({ ...actual, playlist: (actual.playlist || []).filter((playlist) => playlist.id !== activePlaylist.id) }));
            setActiveView({ type: 'home' });
            setMensaje(`Playlist "${activePlaylist.nombre}" eliminada.`);
        } catch (error) { setMensaje(error.message); }
    }

    function actualizarPlaylist(playlistId, actualizar) {
        setUsuario((actual) => ({
            ...actual,
            playlist: (actual.playlist || []).map((playlist) => (playlist.id === playlistId ? actualizar(playlist) : playlist))
        }));
    }

    async function toggleFavorito(item) {
        if (!playlistFavoritos) {
            setMensaje('No existe una playlist de Favoritos para este usuario.');
            return;
        }
        const itemId = typeof item === 'string' ? item : item?.id;
        if (!itemId) return;

        const yaEsFavorito = favoritosIds.includes(itemId);

        try {
            if (yaEsFavorito) {
                await removerContenidoDePlaylist(playlistFavoritos.id, itemId);
                actualizarPlaylist(playlistFavoritos.id, (playlist) => ({
                    ...playlist,
                    contenidos: (playlist.contenidos || []).filter((item) => item.id !== itemId),
                    duracionTotalSegundos: calcularDuracion((playlist.contenidos || []).filter((item) => item.id !== itemId))
                }));
                return;
            }
            if (esContenidoJamendo(item)) {
                const playlistActualizada = normalizarPlaylist(await agregarJamendoAPlaylist(playlistFavoritos.id, item));
                reemplazarPlaylist(playlistActualizada);
                return;
            }

            await agregarContenidoAPlaylist(playlistFavoritos.id, itemId);
            const contenido = catalogo.find((item) => item.id === itemId);
            if (!contenido) return;

            actualizarPlaylist(playlistFavoritos.id, (playlist) => {
                const contenidos = [...(playlist.contenidos || []), contenido];
                return { ...playlist, contenidos, duracionTotalSegundos: calcularDuracion(contenidos) };
            });
        } catch (error) { setMensaje(error.message); }
    }

    function reproducirLocal(item) {
        if (esContenidoJamendo(item)) {
            reproducirJamendo(item);
            return;
        }
        setJamendoActual(null);
        setPistaActual(item);
        registrarEnHistorial(item);
    }

    function reproducirJamendo(track) {
        setPistaActual(null);
        setJamendoPreloadUrl(track.audioUrl);
        setJamendoActual(track);
        registrarEnHistorial({ ...track, fuente: 'JAMENDO', tipo: 'JAMENDO' });
    }

    function registrarEnHistorial(item) {
        if (!item?.id) return;
        const tempHistoryId = `temp-${Date.now()}-${item.id}`;
        const historialItem = normalizarHistorialItem({
            ...item,
            historialId: tempHistoryId,
            contenidoId: item.id,
            fuente: item.fuente || (esContenidoJamendo(item) ? 'JAMENDO' : 'LOCAL'),
            reproducidoEn: new Date().toISOString()
        });
        setHistorial((actual) => [historialItem, ...actual].slice(0, 20));

        registrarReproduccion(historialItem)
            .then((guardado) => {
                setHistorial((actual) => [
                    normalizarHistorialItem(guardado),
                    ...actual.filter((entrada) => entrada.historialId !== tempHistoryId)
                ].slice(0, 20));
                return cargarRecomendaciones();
            })
            .then(setRecomendaciones)
            .catch((error) => setMensaje(error.message));
    }

    function preloadJamendo(track) {
        if (track?.audioUrl) setJamendoPreloadUrl(track.audioUrl);
    }

    const handleBuscarJamendo = useCallback(async function handleBuscarJamendo(query, append = false) {
        setMensaje('');
        const limit = 30;
        const offset = append ? jamendoOffset : 0;
        const resultados = await buscarJamendo(query, { limit, offset });
        setJamendoResultados((actuales) => (append ? [...actuales, ...resultados] : resultados));
        setJamendoQuery(query);
        setJamendoOffset(offset + resultados.length);
        setJamendoHasMore(resultados.length === limit);
        if (resultados[0]) setJamendoPreloadUrl(resultados[0].audioUrl);
    }, [jamendoOffset]);

    async function handleAgregarJamendoAPlaylist(track, playlistId) {
        if (!playlistId) {
            setMensaje('Selecciona una playlist para agregar contenido de Jamendo.');
            return;
        }
        try {
            const playlistActualizada = normalizarPlaylist(await agregarJamendoAPlaylist(playlistId, track));
            reemplazarPlaylist(playlistActualizada);
            setMensaje(`"${track.titulo}" fue agregada a ${playlistActualizada.nombre}.`);
        } catch (error) { setMensaje(error.message); }
    }

    function reemplazarPlaylist(playlistActualizada) {
        setUsuario((actual) => ({
            ...actual,
            playlist: (actual.playlist || []).map((playlist) => (playlist.id === playlistActualizada.id ? playlistActualizada : playlist))
        }));
    }

    if (!authReady) {
        return (
            <main className="h-screen w-full flex items-center justify-center bg-background">
                <div className="glass p-8 rounded-2xl">
                    <h1 className="text-2xl font-bold text-white mb-2">BanduMusic</h1>
                    <span className="text-textSub">Cargando sesión...</span>
                </div>
            </main>
        );
    }

    if (!usuario) {
        return (
            <main className="bg-background">
                <AuthPanel
                    onLogin={handleLogin}
                    onRegistro={handleRegistro}
                    onVerificarCodigo={handleVerificarCodigo}
                    onReenviarVerificacion={handleReenviarVerificacion}
                    mensaje={mensaje}
                />
            </main>
        );
    }

    return (
        <div className="h-screen w-full flex flex-col bg-background overflow-hidden">
            <div className="flex-1 flex overflow-hidden">
                <Sidebar
                    usuario={usuario}
                    playlists={playlistsVisibles}
                    favoritos={favoritos}
                    activeView={activeView}
                    onGoHome={() => setActiveView({ type: 'home' })}
                    onOpenPlaylist={(playlistId) => setActiveView({ type: 'playlist', playlistId })}
                    onOpenFavorites={() => setActiveView({ type: 'favorites' })}
                    onOpenHistory={() => setActiveView({ type: 'history' })}
                    onOpenRecommendations={() => setActiveView({ type: 'recommendations' })}
                    onCreatePlaylist={() => setCreatePlaylistOpen(true)}
                    onPlay={reproducirLocal}
                />

                <MainContent
                    usuario={usuario}
                    activeView={activeView}
                    activePlaylist={activePlaylist}
                    catalogo={catalogo}
                    favoritos={favoritos}
                    historial={historial}
                    recomendaciones={recomendaciones}
                    favoritosIds={favoritosIds}
                    mensaje={mensaje}
                    pistaActual={pistaActual}
                    jamendoActual={jamendoActual}
                    jamendoResultados={jamendoResultados}
                    jamendoQuery={jamendoQuery}
                    jamendoHasMore={jamendoHasMore}
                    onClearMessage={() => setMensaje('')}
                    onError={setMensaje}
                    onPlayLocal={reproducirLocal}
                    onPlayJamendo={reproducirJamendo}
                    onPreloadJamendo={preloadJamendo}
                    onToggleFavorito={toggleFavorito}
                    onAddMusic={() => setAddMusicOpen(true)}
                    onRemoveFromPlaylist={handleRemoverDePlaylist}
                    onDeletePlaylist={handleEliminarPlaylist}
                    onBuscarJamendo={handleBuscarJamendo}
                    playlists={playlistsVisibles}
                    onAddJamendoToPlaylist={handleAgregarJamendoAPlaylist}
                    onLogout={handleLogout}
                />
            </div>

            <PlayerBar
                pista={pistaActual}
                jamendoTrack={jamendoActual}
                queue={obtenerColaReproduccion(
                    activeView,
                    activePlaylist,
                    favoritos,
                    catalogo,
                    historial,
                    recomendaciones,
                    jamendoResultados,
                    jamendoActual
                )}
                onPlayLocal={reproducirLocal}
            />

            {jamendoPreloadUrl && <audio className="hidden" src={jamendoPreloadUrl} preload="auto" />}

            <CreatePlaylistModal
                open={isCreatePlaylistOpen}
                onCancel={() => setCreatePlaylistOpen(false)}
                onAccept={handleCrearPlaylist}
            />

            <AddMusicModal
                open={isAddMusicOpen}
                catalogo={catalogo}
                playlist={activePlaylist}
                onCancel={() => setAddMusicOpen(false)}
                onAccept={handleAgregarMusica}
            />
        </div>
    );
}

function normalizarUsuario(usuario) {
    return { ...usuario, playlist: (usuario.playlist || []).map(normalizarPlaylist) };
}

function normalizarPlaylist(playlist) {
    return { ...playlist, contenidos: playlist.contenidos || [], duracionTotalSegundos: playlist.duracionTotalSegundos || 0 };
}

function normalizarHistorialItem(item) {
    const contenidoId = item.contenidoId || item.id;
    return {
        ...item,
        id: contenidoId,
        historialId: item.historialId || item.id,
        fuente: item.fuente || (item.audioUrl ? 'JAMENDO' : 'LOCAL'),
        tipo: item.tipo || (item.fuente === 'JAMENDO' ? 'JAMENDO' : 'CONTENIDO_AUDIO')
    };
}

function calcularDuracion(items) { return items.reduce((total, item) => total + (item.duracionSegundos || 0), 0); }
function esContenidoJamendo(item) { return item?.tipo === 'JAMENDO' || item?.fuente === 'JAMENDO' || Boolean(item?.audioUrl); }
function esPlaylistFavoritos(playlist) { return playlist?.nombre?.trim().toLowerCase() === 'favoritos'; }

function obtenerColaReproduccion(activeView, activePlaylist, favoritos, catalogo, historial, recomendaciones, jamendoResultados, jamendoActual) {
    if (activeView.type === 'playlist' && activePlaylist) return activePlaylist.contenidos || [];
    if (activeView.type === 'favorites') return favoritos;
    if (activeView.type === 'history') return historial;
    if (activeView.type === 'recommendations') return recomendaciones;
    if (activeView.type === 'home' && jamendoActual) {
        const resultados = jamendoResultados || [];
        return resultados.some((item) => item.id === jamendoActual.id) ? resultados : [jamendoActual, ...resultados];
    }
    return catalogo;
}

export default App;