import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
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

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check Auth
    const loggedIn = localStorage.getItem('ilealtad_auth') === 'true';
    setIsAuthenticated(loggedIn);

    // Apply Theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Listener para teclas secretas (Alt + 1)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === '1') {
        setIsAdminMode(prev => {
          const newState = !prev;
          return newState;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogin = () => {
    localStorage.setItem('ilealtad_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('ilealtad_auth');
    setIsAuthenticated(false);
    setIsAdminMode(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">
        <Sidebar 
          onLogout={handleLogout} 
          isAdminMode={isAdminMode} 
          theme={theme} 
          toggleTheme={toggleTheme} 
        />
        
        <div className="flex-1 ml-64 overflow-y-auto">
          {/* Top Header */}
          <header className="bg-white dark:bg-slate-900 h-16 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 flex items-center justify-between px-8 transition-colors">
            <h2 className="font-semibold text-slate-700 dark:text-slate-200">
              {isAdminMode ? <span className="text-red-600 font-bold tracking-wider">[ MODO ROOT / GOD MODE ]</span> : 'Panel Empresarial'}
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500 dark:text-slate-400">Sistema Seguro v12.0</span>
              <div className={`w-2 h-2 rounded-full ${isAdminMode ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="p-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/submit-case" element={<SubmitCase />} />
              <Route path="/database" element={<DatabasePage />} />
              
              {/* Rutas Ocultas Protegidas visualmente */}
              {isAdminMode && (
                <>
                  <Route path="/upload" element={<UploadPage />} />
                  <Route path="/admin-logs" element={<AdminLogs />} />
                  <Route path="/moderation" element={<Moderation />} />
                  <Route path="/manage-ads" element={<ManageAds />} />
                </>
              )}
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;