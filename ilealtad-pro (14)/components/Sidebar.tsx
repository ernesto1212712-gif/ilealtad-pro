import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Database, Search, Upload, LogOut, ShieldCheck, Users, Sun, Moon, Smartphone, GraduationCap, Globe, FilePlus, Gavel, Megaphone, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { getAds } from '../services/storage';
import { Ad } from '../types';
import { supabase } from '../lib/supabaseClient';

interface SidebarProps {
  onLogout: () => void;
  isAdminMode: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isOpen: boolean;        // Nuevo: Estado de apertura móvil
  onClose: () => void;    // Nuevo: Función para cerrar en móvil
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout, isAdminMode, theme, toggleTheme, isOpen, onClose }) => {
  const location = useLocation();
  const [ads, setAds] = useState<Ad[]>([]);
  const [isCloudConnected, setIsCloudConnected] = useState(false);

  useEffect(() => {
    if (supabase) {
      setIsCloudConnected(true);
    }

    const loadSidebarAds = async () => {
      const allAds = await getAds();
      setAds(allAds.filter(a => a.type === 'sidebar'));
    };
    loadSidebarAds();
  }, [location]);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { icon: LayoutDashboard, label: 'Panel de Control', path: '/' },
    { icon: Search, label: 'Investigación', path: '/search' },
    { icon: FilePlus, label: 'Reportar Caso', path: '/submit-case' },
    { icon: Database, label: 'Base de Datos', path: '/database' },
  ];

  const adminItems = [
    { icon: Gavel, label: 'Moderación', path: '/moderation' },
    { icon: Megaphone, label: 'Gestor de Anuncios', path: '/manage-ads' },
    { icon: Upload, label: 'Importar Datos', path: '/upload' },
    { icon: Users, label: 'Registro de Accesos', path: '/admin-logs' },
  ];

  return (
    <>
      {/* Overlay Oscuro para Móvil (Fondo negro transparente) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 dark:bg-black text-white flex flex-col 
        border-r border-slate-800 shadow-2xl transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
      `}>
        
        {/* Header del Sidebar */}
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isAdminMode ? 'bg-red-600' : 'bg-brand-600'}`}>
              <ShieldCheck size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">iLealtad</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            
            {/* Botón cerrar solo visible en móvil */}
            <button 
              onClick={onClose}
              className="md:hidden p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Cloud Status */}
        <div className="px-6 py-2 bg-slate-950/50 border-b border-slate-800 flex items-center justify-between">
          <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Red Global</span>
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${isCloudConnected ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></div>
            <span className={`text-[10px] font-mono ${isCloudConnected ? 'text-green-500' : 'text-slate-500'}`}>
              {isCloudConnected ? 'CONECTADO' : 'OFFLINE'}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => onClose()} // Cerrar menú al hacer clic en móvil
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive(item.path)
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}

          {isAdminMode && (
            <div className="pt-4 mt-4 border-t border-slate-800">
              <p className="px-4 text-xs font-bold text-red-500 uppercase mb-2 animate-pulse">Zona Root / Admin</p>
              {adminItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose()}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'bg-red-900/40 text-red-200 border border-red-900'
                      : 'text-red-400/70 hover:bg-slate-800 hover:text-red-400'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Ads Section */}
          <div className="pt-6 mt-2 border-t border-slate-800 space-y-4">
            <p className="px-4 text-[10px] font-bold text-slate-500 uppercase">Servicios Clasificados</p>
            
            <div className="mx-2 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-brand-500/50 transition-colors group cursor-default">
              <div className="flex items-center gap-2 mb-1 text-green-400">
                <Smartphone size={16} />
                <span className="text-xs font-bold">Hackeo WhatsApp/FB</span>
              </div>
              <p className="text-[10px] text-slate-400">Acceso total a redes sociales, recuperación de chats.</p>
            </div>

            <div className="mx-2 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-brand-500/50 transition-colors group cursor-default">
              <div className="flex items-center gap-2 mb-1 text-amber-400">
                <GraduationCap size={16} />
                <span className="text-xs font-bold">Notas Universitarias</span>
              </div>
              <p className="text-[10px] text-slate-400">Cambio de notas en sistema, corrección de historiales.</p>
            </div>
            
            {ads.map(ad => (
               <div key={ad.id} className="mx-2 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-brand-500/50 transition-colors group cursor-default">
                <div className={`flex items-center gap-2 mb-1 text-${ad.color}-400`}>
                  <Globe size={16} />
                  <span className="text-xs font-bold uppercase">{ad.title}</span>
                </div>
                <p className="text-[10px] text-slate-400">{ad.description}</p>
              </div>
            ))}
          </div>
        </nav>

        {/* Footer Contact */}
        <div className="p-4 bg-gradient-to-t from-black to-slate-900 border-t border-slate-800">
           <div className="text-center">
               <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Contacto Directo</p>
               <div className="bg-brand-900/30 border border-brand-500/30 rounded py-2 px-3">
                   <p className="text-xl font-mono font-bold text-white tracking-wider text-shadow-glow">939 544 566</p>
                   <p className="text-[9px] text-brand-300 mt-1">SOPORTE 24/7 ENCRIPTADO</p>
               </div>
           </div>
        </div>
        
        <div className="p-2 pb-6 md:pb-2">
           <button
            onClick={() => { onClose(); onLogout(); }}
            className="flex items-center justify-center gap-2 w-full py-3 text-slate-400 hover:text-red-400 text-sm font-medium hover:bg-slate-800 rounded transition-all border border-transparent hover:border-slate-700"
          >
            <LogOut size={16} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;