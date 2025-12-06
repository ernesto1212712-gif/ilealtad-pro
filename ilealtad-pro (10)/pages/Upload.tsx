
import React, { useRef, useState } from 'react';
import { Upload as UploadIcon, FileText, CheckCircle, AlertTriangle, FileSpreadsheet, Download } from 'lucide-react';
import { parseTxtFile, parseExcelFile, addCase } from '../services/storage';
import * as XLSX from 'xlsx';

const UploadPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'uploading'>('idle');
  const [count, setCount] = useState(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatus('uploading');
    const fileName = file.name.toLowerCase();

    // Handle TXT
    if (fileName.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const newCases = parseTxtFile(content);
          await processCases(newCases);
        } catch (err) {
          console.error(err);
          setStatus('error');
        }
      };
      reader.readAsText(file);
    } 
    // Handle Excel
    else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const newCases = parseExcelFile(arrayBuffer);
          await processCases(newCases);
        } catch (err) {
          console.error(err);
          setStatus('error');
        }
      };
      reader.readAsArrayBuffer(file);
    } 
    else {
      alert('Por favor suba un archivo .txt o .xlsx.');
      setStatus('idle');
    }
  };

  const processCases = async (newCases: any[]) => {
    if (newCases.length === 0) {
      setStatus('error');
      return;
    }

    for (const c of newCases) {
      await addCase(c);
    }
    
    setCount(newCases.length);
    setStatus('success');
  };

  const downloadTemplate = () => {
    const wsWithHeader = XLSX.utils.aoa_to_sheet([
      ["Nombre", "Edad", "Distrito", "Carrera", "Caso"],
      ["Ejemplo Nombre", "25", "San Isidro", "Sistemas", "Detalles..."]
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsWithHeader, "Plantilla");
    XLSX.writeFile(wb, "Plantilla_Estricta.xlsx");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Centro de Importación (Oculto)</h2>
          <p className="text-slate-500 dark:text-slate-400">Cargue datos de inteligencia masivos.</p>
        </div>
        <button 
          onClick={downloadTemplate}
          className="flex items-center gap-2 text-brand-600 bg-brand-50 dark:bg-brand-900/20 hover:bg-brand-100 dark:hover:bg-brand-900/40 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-brand-200 dark:border-brand-900"
        >
          <Download size={16} />
          Descargar Plantilla Excel
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 transition-colors">
        <div 
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-brand-400 dark:hover:border-brand-500 transition-all group"
          onClick={() => status !== 'uploading' && fileInputRef.current?.click()}
        >
          <div className="w-16 h-16 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/50 rounded-full flex items-center justify-center mb-4 transition-colors">
            {status === 'uploading' ? <span className="animate-spin text-2xl">↻</span> : <UploadIcon size={32} />}
          </div>
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
             {status === 'uploading' ? 'Procesando y Subiendo...' : 'Clic para subir archivo'}
          </h3>
          <p className="text-slate-400 dark:text-slate-500 mt-2 text-sm text-center max-w-xs">
            Formatos soportados: <strong>.xlsx (Excel)</strong> o <strong>.txt</strong>
          </p>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".txt, .xlsx, .xls" 
            onChange={handleFileChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-green-50 dark:bg-green-900/10 p-6 rounded-lg border border-green-100 dark:border-green-900/30">
             <h4 className="font-semibold text-green-800 dark:text-green-400 flex items-center gap-2 mb-3">
              <FileSpreadsheet size={18} /> Orden de Columnas Excel
            </h4>
            <p className="text-sm text-green-700 dark:text-green-500 mb-2">El archivo debe respetar estrictamente este orden:</p>
            <ol className="text-xs text-green-800 dark:text-green-400 list-decimal ml-4 space-y-1 font-bold">
              <li>Nombre (Columna A)</li>
              <li>Edad (Columna B)</li>
              <li>Distrito (Columna C)</li>
              <li>Carrera (Columna D)</li>
              <li>Caso / Detalles (Columna E)</li>
            </ol>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
            <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-3">
              <FileText size={18} /> Copiado de Excel a TXT
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              Si copia de Excel a TXT, asegúrese de que el Excel original tenga el mismo orden de columnas descrito a la izquierda.
            </p>
          </div>
        </div>

        {status === 'success' && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle className="text-green-600 dark:text-green-400 mt-0.5" size={20} />
            <div>
              <h5 className="font-bold text-green-800 dark:text-green-400">Importación Exitosa</h5>
              <p className="text-green-700 dark:text-green-500 text-sm">Se procesaron y archivaron correctamente <strong>{count}</strong> nuevos casos en la nube.</p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
            <AlertTriangle className="text-red-600 dark:text-red-400 mt-0.5" size={20} />
            <div>
              <h5 className="font-bold text-red-800 dark:text-red-400">Error de Importación</h5>
              <p className="text-red-700 dark:text-red-500 text-sm">El archivo no pudo ser leído o está vacío.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;