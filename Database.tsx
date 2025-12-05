import React, { useEffect, useState } from 'react';
import { getCases, deleteCase } from '../services/storage';
import { CaseFile } from '../types';
import { Trash2, MapPin, Search } from 'lucide-react';

const DatabasePage: React.FC = () => {
  const [cases, setCases] = useState<CaseFile[]>([]);
  const [filter, setFilter] = useState('');

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

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-sm">Identidad</th>
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-sm">Ubicación</th>
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-sm">Detalles</th>
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-sm">Fecha</th>
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
                        DNI: {item.dni}
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
                    <td className="p-4 text-slate-500 dark:text-slate-500 text-sm font-mono">
                      {item.dateAdded}
                    </td>
                    <td className="p-4 text-right">
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
                  <td colSpan={5} className="p-8 text-center text-slate-400 dark:text-slate-600">
                    No se encontraron registros con ese filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DatabasePage;