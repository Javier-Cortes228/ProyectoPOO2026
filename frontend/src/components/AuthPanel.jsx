import { useState } from 'react';
import { motion } from 'framer-motion';

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
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass p-8 rounded-2xl shadow-soft border-2 border-white/10"
        onSubmit={submit}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2">BanduMusic</h1>
          <p className="text-textSub text-sm">Catálogo local, playlists y búsqueda externa en una sola experiencia premium.</p>
        </div>

        <div className="flex bg-surface/50 rounded-xl p-1 mb-8">
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${modo === 'login' ? 'bg-primary text-white shadow-glow' : 'text-textSub hover:text-white'}`}
            onClick={() => setModo('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${modo === 'registro' ? 'bg-primary text-white shadow-glow' : 'text-textSub hover:text-white'}`}
            onClick={() => setModo('registro')}
          >
            Registro
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${modo === 'verificacion' ? 'bg-primary text-white shadow-glow' : 'text-textSub hover:text-white'}`}
            onClick={() => setModo('verificacion')}
          >
            Código
          </button>
        </div>

        <div className="space-y-4">
          {modo === 'registro' && (
            <div>
              <label className="block text-sm font-medium text-textSub mb-1">Nombre</label>
              <input
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-textMain focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                value={form.nombreUsuario}
                onChange={(event) => update('nombreUsuario', event.target.value)}
                placeholder="usuario"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-textSub mb-1">Correo</label>
            <input
              type="email"
              className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-textMain focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              value={form.correo}
              onChange={(event) => update('correo', event.target.value)}
            />
          </div>

          {modo !== 'verificacion' && (
            <div>
              <label className="block text-sm font-medium text-textSub mb-1">Contraseña</label>
              <input
                type="password"
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-textMain focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                value={form.contrasena}
                onChange={(event) => update('contrasena', event.target.value)}
                placeholder={modo === 'registro' ? 'Mínimo 8 caracteres' : ''}
              />
            </div>
          )}

          {modo === 'verificacion' && (
            <div>
              <label className="block text-sm font-medium text-textSub mb-1">Código de verificación</label>
              <input
                inputMode="numeric"
                maxLength={6}
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-center tracking-widest text-xl text-textMain focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                value={form.codigo}
                onChange={(event) => update('codigo', event.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
              />
            </div>
          )}

          {(error || mensaje) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`p-3 rounded-xl text-sm ${error ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}
            >
              {error || mensaje}
            </motion.div>
          )}

          <div className="pt-4 space-y-3">
            <button className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-all shadow-glow">
              {modo === 'login' ? 'Entrar' : modo === 'registro' ? 'Crear cuenta' : 'Verificar correo'}
            </button>
            {modo === 'verificacion' && (
              <button className="w-full py-3 bg-transparent hover:bg-white/5 text-textSub hover:text-white font-medium rounded-xl transition-colors" type="button" onClick={resendVerification}>
                Reenviar código
              </button>
            )}
          </div>
        </div>
      </motion.form>
    </div>
  );
}

export default AuthPanel;
