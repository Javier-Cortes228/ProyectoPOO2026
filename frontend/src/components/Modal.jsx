import { useEffect } from 'react';

function Modal({ open, onClose, size = 'default', children }) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div className={`modal-card glass-panel ${size === 'large' ? 'large' : ''}`} role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export default Modal;
