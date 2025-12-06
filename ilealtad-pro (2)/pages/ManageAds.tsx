import React, { useEffect, useState } from 'react';
import { getAds, saveAd, deleteAd } from '../services/storage';
import { Ad } from '../types';
import { Megaphone, Trash2, PlusCircle, Smartphone, GraduationCap, Globe } from 'lucide-react';

const ManageAds: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [newAd, setNewAd] = useState({
    title: '',
    description: '',
    contact: '939 544 566',
    color: 'blue' as const,
    type: 'dashboard' as const
  });

  const loadAds = async () => {
    const data = await getAds();
    // Filter hardcoded defaults from view if you only want to manage dynamic ones, 
    // or keep them all. For management, usually we only delete what we created.
    // For now we show all, but ID hardcoded ones might fail to delete in SQL if not in DB.
    setAds(data);
  };
  
  useEffect(() => { loadAds(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveAd({
      id: crypto.randomUUID(),
      ...newAd
    });
    setNewAd({ title: '', description: '', contact: '939 544 566', color: 'blue', type: 'dashboard' });
    loadAds();
  };

  const handleDelete = async (id: string) => {
    await deleteAd(id);
    loadAds();
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Megaphone className="text-brand-600" />
          Gestor de Anuncios
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Cree anuncios personalizados que aparecerán en el Dashboard y Sidebar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-lg mb-4 dark:text-white">Nuevo Anuncio</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Título</label>
                <input required type="text" className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded dark:text-white dark:border-slate-700" value={newAd.title} onChange={e => setNewAd({...newAd, title: e.target.value})} placeholder="Ej: HACKEO FACEBOOK" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Descripción</label>
                <textarea required className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded dark:text-white dark:border-slate-700" value={newAd.description} onChange={e => setNewAd({...newAd, description: e.target.value})} placeholder="Detalles del servicio..." rows={3} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Color</label>
                <select className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded dark:text-white dark:border-slate-700" value={newAd.color} onChange={e => setNewAd({...newAd, color: e.target.value as any})}>
                  <option value="blue">Azul</option>
                  <option value="green">Verde</option>
                  <option value="red">Rojo</option>
                  <option value="amber">Amarillo</option>
                  <option value="purple">Morado</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Ubicación</label>
                <select className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded dark:text-white dark:border-slate-700" value={newAd.type} onChange={e => setNewAd({...newAd, type: e.target.value as any})}>
                  <option value="dashboard">Dashboard (Servicios Elite)</option>
                  <option value="sidebar">Sidebar (Menú Lateral)</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-brand-600 text-white py-2 rounded font-bold hover:bg-brand-700 flex items-center justify-center gap-2">
                <PlusCircle size={16} /> AGREGAR
              </button>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-lg dark:text-white">Anuncios Activos</h3>
            {ads.length === 0 && <p className="text-slate-500">No hay anuncios personalizados.</p>}
            {ads.map(ad => (
              <div key={ad.id} className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                 <div className="flex items-start gap-3">
                    <div className={`p-3 rounded bg-${ad.color}-500/10 text-${ad.color}-500`}>
                       {ad.type === 'sidebar' ? <Globe size={20} /> : <Smartphone size={20} />}
                    </div>
                    <div>
                      <h4 className={`font-bold text-${ad.color}-600 dark:text-${ad.color}-400 uppercase`}>{ad.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{ad.description}</p>
                      <span className="text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1 rounded mt-1 inline-block">
                        Ubicación: {ad.type} | Contacto: {ad.contact}
                      </span>
                    </div>
                 </div>
                 <button onClick={() => handleDelete(ad.id)} className="text-slate-400 hover:text-red-500 p-2">
                   <Trash2 size={20} />
                 </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ManageAds;