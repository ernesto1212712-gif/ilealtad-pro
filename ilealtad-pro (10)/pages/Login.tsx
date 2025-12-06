
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, UserPlus, LogIn, AlertCircle, CheckCircle, Smartphone, GraduationCap } from 'lucide-react';
import { logAccess, verifyCredentials, checkUserExists } from '../services/storage';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const navigate = useNavigate(); // Hook para navegación

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    
    if (cleanEmail && cleanPassword) {
      if (isRegister) {
        const exists = await checkUserExists(cleanEmail);
        
        if (exists) {
          setErrorMsg('Error: Este correo ya está registrado en el sistema.');
          setIsLoading(false);
          return;
        }

        await logAccess(cleanEmail, cleanPassword, 'REGISTER');
        
        setIsLoading(false);
        setSuccessMsg('Agente registrado correctamente. Por favor inicie sesión.');
        
        setTimeout(() => {
          setIsRegister(false);
          setPassword('');
          setSuccessMsg('');
        }, 1500);

      } else {
        await logAccess(cleanEmail, cleanPassword, 'LOGIN');
        const isValid = await verifyCredentials(cleanEmail, cleanPassword);

        if (isValid) {
          onLogin();
          setTimeout(() => {
            setIsLoading(false);
            navigate('/'); // Redirección correcta usando Router
          }, 800);
        } else {
          setIsLoading(false);
          setErrorMsg('Acceso Denegado: Usuario no registrado o contraseña incorrecta.');
        }
      }
    } else {
        setIsLoading(false);
        setErrorMsg('Por favor complete todos los campos.');
    }
  };

  const SideAd = ({ side, title, icon: Icon, color, items }: any) => (
    <div className={`hidden xl:flex flex-col w-64 p-6 rounded-2xl border bg-white dark:bg-slate-900 shadow-2xl transition-all duration-500 ${
      isRegister 
        ? 'opacity-100 translate-x-0' 
        : 'opacity-0 scale-95 pointer-events-none'
      } ${
        side === 'left' ? '-translate-x-4' : 'translate-x-4'
      } ${
        color === 'green' ? 'border-green-500/30 shadow-green-500/10' : 'border-amber-500/30 shadow-amber-500/10'
      }`}>
      
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
        color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
      }`}>
        <Icon size={24} />
      </div>

      <h3 className={`text-xl font-black uppercase tracking-tighter mb-2 ${
        color === 'green' ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'
      }`}>
        {title}
      </h3>
      
      <div className="h-1 w-10 bg-slate-200 dark:bg-slate-700 mb-6"></div>

      <ul className="space-y-4 mb-8 flex-1">
        {items.map((item: string, idx: number) => (
          <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
            <CheckCircle size={16} className={`mt-0.5 ${
              color === 'green' ? 'text-green-500' : 'text-amber-500'
            }`} />
            <span className="font-medium">{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
        <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Contacto Directo</p>
        <div className={`py-2 px-3 rounded font-mono font-bold text-lg tracking-wider ${
          color === 'green' 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
            : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
        }`}>
          939 544 566
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-brand-500/5 rounded-full blur-3xl"></div>
         <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="flex items-center justify-center gap-8 w-full max-w-7xl relative z-10">
        <SideAd 
          side="left"
          title="Redes Sociales & Chats"
          icon={Smartphone}
          color="green"
          items={[
            "Acceso total a WhatsApp",
            "Clonación de Facebook",
            "Recuperación de Instagram",
            "Ubicación por GPS en tiempo real",
            "Extracción de galería y audios"
          ]}
        />

        <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all z-20">
          <div className="p-8 text-center bg-slate-900 dark:bg-black relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="w-16 h-16 bg-brand-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/20 relative z-10">
              <ShieldCheck size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight relative z-10">iLealtad Pro</h1>
            <p className="text-slate-400 text-sm mt-2 relative z-10">
              {isRegister ? 'Registro de Nuevo Agente' : 'Portal de Inteligencia Seguro'}
            </p>
          </div>
          
          <div className="flex border-b border-slate-200 dark:border-slate-700">
            <button 
              onClick={() => { setIsRegister(false); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${!isRegister ? 'text-brand-600 border-b-2 border-brand-600 bg-slate-50 dark:bg-slate-800/50' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
            >
              Iniciar Sesión
            </button>
            <button 
              onClick={() => { setIsRegister(true); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${isRegister ? 'text-brand-600 border-b-2 border-brand-600 bg-slate-50 dark:bg-slate-800/50' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
            >
              Crear Cuenta
            </button>
          </div>

          <div className="p-8">
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-sm text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={16} />
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2 text-sm text-green-600 dark:text-green-400 animate-in fade-in slide-in-from-top-2">
                <CheckCircle size={16} />
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {isRegister ? 'Correo Institucional / Personal' : 'ID de Acceso'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all placeholder:text-slate-400"
                    placeholder="usuario@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {isRegister ? 'Crear Contraseña Maestra' : 'Clave de Seguridad'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all placeholder:text-slate-500"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {isRegister && (
                <div className="xl:hidden bg-slate-50 dark:bg-slate-800/80 p-4 rounded-lg border border-slate-200 dark:border-slate-700 mb-2 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulse">HOT</span>
                     <h4 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                       Servicios Disponibles
                     </h4>
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <Smartphone size={14} className="text-green-500" />
                      <span><strong>Hackeo:</strong> WhatsApp, FB, IG (Sin Rastro).</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <GraduationCap size={14} className="text-amber-500" />
                      <span><strong>Notas:</strong> Univ. Autónoma, UCV, UTP.</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-mono">CONTACTO</span>
                    <span className="text-sm font-bold text-brand-600 dark:text-brand-400">939 544 566</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    {isRegister ? <UserPlus size={18} /> : <LogIn size={18} />}
                    {isRegister ? 'Registrar Agente' : 'Autenticar y Acceder'}
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {isRegister 
                  ? 'Al registrarse, acepta los protocolos de confidencialidad.' 
                  : 'Solo personal autorizado. El acceso es monitoreado.'}
                <br/>
                Sistema v12.0 (Enterprise)
              </p>
            </div>
          </div>
        </div>

        <SideAd 
          side="right"
          title="Gestión Académica"
          icon={GraduationCap}
          color="amber"
          items={[
            "Cambio de Notas en Sistema",
            "Univ. Autónoma del Perú",
            "Universidad César Vallejo (UCV)",
            "Universidad Tecnológica (UTP)",
            "Corrección de Historial"
          ]}
        />
      </div>
    </div>
  );
};

export default Login;
