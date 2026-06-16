import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, KeyRound, ArrowRight, ArrowLeft } from 'lucide-react';

const premiumTransition = { type: 'spring', bounce: 0, duration: 0.5 };

function AuthPanel({
                       onLogin,
                       onRegistro,
                       onVerificarCodigo,
                       onReenviarVerificacion,
                       onSolicitarRecuperacion,
                       onVerificarCodigoRecuperacion,
                       onRestablecerContrasena,
                       mensaje
                   }) {
    const [modo, setModo] = useState('login');
    const [form, setForm] = useState({
        nombreUsuario: '',
        correo: 'admin@ufro.cl',
        contrasena: '1234',
        codigo: '',
        nuevaContrasena: '',
        confirmarContrasena: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);

    async function submit(event) {
        event.preventDefault();
        setError('');
        setSubmitting(true);

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
            if (modo === 'verificacion') {
                await onVerificarCodigo(form);
                setModo('login');
                setForm((actual) => ({ ...actual, codigo: '' }));
                return;
            }
            if (modo === 'forgot_email') {
                if (!onSolicitarRecuperacion) throw new Error("Función 'onSolicitarRecuperacion' no conectada en App.jsx");
                await onSolicitarRecuperacion(form.correo);
                setModo('forgot_code');
                return;
            }
            if (modo === 'forgot_code') {
                if (!onVerificarCodigoRecuperacion) throw new Error("Función 'onVerificarCodigoRecuperacion' no conectada en App.jsx");
                await onVerificarCodigoRecuperacion(form.correo, form.codigo);
                setModo('forgot_reset');
                return;
            }
            if (modo === 'forgot_reset') {
                if (form.nuevaContrasena !== form.confirmarContrasena) {
                    throw new Error("Las contraseñas no coinciden.");
                }
                if (form.nuevaContrasena.length < 8) {
                    throw new Error("La contraseña debe tener mínimo 8 caracteres.");
                }
                if (!/[A-Za-z]/.test(form.nuevaContrasena) || !/\d/.test(form.nuevaContrasena)) {
                    throw new Error("La contraseña debe incluir letras y números.");
                }
                if (!onRestablecerContrasena) throw new Error("Función 'onRestablecerContrasena' no conectada en App.jsx");

                await onRestablecerContrasena(form.correo, form.codigo, form.nuevaContrasena);
                setModo('login');
                setForm((actual) => ({ ...actual, codigo: '', nuevaContrasena: '', confirmarContrasena: '' }));
                return;
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    async function resendVerification() {
        setError('');
        setSubmitting(true);
        try {
            if (modo === 'forgot_code') {
                await onSolicitarRecuperacion(form.correo);
                setForm((actual) => ({ ...actual, codigo: '' }));
            } else {
                await onReenviarVerificacion(form.correo);
                setForm((actual) => ({ ...actual, codigo: '' }));
            }
            setModo(modo === 'forgot_code' ? 'forgot_code' : 'verificacion');
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    function update(field, value) {
        setForm({ ...form, [field]: value });
    }
    const esFlujoRecuperacion = modo.startsWith('forgot_');

    return (
        <div className="min-h-screen flex bg-background overflow-hidden">

            {/* === PANEL IZQUIERDO: VISUAL (38%) === */}
            <div className="hidden lg:flex lg:w-[38%] relative bg-surface items-center justify-center overflow-hidden border-r border-white/5">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2000')] bg-cover bg-center mix-blend-overlay opacity-20 z-0" />

                <div className="relative z-10 flex flex-col items-center p-12 text-center">
                    <img
                        src="/logo-bandumusic.png"
                        alt="BanduMusic Logo"
                        className="w-64 h-64 drop-shadow-[0_0_25px_rgba(58,137,255,0.4)]"
                    />
                    <h1 className="text-4xl font-orbitron font-bold text-white mt-6 mb-3">
                        Tu universo musical
                    </h1>
                    <p className="text-textSub text-base max-w-sm">
                        Catálogo local, playlists y búsqueda externa en una sola experiencia...
                    </p>
                </div>
            </div>

            {/* === PANEL DERECHO: FORMULARIO (62%) === */}
            <div className="w-full lg:w-[62%] flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
                <motion.form
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={premiumTransition}
                    className="w-full max-w-lg p-1"
                    onSubmit={submit}
                >
                    <motion.div layout transition={premiumTransition} className="text-center mb-10">
                        {/* Vista Móvil */}
                        <img
                            src="/logo-bandumusic.png"
                            alt="BanduMusic Logo Pequeño"
                            className="w-24 h-24 mx-auto mb-4 lg:hidden drop-shadow-glow"
                        />
                        <h1 className="text-4xl font-orbitron font-bold mb-2 lg:hidden">
                            <span className="text-primary">Bandu</span><span className="text-[#22D3EE]">Music</span>
                        </h1>

                        {/* === TÍTULOS CON ANIMACIÓN DE CROSSFADE PERFECTA === */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={modo}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                            >
                                <h2 className="hidden lg:block text-5xl font-orbitron font-bold mb-4">
                                    {modo === 'login' && <><span className="text-primary">Bandu</span><span className="text-[#22D3EE]">Music</span></>}
                                    {modo === 'registro' && <><span className="text-primary">Crea tu</span><span className="text-[#22D3EE]"> Cuenta</span></>}
                                    {modo === 'verificacion' && <span className="text-primary">Verificación</span>}
                                    {(modo === 'forgot_email' || modo === 'forgot_code') && <><span className="text-primary">Recuperar</span> <span className="text-[#22D3EE]">Cuenta</span></>}
                                    {modo === 'forgot_reset' && <><span className="text-primary">Nueva</span> <span className="text-[#22D3EE]">Clave</span></>}
                                </h2>

                                <p className="text-textSub text-base">
                                    {modo === 'login' && 'Ingresa a tu cuenta para continuar'}
                                    {modo === 'registro' && 'Únete para empezar a escuchar música sin límites'}
                                    {modo === 'verificacion' && 'Ingresa el código que enviamos a tu correo'}
                                    {modo === 'forgot_email' && 'Escribe tu correo para enviarte un código de restauración'}
                                    {modo === 'forgot_code' && 'Ingresa el código de seguridad enviado'}
                                    {modo === 'forgot_reset' && 'Configura las credenciales de acceso de tu nueva contraseña'}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>

                    {/* === NAVEGACIÓN PRINCIPAL (TABS) === */}
                    <AnimatePresence>
                        {modo !== 'verificacion' && !esFlujoRecuperacion && (
                            <motion.div
                                layout
                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                transition={premiumTransition}
                                className="flex border-b border-white/10 overflow-hidden"
                            >
                                {['login', 'registro'].map((tab) => (
                                    <button
                                        key={tab}
                                        type="button"
                                        className={`flex-1 pb-3 text-base font-medium transition-all relative capitalize ${modo === tab ? 'text-[#22D3EE]' : 'text-textSub hover:text-white'}`}
                                        onClick={() => setModo(tab)}
                                    >
                                        {tab}
                                        {modo === tab && (
                                            <motion.div
                                                layoutId="underline"
                                                className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#22D3EE] shadow-[0_0_10px_rgba(34,211,238,0.8)] rounded-t-full"
                                            />
                                        )}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* === CAMPOS DE TEXTO DINÁMICOS === */}
                    <motion.div layout transition={premiumTransition} className="flex flex-col">
                        <AnimatePresence initial={false}>
                            {modo === 'registro' && (
                                <motion.div
                                    layout
                                    key="campo-nombre"
                                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    transition={premiumTransition}
                                    className="overflow-hidden px-2 -mx-2"
                                >
                                    <div className="pt-1">
                                        <label className="block text-sm font-medium text-textSub mb-2">Nombre de usuario</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSub" />
                                            <input
                                                className="w-full bg-surface/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-textMain focus:outline-none focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] transition-colors duration-300 ease-in-out placeholder:text-textSub/50"
                                                value={form.nombreUsuario}
                                                onChange={(event) => update('nombreUsuario', event.target.value)}
                                                placeholder="ej: Juanito123"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence initial={false}>
                            {modo !== 'forgot_reset' && (
                                <motion.div
                                    layout
                                    key="campo-correo"
                                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    transition={premiumTransition}
                                    className="overflow-hidden px-2 -mx-2"
                                >
                                    <div className="pt-1">
                                        <label className="block text-sm font-medium text-textSub mb-2">Correo electrónico</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSub" />
                                            <input
                                                type="email"
                                                disabled={modo === 'verificacion' || modo === 'forgot_code'}
                                                className={`w-full bg-surface/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-textMain focus:outline-none focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] transition-colors duration-300 ease-in-out placeholder:text-textSub/50 ${(modo === 'verificacion' || modo === 'forgot_code') ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                value={form.correo}
                                                onChange={(event) => update('correo', event.target.value)}
                                                placeholder="tu@correo.com"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* CAMPO: CONTRASEÑA STANDARD (Login y Registro) */}
                        <AnimatePresence initial={false}>
                            {(modo === 'login' || modo === 'registro') && (
                                <motion.div
                                    layout
                                    key="campo-contrasena"
                                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    transition={premiumTransition}
                                    className="overflow-hidden px-2 -mx-2"
                                >
                                    <div className="pt-1">
                                        <label className="block text-sm font-medium text-textSub mb-2 mt-1">Contraseña</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSub" />
                                            <input
                                                type="password"
                                                className="w-full bg-surface/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-textMain focus:outline-none focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] transition-colors duration-300 ease-in-out placeholder:text-textSub/50"
                                                value={form.contrasena}
                                                onChange={(event) => update('contrasena', event.target.value)}
                                                placeholder={modo === 'registro' ? 'Mínimo 8 caracteres' : '••••••••'}
                                            />
                                        </div>
                                        {modo === 'login' && (
                                            <div className="flex justify-end mt-3">
                                                <button
                                                    type="button"
                                                    className="text-sm text-[#22D3EE] hover:text-[#22D3EE]/80 transition-colors font-medium"
                                                    onClick={() => setModo('forgot_email')}
                                                >
                                                    ¿Olvidaste tu contraseña?
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* CAMPO: CÓDIGO DE SEGURIDAD */}
                        <AnimatePresence initial={false}>
                            {(modo === 'verificacion' || modo === 'forgot_code') && (
                                <motion.div
                                    layout
                                    key="campo-codigo"
                                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    transition={premiumTransition}
                                    className="overflow-hidden px-2 -mx-2"
                                >
                                    <div className="pt-1">
                                        <label className="block text-sm font-medium text-textSub mb-2 mt-1">Código de seguridad</label>
                                        <div className="relative">
                                            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSub" />
                                            <input
                                                inputMode="numeric"
                                                maxLength={6}
                                                className="w-full bg-surface/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 tracking-widest text-xl font-medium text-center text-textMain focus:outline-none focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] transition-colors duration-300 ease-in-out placeholder:text-textSub/30"
                                                value={form.codigo}
                                                onChange={(event) => update('codigo', event.target.value.replace(/\D/g, '').slice(0, 6))}
                                                placeholder="000000"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* CAMPO: RESTABLECER CONTRASEÑA*/}
                        <AnimatePresence initial={false}>
                            {modo === 'forgot_reset' && (
                                <motion.div
                                    layout
                                    key="campos-nuevos-pass"
                                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    transition={premiumTransition}
                                    className="overflow-hidden px-2 -mx-2"
                                >
                                    <div className="pt-1 space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-textSub mb-2">Nueva contraseña</label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSub" />
                                                <input
                                                    type="password"
                                                    className="w-full bg-surface/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-textMain focus:outline-none focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] transition-colors duration-300 ease-in-out placeholder:text-textSub/50"
                                                    value={form.nuevaContrasena}
                                                    onChange={(event) => update('nuevaContrasena', event.target.value)}
                                                    placeholder="Mínimo 8 caracteres"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-textSub mb-2">Repite la contraseña</label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSub" />
                                                <input
                                                    type="password"
                                                    className="w-full bg-surface/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-textMain focus:outline-none focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] transition-colors duration-300 ease-in-out placeholder:text-textSub/50"
                                                    value={form.confirmarContrasena}
                                                    onChange={(event) => update('confirmarContrasena', event.target.value)}
                                                    placeholder="Confirma tu contraseña"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* MENSAJES DE ALERTA (Errores de Backend o Locales) */}
                        <AnimatePresence>
                            {(error || mensaje) && (
                                <motion.div
                                    layout
                                    key="alerta"
                                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    transition={premiumTransition}
                                    className="overflow-hidden"
                                >
                                    <div className={`p-4 rounded-xl text-sm border flex items-center gap-2 font-medium ${error ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                                        {error || mensaje}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* BOTONES DE ACCIÓN PRINCIPALES */}
                        <motion.div layout transition={premiumTransition} className="pt-2">
                            <button
                                className="w-full flex items-center justify-center gap-2 py-4 bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-wait text-white text-lg font-semibold rounded-xl transition-all shadow-glow group"
                                disabled={isSubmitting}
                            >
                                {modo === 'login' && 'Entrar a BanduMusic'}
                                {modo === 'registro' && 'Crear cuenta'}
                                {modo === 'verificacion' && 'Verificar correo'}
                                {modo === 'forgot_email' && 'Enviar código de recuperación'}
                                {modo === 'forgot_code' && 'Verificar código'}
                                {modo === 'forgot_reset' && 'Actualizar contraseña'}
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>

                            {/* PANEL INFERIOR DE ESCAPE (Para reenvíos de código y retornos al Login) */}
                            <AnimatePresence>
                                {(modo === 'verificacion' || esFlujoRecuperacion) && (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={premiumTransition}
                                        className="overflow-hidden w-full"
                                    >
                                        <div className="flex flex-col gap-3 mt-4">
                                            {(modo === 'verificacion' || modo === 'forgot_code') && (
                                                <button
                                                    className="w-full py-3 bg-transparent hover:bg-surface text-textSub hover:text-white font-medium rounded-xl transition-colors text-base"
                                                    type="button"
                                                    onClick={resendVerification}
                                                    disabled={isSubmitting}
                                                >
                                                    {modo === 'forgot_code' ? 'Reenviar código de recuperación' : 'Reenviar código de verificación'}
                                                </button>
                                            )}
                                            <button
                                                className="w-full py-2 flex items-center justify-center gap-2 bg-transparent text-textSub hover:text-[#22D3EE] font-medium rounded-xl transition-colors text-sm group"
                                                type="button"
                                                onClick={() => {
                                                    setModo('login');
                                                    setError('');
                                                }}
                                            >
                                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                                Volver al inicio de sesión
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </motion.div>
                </motion.form>
            </div>
        </div>
    );
}

export default AuthPanel;