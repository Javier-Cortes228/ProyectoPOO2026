import { useMemo, useState } from 'react';
import { Search, Music2, Check } from 'lucide-react';
import Modal from './Modal.jsx';

function AddMusicModal({ open, catalogo, playlist, onCancel, onAccept }) {
  const [nombre, setNombre] = useState('');
  const [artista, setArtista] = useState('');
  const [seleccionados, setSeleccionados] = useState([]);

  const existentes = useMemo(() => new Set((playlist?.contenidos || []).map((item) => item.id)), [playlist]);

  const resultados = useMemo(() => {
    const nombreFiltro = nombre.trim().toLowerCase();
    const artistaFiltro = artista.trim().toLowerCase();

    return catalogo.filter((item) => {
      const coincideNombre = !nombreFiltro || item.titulo.toLowerCase().includes(nombreFiltro);
      const creador = (item.artista || item.anfitrion || '').toLowerCase();
      const coincideArtista = !artistaFiltro || creador.includes(artistaFiltro);
      return coincideNombre && coincideArtista;
    });
  }, [catalogo, nombre, artista]);

  function toggle(id) {
    setSeleccionados((actual) => {
      if (actual.includes(id)) {
        return actual.filter((itemId) => itemId !== id);
      }
      return [...actual, id];
    });
  }

  async function accept() {
    await onAccept(seleccionados);
    setSeleccionados([]);
    setNombre('');
    setArtista('');
  }

  function cancel() {
    setSeleccionados([]);
    setNombre('');
    setArtista('');
    onCancel();
  }

  return (
    <Modal open={open} onClose={cancel} size="large">
      <div className="flex flex-col h-[80vh] max-h-[800px]">
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-surface/30">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Agregar al catálogo</p>
            <h2 className="text-2xl font-bold text-white">{playlist?.nombre || 'Playlist'}</h2>
          </div>
          <div className="px-4 py-1.5 rounded-full bg-surface text-sm font-medium text-textSub">
            <span className="text-white">{seleccionados.length}</span> seleccionadas
          </div>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-background/50 border-b border-white/5">
           <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textSub w-4 h-4" />
            <input
              className="w-full bg-surface border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              placeholder="Buscar por título..."
            />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textSub w-4 h-4" />
            <input
              className="w-full bg-surface border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
              value={artista}
              onChange={(event) => setArtista(event.target.value)}
              placeholder="Buscar por artista..."
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {resultados.map((item) => {
            const disabled = existentes.has(item.id);
            const checked = seleccionados.includes(item.id);
            return (
              <label
                key={item.id}
                className={`flex items-center gap-4 p-3 rounded-xl border transition-all cursor-pointer ${disabled ? 'opacity-50 bg-surface/50 border-transparent cursor-not-allowed' : checked ? 'bg-primary/10 border-primary' : 'bg-surface/30 border-white/5 hover:border-white/20'}`}
              >
                <div className="relative flex items-center justify-center w-5 h-5">
                   <input
                    type="checkbox"
                    className="appearance-none w-5 h-5 border-2 border-textSub rounded cursor-pointer checked:bg-primary checked:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    checked={checked || disabled}
                    disabled={disabled}
                    onChange={() => toggle(item.id)}
                  />
                  {(checked || disabled) && <Check size={14} className="absolute text-white pointer-events-none" />}
                </div>

                <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center flex-shrink-0">
                  <Music2 size={20} className={checked ? 'text-primary' : 'text-textSub'} />
                </div>

                <div className="flex-1 min-w-0">
                  <strong className="block text-sm font-semibold text-white truncate">{item.titulo}</strong>
                  <small className="block text-xs text-textSub truncate">{item.artista || item.anfitrion || 'Sin autor'} • {item.tipo}</small>
                </div>

                {disabled && <span className="text-xs font-semibold px-2 py-1 rounded bg-white/5 text-textSub">Agregada</span>}
              </label>
            );
          })}

          {resultados.length === 0 && (
            <div className="text-center py-12 text-textSub">
              No se encontraron resultados para tu búsqueda.
            </div>
          )}
        </div>

        <div className="p-6 border-t border-white/5 bg-surface/30 flex items-center justify-end gap-3">
          <button type="button" className="px-6 py-2.5 rounded-xl text-sm font-medium text-textSub hover:text-white hover:bg-white/5 transition-colors" onClick={cancel}>Cancelar</button>
          <button
            className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-primary hover:bg-primary/90 text-white transition-colors shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={accept}
            disabled={seleccionados.length === 0}
          >
            Agregar a Playlist
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default AddMusicModal;
