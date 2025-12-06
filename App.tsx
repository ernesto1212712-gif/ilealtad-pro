
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SearchPage from './pages/Search';
import UploadPage from './pages/Upload';
import DatabasePage from './pages/Database';
import AdminLogs from './pages/AdminLogs';
import SubmitCase from './pages/SubmitCase';
import Moderation from './pages/Moderation';
import ManageAds from './pages/ManageAds';
import Sidebar from './components/Sidebar';
import { Menu } from 'lucide-react';

const ProtectedLayout: React.FC<{ 
  isAdminMode: boolean; 
  theme: 'light'|'dark'; 
  toggleTheme: () => void; 
  onLogout: () => void;
  onSecretTap: () => void; // Nueva prop para el toque secreto
}> = ({ isAdminMode, theme, toggleTheme, onLogout, onSecretTap }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">
      <Sidebar 
        onLogout={onLogout} 
        isAdminMode={isAdminMode} 
        theme={theme} 
        toggleTheme={toggleTheme}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className="flex-1 md:ml-64 w-full overflow-y-auto h-screen flex flex-col">
        <header className="bg-white dark:bg-slate-900 h-16 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 flex items-center justify-between px-4 md:px-8 transition-colors shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            {/* AQUÍ ESTÁ EL TRUCO PARA CELULAR: onClick={onSecretTap} */}
            <h2 
              onClick={onSecretTap}
              className="font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[200px] md:max-w-none select-none cursor-pointer active:scale-95 transition-transform"
            >
              {isAdminMode ? <span className="text-red-600 font-bold tracking-wider text-xs md:text-base">[ ROOT MODE ACTIVE ]</span> : 'Panel Empresarial'}
            </h2>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <span className="hidden md:inline text-sm text-slate-500 dark:text-slate-400">Sistema Seguro v12.0</span>
            <div className={`w-2 h-2 rounded-full ${isAdminMode ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Estado para contar toques en celular
  const [tapCount, setTapCount] = useState(0);

  // Referencia para el estado actual de admin dentro del listener
  const [adminRef, setAdminRef] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('ilealtad_auth') === 'true';
    setIsAuthenticated(loggedIn);
    // IMPORTANTE: Siempre iniciar en falso por seguridad
    setIsAdminMode(false); 

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    setAdminRef(isAdminMode);
  }, [isAdminMode]);

  // Función para activar admin (usada por Teclado y por Toques)
  const toggleAdminAuth = () => {
    if (adminRef) {
      setIsAdminMode(false);
      alert('Modo Administrador DESACTIVADO');
    } else {
      const pass = window.prompt("⚠️ ACCESO RESTRINGIDO ⚠️\nIngrese clave de administrador:");
      if (pass === 'mela1234') {
        setIsAdminMode(true);
        alert('✅ Modo Administrador ACTIVADO');
      } else {
        alert('⛔ Contraseña Incorrecta');
      }
    }
    setTapCount(0); // Reiniciar contador
  };

  // Listener para PC (Alt + 1)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === '1') {
        toggleAdminAuth();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [adminRef]); 

  // Handler para Celular (5 toques seguidos)
  const handleSecretTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    if (newCount >= 5) {
      toggleAdminAuth();
    }
  };

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  
  const handleLogin = () => {
    localStorage.setItem('ilealtad_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('ilealtad_auth');
    setIsAuthenticated(false);
    setIsAdminMode(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
        } />
        
        <Route element={
          isAuthenticated ? (
            <ProtectedLayout 
              isAdminMode={isAdminMode} 
              theme={theme} 
              toggleTheme={toggleTheme} 
              onLogout={handleLogout}
              onSecretTap={handleSecretTap}
            />
          ) : (
            <Navigate to="/login" />
          )
        }>
          <Route path="/" element={<Dashboard />} />
          <Route path="/search" element={<SearchPage isAdminMode={isAdminMode} />} />
          <Route path="/submit-case" element={<SubmitCase />} />
          <Route path="/database" element={<DatabasePage isAdminMode={isAdminMode} />} />
          
          {isAdminMode && (
            <>
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/admin-logs" element={<AdminLogs />} />
              <Route path="/moderation" element={<Moderation />} />
              <Route path="/manage-ads" element={<ManageAds />} />
            </>
          )}
          
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
