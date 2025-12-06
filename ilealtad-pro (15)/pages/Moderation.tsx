import React, { useEffect, useState } from 'react';
import { getPendingCases, approveCase, deleteCase } from '../services/storage';
import { CaseFile } from '../types';
import { Gavel, Check, X, AlertCircle } from 'lucide-react';

const Moderation: React.FC = () => {
  const [pendingCases, setPendingCases] = useState<CaseFile[]>([]);

  const loadData = async () => {
    const data = await getPendingCases();
    setPendingCases(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id: string) => {
    await approveCase(id);
    loadData();
  };

  const handleReject = async (id: string) => {
    if(window.confirm('¿Rechazar y eliminar este reporte permanentemente?')) {
      await deleteCase(id);
      loadData();
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Gavel className="text-red-600" />
          Sala de Moderación
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Revise los casos enviados por usuarios antes de hacerlos públicos.
        </p>
      </div>

      {pendingCases.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
          <Check className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">Todo al día</h3>
          <p className="text-slate-500 dark:text-slate-400">No hay casos pendientes de revisión.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {pendingCases.map(item => (
            <div key={item.id} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-lg border-l-4 border-l-amber-500 border-y border-r border-slate-200 dark:border-slate-800">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                      <AlertCircle size={12} /> PENDIENTE
                    </span>
                    <span className="text-slate-400 text-xs font-mono">{item.dateAdded}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">{item.name}</h3>
                  <p className="text-sm font-mono text-slate-500 dark:text-slate-400 mb-3">DNI: {item.dni} | Ubicación: {item.location}</p>
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded text-sm text-slate-700 dark:text-slate-300">
                    {item.details}
                  </div>
                </div>
                
                <div className="flex flex-row md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-700 pt-4 md:pt-0 md:pl-6">
                  <button 
                    onClick={() => handleApprove(item.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Check size={16} /> APROBAR
                  </button>
                  <button 
                    onClick={() => handleReject(item.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <X size={16} /> RECHAZAR
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Moderation;