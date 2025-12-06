
import React, { useEffect, useState } from 'react';
import { getCases, deleteCase, deleteAllCases } from '../services/storage';
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
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-sm text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.length > 0 ? (
                filteredCases.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-800 dark:text-white">{item.name}</div>
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400 dark:text-slate-600">
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-start mb-4 border-b border-slate-100 dark:border-slate-800 pb-4">
               <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">{selectedCase.name}</h3>
                  <p className="text-sm text-slate-500">{selectedCase.location} • ID: {selectedCase.dni}</p>
               </div>
               <button onClick={() => setSelectedCase(null)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                 <X size={24} className="text-slate-400" />
               </button>
            </div>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
               <div>
                   <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">Detalles del Caso</h4>
                   <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                       {selectedCase.details}
                   </p>
               </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
               <button onClick={() => setSelectedCase(null)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors">
                   Cerrar
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabasePage;