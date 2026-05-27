import { useEffect, useState } from 'react';
import Modal from './Modal.jsx';

function CreatePlaylistModal({ open, onCancel, onAccept }) {
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setNombre('');
      setError('');
    }
  }, [open]);

  async function submit(event) {
    event.preventDefault();
    const limpio = nombre.trim();

    if (!limpio) {
      setError('Ingresa un nombre para la playlist.');
      return;
    }

    await onAccept(limpio);
  }

  return (
    <Modal open={open} onClose={onCancel}>
      <form className="modal-form" onSubmit={submit}>
        <h2>Nombre de la playlist</h2>
        <input autoFocus value={nombre} onChange={(event) => setNombre(event.target.value)} placeholder="Mi playlist" />
        {error && <p className="inline-error">{error}</p>}
        <div className="modal-actions">
          <button type="button" className="ghost-button" onClick={onCancel}>Cancelar</button>
          <button className="primary-button">Aceptar</button>
        </div>
      </form>
    </Modal>
  );
}

export default CreatePlaylistModal;
