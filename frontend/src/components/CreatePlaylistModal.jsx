import { useEffect, useState } from 'react';
import { ListPlus } from 'lucide-react';
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
      <form className="p-6 md:p-8" onSubmit={submit}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
            <ListPlus size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Nueva Playlist</h2>
            <p className="text-sm text-textSub">Crea una playlist personalizada.</p>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-textSub mb-2">Nombre de la playlist</label>
          <input
            autoFocus
            className={`w-full bg-surface border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 transition-colors ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50' : 'border-white/10 focus:border-primary focus:ring-primary'}`}
            value={nombre}
            onChange={(event) => {
              setNombre(event.target.value);
              if (error) setError('');
            }}
            placeholder="ej: Mi terapia musical"
          />
          {error && <p className="text-red-400 text-xs mt-2 font-medium">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
          <button type="button" className="px-6 py-2.5 rounded-xl text-sm font-medium text-textSub hover:text-white hover:bg-white/5 transition-colors" onClick={onCancel}>Cancelar</button>
          <button className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-primary hover:bg-primary/90 text-white transition-colors shadow-glow">Crear Playlist</button>
        </div>
      </form>
    </Modal>
  );
}

export default CreatePlaylistModal;
