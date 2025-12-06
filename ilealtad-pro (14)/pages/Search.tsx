
import React, { useState } from 'react';
import { getPublicCases, voteCase } from '../services/storage';
import { CaseFile } from '../types';
import { Search as SearchIcon, MapPin, FileText, User, Activity, AlertTriangle, CheckCircle, Eye, X } from 'lucide-react';

const SearchPage: React.FC<{ isAdminMode?: boolean }> = ({ isAdminMode }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CaseFile[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseFile | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    const allCases = await getPublicCases();
    const filtered = allCases.filter(
      (c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.dni.includes(query) ||
        c.location.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filtered);
    setHasSearched(true);
    setIsSearching(false);
  };

  const handleVote = async (id: string, type: 'up' | 'down') => {
    await voteCase(id, type);
    // Actualizar localmente para feedback inmediato
    if (selectedCase && selectedCase.id === id) {
      setSelectedCase({
        ...selectedCase,
        votes_up: type === 'up' ? (selectedCase.votes_up || 0) + 1 : selectedCase.votes_up,
        votes_down: type === 'down' ? (selectedCase.votes_down || 0) + 1 : selectedCase.votes_down
      });
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-3">Inteligencia y Rastreo</h2>
        <p className="text-slate-500 dark:text-slate-400">Acceda a la base de datos global. Búsqueda por Nombre, DNI o Ubicación.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-xl dark:shadow-brand-900/20 border border-slate-100 dark:border-slate-800 max-w-2xl mx-auto mb-12 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>
        
        <form onSubmit={handleSearch} className="flex items-center relative z-10">
          <div className="pl-4 text-slate-400">
            <SearchIcon size={24} />
          </div>
          <input
            type="text"
            className="w-full px-4 py-4 text-lg text-slate-800 dark:text-white bg-transparent border-none focus:ring-0 placeholder:text-slate-400 outline-none"
            placeholder="Ingrese objetivo, DNI o Alias..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            disabled={isSearching}
            className="bg-brand-600 hover:bg-brand-500 text-white px-8 py-3 rounded-xl font-bold tracking-wide transition-all shadow-lg shadow-brand-600/30 m-1 disabled:opacity-70"
          >
            {isSearching ? '...' : 'LOCALIZAR'}
          </button>
        </form>
      </div>

      {hasSearched && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-2 mb-6">
            <h3 className="text-sm font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest flex items-center gap-2">
              <Activity size={16} />
              Resultados de la Operación: {results.length}
            </h3>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 border-dashed">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                 <User size={40} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">Objetivo No Encontrado</h3>
              <p className="text-slate-400 dark:text-slate-500 mt-2">No existen registros vinculados a "{query}" en la red actual.</p>
            </div>
          ) : (
            <div className="grid gap-5">
              {results.map((item) => (
                <div 
                  key={item.id} 
                  className={`bg-white dark:bg-slate-900 p-6 rounded-xl shadow-lg border-l-4 transition-all hover:scale-[1.01] ${
                    item.status === 'Active' ? 'border-l-blue-500 border-y border-r border-slate-200 dark:border-slate-800 shadow-blue-500/5' : 
                    item.status === 'Pending' ? 'border-l-amber-500 border-y border-r border-slate-200 dark:border-slate-800 shadow-amber-500/5' : 
                    'border-l-green-500 border-y border-r border-slate-200 dark:border-slate-800 shadow-green-500/5'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{item.name}</h4>
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs px-3 py-1 rounded font-mono font-bold border border-slate-200 dark:border-slate-700">
                          ID: {item.dni}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 my-4 max-w-md">
                         <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <MapPin size={16} className="text-brand-500" />
                            <span className="font-medium">{item.location}</span>
                         </div>
                         <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <FileText size={16} className="text-brand-500" />
                            <span className="font-mono">{item.dateAdded}</span>
                         </div>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700/50 relative">
                        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium line-clamp-3">
                          <span className="text-brand-600 dark:text-brand-400 font-bold uppercase text-xs mr-2">DETALLES DEL CASO:</span>
                          {item.details}
                        </p>
                        <button 
                            onClick={() => setSelectedCase(item)}
                            className="text-xs text-brand-600 dark:text-brand-400 hover:underline mt-2 flex items-center gap-1 font-bold"
                        >
                            <Eye size={12} /> VER EXPEDIENTE COMPLETO
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between min-h-[100px]">
                      <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                          item.status === 'Active' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 
                          item.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 
                          'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                          {item.status === 'Active' ? <Activity size={12}/> : item.status === 'Pending' ? <AlertTriangle size={12}/> : <CheckCircle size={12}/>}
                          {item.status === 'Active' ? 'ACTIVO' : item.status === 'Pending' ? 'PENDIENTE' : 'CERRADO'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Modal Ver Detalle */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col relative">
            
            <button 
              onClick={() => setSelectedCase(null)} 
              className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-800 dark:text-white transition-colors z-10"
            >
              <X size={24} />
            </button>

            <div className="p-8 overflow-y-auto custom-scrollbar flex flex-col bg-slate-50/50 dark:bg-slate-900 h-full">
               <div className="mb-6">
                  <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider bg-brand-50 dark:bg-brand-900/20 px-2 py-1 rounded">Expediente Confidencial</span>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-2 leading-tight uppercase">{selectedCase.name}</h2>
                  <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                     <MapPin size={14} /> {selectedCase.location}
                  </p>
               </div>

               <div className="space-y-6 flex-1">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">DNI / ID</p>
                          <p className="font-mono font-medium text-slate-800 dark:text-slate-200 text-lg">{selectedCase.dni}</p>
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Fecha</p>
                          <p className="font-mono font-medium text-slate-800 dark:text-slate-200 text-lg">{selectedCase.dateAdded}</p>
                      </div>
                   </div>

                   <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                       <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-white mb-3">
                           <AlertTriangle size={16} className="text-amber-500" /> Motivo del Registro
                       </h4>
                       <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                           {selectedCase.details}
                       </div>
                   </div>

                   {/* Voting Section */}
                   <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                       <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Votación del Caso</h4>
                       
                       <div className="space-y-3 mb-4">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-500">Aprobado (Verdadero)</span>
                                <span className="font-bold text-slate-700 dark:text-slate-300">
                                   {Math.round(((selectedCase.votes_up || 0) / ((selectedCase.votes_up || 0) + (selectedCase.votes_down || 0) || 1)) * 100)}%
                                </span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500" style={{ width: `${((selectedCase.votes_up || 0) / ((selectedCase.votes_up || 0) + (selectedCase.votes_down || 0) || 1)) * 100}%` }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-500">Rechazado (Falso)</span>
                                <span className="font-bold text-slate-700 dark:text-slate-300">
                                    {Math.round(((selectedCase.votes_down || 0) / ((selectedCase.votes_up || 0) + (selectedCase.votes_down || 0) || 1)) * 100)}%
                                </span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-red-500" style={{ width: `${((selectedCase.votes_down || 0) / ((selectedCase.votes_up || 0) + (selectedCase.votes_down || 0) || 1)) * 100}%` }}></div>
                            </div>
                          </div>
                       </div>

                       {isAdminMode && (
                         <div className="grid grid-cols-2 gap-3">
                             <button 
                                onClick={() => handleVote(selectedCase.id, 'up')}
                                className="flex flex-col items-center justify-center p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/40 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                             >
                                 <span className="text-2xl font-bold text-green-600 dark:text-green-400">{selectedCase.votes_up || 0}</span>
                                 <span className="text-xs text-green-700 dark:text-green-500 font-bold uppercase mt-1">Aprobar</span>
                             </button>
                             <button 
                                onClick={() => handleVote(selectedCase.id, 'down')}
                                className="flex flex-col items-center justify-center p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                             >
                                 <span className="text-2xl font-bold text-red-600 dark:text-red-400">{selectedCase.votes_down || 0}</span>
                                 <span className="text-xs text-red-700 dark:text-red-500 font-bold uppercase mt-1">Rechazar</span>
                             </button>
                         </div>
                       )}
                       {!isAdminMode && (
                           <p className="text-[10px] text-slate-400 text-center mt-3 border-t border-slate-100 dark:border-slate-700 pt-2">
                               Sistema de votación restringido.
                           </p>
                       )}
                   </div>
               </div>

               <button 
                  onClick={() => setSelectedCase(null)} 
                  className="mt-6 w-full py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-xl font-bold transition-colors md:hidden"
               >
                   Cerrar Expediente
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
