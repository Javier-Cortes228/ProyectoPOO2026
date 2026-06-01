import { useState } from 'react';

function AuthPanel({ onLogin, onRegistro, onVerificarCodigo, onReenviarVerificacion, mensaje }) {
  const [modo, setModo] = useState('login');
  const [form, setForm] = useState({
    nombreUsuario: '',
    correo: 'admin@ufro.cl',
    contrasena: '1234',
    codigo: ''
  });
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setError('');

    try {
      if (modo === 'login') {
        await onLogin(form);
        return;
      }

      if (modo === 'registro') {
        await onRegistro(form);
        setModo('verificacion');
        return;
      }

      await onVerificarCodigo(form);
      setModo('login');
      setForm((actual) => ({ ...actual, codigo: '' }));
    } catch (err) {
      setError(err.message);
    }
  }

  async function resendVerification() {
    setError('');
    try {
      await onReenviarVerificacion(form.correo);
      setModo('verificacion');
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
        <span>Catalogo local, playlists y busqueda externa en una sola experiencia.</span>
      </div>

      <div className="mode-switch">
        <button type="button" className={modo === 'login' ? 'active' : ''} onClick={() => setModo('login')}>Login</button>
        <button type="button" className={modo === 'registro' ? 'active' : ''} onClick={() => setModo('registro')}>Registro</button>
        <button type="button" className={modo === 'verificacion' ? 'active' : ''} onClick={() => setModo('verificacion')}>Codigo</button>
      </div>

      {modo === 'registro' && (
        <label>
          Nombre
          <input
            value={form.nombreUsuario}
            onChange={(event) => update('nombreUsuario', event.target.value)}
            placeholder="javier.cortes"
          />
        </label>
      )}

      <label>
        Correo
        <input type="email" value={form.correo} onChange={(event) => update('correo', event.target.value)} />
      </label>

      {modo !== 'verificacion' && (
        <label>
          Contrasena
          <input
            type="password"
            value={form.contrasena}
            onChange={(event) => update('contrasena', event.target.value)}
            placeholder={modo === 'registro' ? 'Minimo 8 caracteres, letras y numeros' : ''}
          />
        </label>
      )}

      {modo === 'verificacion' && (
        <label>
          Codigo de verificacion
          <input
            inputMode="numeric"
            maxLength={6}
            value={form.codigo}
            onChange={(event) => update('codigo', event.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
          />
        </label>
      )}

      {(error || mensaje) && <div className="form-error">{error || mensaje}</div>}

      <button className="primary-button">
        {modo === 'login' ? 'Entrar' : modo === 'registro' ? 'Crear cuenta' : 'Verificar correo'}
      </button>
      <button className="ghost-button" type="button" onClick={resendVerification}>
        Reenviar codigo
      </button>
    </form>
  );
}

export default AuthPanel;
