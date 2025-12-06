
import React, { useEffect, useState } from 'react';
import { getCases, deleteCase, deleteAllCases, voteCase } from '../services/storage';
import { CaseFile } from '../types';
import { Trash2, MapPin, Search, AlertTriangle, Eye, X } from 'lucide-react';

const DatabasePage: React.FC<{ isAdminMode?: boolean }> = ({ isAdminMode }) => {
  const [cases, setCases] = useState<CaseFile[]>([]);
  const [filter, setFilter] = useState('');
  const [selectedCase, setSelectedCase] = useState<CaseFile | null>(null);

  const loadCases = async () => {
    const data = await getCases();
    setCases(data);
  };

  useEffect(() => {
    loadCases();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar permanentemente este registro?')) {
      await deleteCase(id);
      loadCases();
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm('⚠️ ADVERTENCIA CRÍTICA ⚠️\n\n¿Estás seguro de que deseas ELIMINAR TODOS los casos de la base de datos?\n\nEsta acción es irreversible.')) {
        if(window.confirm('Confirmación Final: Se borrarán todos los registros. ¿Proceder?')) {
            await deleteAllCases();
            loadCases();
        }
    }
  };

  const handleVote = async (id: string, type: 'up' | 'down') => {
      await voteCase(id, type);
      if (selectedCase && selectedCase.id === id) {
        setSelectedCase({
          ...selectedCase,
          votes_up: type === 'up' ? (selectedCase.votes_up || 0) + 1 : selectedCase.votes_up,
          votes_down: type === 'down' ? (selectedCase.votes_down || 0) + 1 : selectedCase.votes_down
        });
      }
      loadCases();
  };

  const filteredCases = cases.filter(c => 
    c.name.toLowerCase().includes(filter.toLowerCase()) || 
    c.dni.includes(filter)
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Base de Datos de Casos</h2>
          <p className="text-slate-500 dark:text-slate-400">Gestione todas las entidades e incidentes registrados.</p>
        </div>
        <div className="flex items-center gap-3">
            {isAdminMode && (
                <button 
                  onClick={handleDeleteAll}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-xs"
                >
                    <AlertTriangle size={14} /> ELIMINAR TODO
                </button>
            )}
            <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
                type="text" 
                placeholder="Filtrar registros..." 
                className="pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none w-full md:w-64 text-sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            />
            </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-sm">Identidad</th>
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-sm">Ubicación</th>
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-sm">Detalles</th>
                {isAdminMode && (
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-sm text-right">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredCases.length > 0 ? (
                filteredCases.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div 
                        onClick={() => setSelectedCase(item)}
                        className="font-bold text-slate-800 dark:text-white cursor-pointer hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                        title="Clic para ver detalles completos"
                      >
                        {item.name}
                      </div>
                      <div className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 inline-block px-1.5 rounded mt-1 border border-slate-200 dark:border-slate-700">
                        {item.dni}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} className="text-slate-400" />
                        {item.location}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 text-sm max-w-xs truncate" title={item.details}>
                      {item.details}
                    </td>
                    {isAdminMode && (
                      <td className="p-4 text-right flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedCase(item)}
                          className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/30 rounded-lg transition-colors"
                          title="Ver Completo"
                        >
                           <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          title="Eliminar Registro"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isAdminMode ? 4 : 3} className="p-8 text-center text-slate-400 dark:text-slate-600">
                    No se encontraron registros con ese filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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

export default DatabasePage;
