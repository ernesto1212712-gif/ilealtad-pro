import React, { useEffect, useState } from 'react';
import { getCases, getAds } from '../services/storage';
import { CaseFile, Ad } from '../types';
import { Users, FileText, AlertCircle, TrendingUp, Search, FilePlus, Smartphone, GraduationCap, ShieldAlert, Globe } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [cases, setCases] = useState<CaseFile[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const casesData = await getCases();
      const adsData = await getAds();
      setCases(casesData);
      setAds(adsData.filter(a => a.type === 'dashboard'));
      setLoading(false);
    };
    fetchData();
  }, []);

  const total = cases.length;
  const active = cases.filter(c => c.status === 'Active').length;
  const pending = cases.filter(c => c.status === 'Pending').length;

  const chartData = [
    { name: 'Activos', value: active, color: '#2563eb' },
    { name: 'Pendientes', value: pending, color: '#f59e0b' },
    { name: 'Cerrados', value: total - (active + pending), color: '#10b981' },
  ];

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{loading ? '...' : value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Resumen del Sistema</h2>
        <p className="text-slate-500 dark:text-slate-400">Bienvenido, Agente. Estado de la red: <span className="text-green-500 font-bold">EN LÍNEA</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total de Casos" value={total} icon={Users} color="bg-brand-600 text-brand-600" />
        <StatCard title="Investigaciones Activas" value={active} icon={FileText} color="bg-blue-500 text-blue-500" />
        <StatCard title="Alertas (Pendientes)" value={pending} icon={AlertCircle} color="bg-amber-500 text-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-brand-600" />
            Estado de Distribución
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff'}}
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={50}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Services & Ads Section */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Acciones Rápidas</h3>
            <div className="space-y-3">
              <Link to="/search" className="w-full text-left px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-colors flex items-center justify-between group">
                Nueva Búsqueda
                <Search size={16} className="text-slate-400 group-hover:text-brand-600" />
              </Link>
              <Link to="/submit-case" className="w-full text-left px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-colors flex items-center justify-between group">
                Reportar Caso (Público)
                <FilePlus size={16} className="text-slate-400 group-hover:text-green-600" />
              </Link>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-700 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-brand-900 opacity-50"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <ShieldAlert size={20} className="text-red-500 animate-pulse" />
                SERVICIOS ELITE
              </h3>
              
              <div className="space-y-4">
                 {/* Render dynamic ads - Default ones are included in getAds response */}
                {ads.map((ad, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2 rounded hover:bg-white/5 transition-colors">
                    <div className={`bg-${ad.color}-500/20 p-2 rounded text-${ad.color}-400`}>
                      {ad.title.includes('HACKEO') ? <Smartphone size={18} /> : 
                       ad.title.includes('NOTAS') ? <GraduationCap size={18} /> : <Globe size={18} />}
                    </div>
                    <div>
                      <h4 className={`font-bold text-${ad.color}-400 text-sm uppercase`}>{ad.title}</h4>
                      <p className="text-xs text-slate-300 mt-1">{ad.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700 text-center">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2">CONTACTO SEGURO Y ANÓNIMO</p>
                <div className="bg-white/10 rounded-lg py-2 border border-white/10">
                   <p className="text-2xl font-mono font-bold text-white tracking-widest text-shadow-glow">939 544 566</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;