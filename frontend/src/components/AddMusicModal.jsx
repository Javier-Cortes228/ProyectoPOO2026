import { useMemo, useState } from 'react';
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
      <div className="add-music-modal">
        <div className="modal-heading">
          <div>
            <p className="eyebrow">Agregar música</p>
            <h2>{playlist?.nombre || 'Playlist'}</h2>
          </div>
          <span>{seleccionados.length} seleccionadas</span>
        </div>

        <div className="add-music-filters">
          <label>
            Buscador por nombre
            <input value={nombre} onChange={(event) => setNombre(event.target.value)} placeholder="Nombre de canción o podcast" />
          </label>
          <label>
            Buscador por artista
            <input value={artista} onChange={(event) => setArtista(event.target.value)} placeholder="Artista o anfitrion" />
          </label>
        </div>

        <div className="add-music-list">
          {resultados.map((item) => {
            const disabled = existentes.has(item.id);
            const checked = seleccionados.includes(item.id);
            return (
              <label key={item.id} className={`add-music-row ${disabled ? 'disabled' : ''}`}>
                <input type="checkbox" checked={checked || disabled} disabled={disabled} onChange={() => toggle(item.id)} />
                <span>
                  <strong>{item.titulo}</strong>
                  <small>{item.artista || item.anfitrion || 'Sin autor'} · {item.tipo}</small>
                </span>
                {disabled && <em>Agregada</em>}
              </label>
            );
          })}
        </div>

        <div className="modal-actions">
          <button type="button" className="ghost-button" onClick={cancel}>Cancelar</button>
          <button className="primary-button" onClick={accept}>Aceptar</button>
        </div>
      </div>
    </Modal>
  );
}

export default AddMusicModal;
