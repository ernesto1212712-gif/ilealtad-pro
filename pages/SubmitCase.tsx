import React, { useState } from 'react';
import { addCase } from '../services/storage';
import { FilePlus, Send, CheckCircle } from 'lucide-react';

const SubmitCase: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    dni: '',
    location: '',
    details: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await addCase({
      id: crypto.randomUUID(),
      name: formData.name,
      dni: formData.dni,
      location: formData.location,
      details: formData.details,
      status: 'Pending', 
      dateAdded: new Date().toISOString().split('T')[0]
    });
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center mt-20 animate-in fade-in slide-in-from-bottom-4">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} className="text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Reporte Enviado</h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg mb-8">
          Su caso ha sido encriptado y enviado a nuestros servidores. 
          <br/>
          Un administrador revisará la información antes de publicarla en la red global.
        </p>
        <button 
          onClick={() => { setSubmitted(false); setFormData({name:'', dni:'', location:'', details:''}); }}
          className="bg-brand-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-700 transition-colors"
        >
          Enviar Otro Reporte
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <FilePlus className="text-brand-600" />
          Reportar Nuevo Caso
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Ingrese los datos del objetivo. La información será verificada por moderación.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre Completo del Objetivo</label>
              <input
                required
                type="text"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none dark:text-white"
                placeholder="Ej: Juan Perez"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">DNI / Identificación</label>
              <input
                required
                type="text"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none dark:text-white"
                placeholder="Ej: 72345678"
                value={formData.dni}
                onChange={e => setFormData({...formData, dni: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ubicación / Distrito</label>
            <input
              required
              type="text"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none dark:text-white"
              placeholder="Ej: Miraflores, Lima"
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Detalles del Incidente</label>
            <textarea
              required
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none dark:text-white resize-none"
              placeholder="Describa la situación, edad, carrera, motivos..."
              value={formData.details}
              onChange={e => setFormData({...formData, details: e.target.value})}
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-lg shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-70"
            >
              {loading ? 'ENVIANDO...' : <><Send size={20} /> ENVIAR REPORTE A BASE DE DATOS</>}
            </button>
            <p className="text-center text-xs text-slate-400 mt-4">
              Su dirección IP ha sido registrada por seguridad. No envíe información falsa.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitCase;