import { useState } from 'react';

function AuthPanel({ onLogin, onRegistro, mensaje }) {
  const [modo, setModo] = useState('login');
  const [form, setForm] = useState({
    nombreUsuario: '',
    correo: 'admin@ufro.cl',
    contrasena: '1234'
  });
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setError('');

    try {
      if (modo === 'login') {
        await onLogin(form);
      } else {
        await onRegistro(form);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  function update(field, value) {
    setForm({ ...form, [field]: value });
  }

  return (
    <form className="auth-card glass-panel" onSubmit={submit}>
      <div>
        <h1>BanduMusic</h1>
        <span>Catálogo local, playlists y búsqueda externa en una sola experiencia.</span>
      </div>

      <div className="mode-switch">
        <button type="button" className={modo === 'login' ? 'active' : ''} onClick={() => setModo('login')}>Login</button>
        <button type="button" className={modo === 'registro' ? 'active' : ''} onClick={() => setModo('registro')}>Registro</button>
      </div>

      {modo === 'registro' && (
        <label>
          Nombre
          <input value={form.nombreUsuario} onChange={(event) => update('nombreUsuario', event.target.value)} />
        </label>
      )}

      <label>
        Correo
        <input type="email" value={form.correo} onChange={(event) => update('correo', event.target.value)} />
      </label>

      <label>
        Contrasena
        <input type="password" value={form.contrasena} onChange={(event) => update('contrasena', event.target.value)} />
      </label>

      {(error || mensaje) && <div className="form-error">{error || mensaje}</div>}

      <button className="primary-button">{modo === 'login' ? 'Entrar' : 'Crear cuenta'}</button>
    </form>
  );
}

export default AuthPanel;
