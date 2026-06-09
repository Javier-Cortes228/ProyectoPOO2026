import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, KeyRound, ArrowRight } from 'lucide-react';

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
        <div className="min-h-screen flex bg-background overflow-hidden">

            {/* === PANEL IZQUIERDO: VISUAL (38%) === */}
            <div className="hidden lg:flex lg:w-[38%] relative bg-surface items-center justify-center overflow-hidden border-r border-white/5">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

                {}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2000')] bg-cover bg-center mix-blend-overlay opacity-20 z-0" />

                <div className="relative z-10 flex flex-col items-center p-12 text-center">
                    <img
                        src="/logo-bandumusic.png"
                        alt="BanduMusic Logo"
                        className="w-64 h-64 drop-shadow-[0_0_25px_rgba(58,137,255,0.4)]"
                    />
                    <h1 className="text-4xl font-orbitron font-bold text-white mt-6 mb-3">
                        Tu universo musical.
                    </h1>
                    <p className="text-textSub text-base max-w-sm">
                        Catálogo local, playlists y búsqueda externa en una sola experiencia...
                    </p>
                </div>
            </div>

            {/* === PANEL DERECHO: FORMULARIO (62%) === */}
            <div className="w-full lg:w-[62%] flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
                <motion.form
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-lg p-1"
                    onSubmit={submit}
                >
                    <motion.div layout className="text-center mb-16">
                        {/* Logo y Título solo visibles en móvil */}
                        <img
                            src="/logo-bandumusic.png"
                            alt="BanduMusic Logo Pequeño"
                            className="w-24 h-24 mx-auto mb-4 lg:hidden drop-shadow-glow"
                        />
                        <h1 className="text-4xl font-orbitron font-bold mb-2 lg:hidden">
                            <span className="text-primary">Bandu</span><span className="text-[#22D3EE]">Music</span>
                        </h1>

                        {/* Mensaje principal de la vista de escritorio */}
                        <h2 className="hidden lg:block text-5xl font-orbitron font-bold mb-4">
                            {modo === 'login' ? (
                                <>
                                    <span className="text-primary">Bandu</span><span className="text-[#22D3EE]">Music</span>
                                </>
                            ) : modo === 'registro' ? (
                                <span className="text-primary">Crea tu cuenta</span>
                            ) : (
                                <span className="text-primary">Verificación</span>
                            )}
                        </h2>
                        <p className="text-textSub text-base">
                            {modo === 'login' ? 'Ingresa a tu cuenta para continuar' : 'Únete para empezar a escuchar música sin límites'}
                        </p>
                    </motion.div>

                    {/* === NAVEGACIÓN (TABS) === */}
                    <motion.div layout className="flex border-b border-white/10 mb-8">
                        {['login', 'registro', 'verificacion'].map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                className={`flex-1 pb-3 text-base font-medium transition-all relative capitalize ${modo === tab ? 'text-[#22D3EE]' : 'text-textSub hover:text-white'}`}
                                onClick={() => setModo(tab)}
                            >
                                {tab === 'verificacion' ? 'Código' : tab}
                                {modo === tab && (
                                    <motion.div
                                        layoutId="underline"
                                        className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#22D3EE] shadow-[0_0_10px_rgba(34,211,238,0.8)] rounded-t-full"
                                    />
                                )}
                            </button>
                        ))}
                    </motion.div>

                    {/* === CAMPOS DE TEXTO FLUIDOS === */}
                    <motion.div layout className="flex flex-col gap-6">
                        <AnimatePresence initial={false}>
                            {modo === 'registro' && (
                                <motion.div
                                    key="campo-nombre"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    className="overflow-hidden"
                                >
                                    {/* Contenedor del input con padding interno para evitar recortes del ring de focus */}
                                    <div className="p-1 -m-1">
                                        <label className="block text-sm font-medium text-textSub mb-2">Nombre de usuario</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSub" />
                                            <input
                                                className="w-full bg-surface/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-textMain focus:outline-none focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] transition-all placeholder:text-textSub/50"
                                                value={form.nombreUsuario}
                                                onChange={(event) => update('nombreUsuario', event.target.value)}
                                                placeholder="ej: Juanito123"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.div layout key="campo-correo">
                            <div className="p-1 -m-1">
                                <label className="block text-sm font-medium text-textSub mb-2">Correo electrónico</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSub" />
                                    <input
                                        type="email"
                                        className="w-full bg-surface/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-textMain focus:outline-none focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] transition-all placeholder:text-textSub/50"
                                        value={form.correo}
                                        onChange={(event) => update('correo', event.target.value)}
                                        placeholder="tu@correo.com"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        <AnimatePresence initial={false}>
                            {modo !== 'verificacion' && (
                                <motion.div
                                    key="campo-contrasena"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-1 -m-1">
                                        <label className="block text-sm font-medium text-textSub mb-2 mt-1">Contraseña</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSub" />
                                            <input
                                                type="password"
                                                className="w-full bg-surface/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-textMain focus:outline-none focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] transition-all placeholder:text-textSub/50"
                                                value={form.contrasena}
                                                onChange={(event) => update('contrasena', event.target.value)}
                                                placeholder={modo === 'registro' ? 'Mínimo 8 caracteres' : '••••••••'}
                                            />
                                        </div>
                                        {modo === 'login' && (
                                            <div className="flex justify-end mt-3">
                                                <a href="#" className="text-sm text-[#22D3EE] hover:text-[#22D3EE]/80 transition-colors font-medium">¿Olvidaste tu contraseña?</a>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence initial={false}>
                            {modo === 'verificacion' && (
                                <motion.div
                                    key="campo-codigo"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-1 -m-1">
                                        <label className="block text-sm font-medium text-textSub mb-2 mt-1">Código de seguridad</label>
                                        <div className="relative">
                                            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSub" />
                                            <input
                                                inputMode="numeric"
                                                maxLength={6}
                                                className="w-full bg-surface/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 tracking-widest text-xl font-medium text-center text-textMain focus:outline-none focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] transition-all placeholder:text-textSub/30"
                                                value={form.codigo}
                                                onChange={(event) => update('codigo', event.target.value.replace(/\D/g, '').slice(0, 6))}
                                                placeholder="000000"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Mensajes de Alerta */}
                        <AnimatePresence>
                            {(error || mensaje) && (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className={`p-4 rounded-xl text-sm border flex items-center gap-2 font-medium ${error ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}
                                >
                                    {error || mensaje}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Botones de Acción */}
                        <motion.div layout className="pt-2 space-y-4">
                            <button className="w-full flex items-center justify-center gap-2 py-4 bg-primary hover:bg-primary/90 text-white text-lg font-semibold rounded-xl transition-all shadow-glow group">
                                {modo === 'login' ? 'Entrar a BanduMusic' : modo === 'registro' ? 'Crear cuenta' : 'Verificar correo'}
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>

                            <AnimatePresence>
                                {modo === 'verificacion' && (
                                    <motion.button
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="w-full py-3 bg-transparent hover:bg-surface text-textSub hover:text-white font-medium rounded-xl transition-colors text-base overflow-hidden"
                                        type="button"
                                        onClick={resendVerification}
                                    >
                                        Reenviar código de acceso
                                    </motion.button>
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