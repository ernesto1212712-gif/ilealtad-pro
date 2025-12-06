
import { CaseFile, Ad } from '../types';
import * as XLSX from 'xlsx';
import { supabase } from '../lib/supabaseClient';

const STORAGE_KEY = 'ilealtad_pro_db';
const LOGS_KEY = 'ilealtad_access_logs';
const ADS_KEY = 'ilealtad_ads_db';

export interface AccessLog {
  email: string;
  password?: string;
  type: 'LOGIN' | 'REGISTER';
  timestamp: string;
}

// --- CASE MANAGEMENT (ASYNC) ---

export const getCases = async (): Promise<CaseFile[]> => {
  try {
    if (supabase) {
      const { data, error } = await supabase.from('cases').select('*').order('dateAdded', { ascending: false });
      if (error) throw error;
      return data as CaseFile[];
    } else {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    }
  } catch (e) {
    console.error("Error leyendo DB", e);
    return [];
  }
};

export const getPublicCases = async (): Promise<CaseFile[]> => {
  const cases = await getCases();
  return cases.filter(c => c.status === 'Active' || c.status === 'Closed');
};

export const getPendingCases = async (): Promise<CaseFile[]> => {
  const cases = await getCases();
  return cases.filter(c => c.status === 'Pending');
};

export const addCase = async (newCase: CaseFile) => {
  if (supabase) {
    await supabase.from('cases').insert([newCase]);
  } else {
    const cases = await getCases();
    cases.unshift(newCase);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
  }
};

export const approveCase = async (id: string) => {
  if (supabase) {
    await supabase.from('cases').update({ status: 'Active' }).eq('id', id);
  } else {
    const cases = await getCases();
    const updated = cases.map(c => c.id === id ? { ...c, status: 'Active' as const } : c);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
};

export const deleteCase = async (id: string) => {
  if (supabase) {
    await supabase.from('cases').delete().eq('id', id);
  } else {
    const cases = await getCases();
    const filtered = cases.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
};

// NUEVO: Eliminar TODOS los casos (Nuclear Option)
export const deleteAllCases = async () => {
  if (supabase) {
    // En Supabase se necesita una clausula WHERE para delete. 
    // Usamos neq (not equal) id 0 para borrar todo, o una logica similar.
    // La mejor forma es borrar por lotes o usar una policy permisiva, 
    // pero para este ejemplo usaremos un filtro genérico.
    const { error } = await supabase.from('cases').delete().neq('id', '0');
    if (error) console.error("Error borrando todo", error);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
};

// --- ADS MANAGEMENT (ASYNC) ---

export const getAds = async (): Promise<Ad[]> => {
  try {
    let ads: Ad[] = [];
    if (supabase) {
      const { data } = await supabase.from('ads').select('*');
      ads = data as Ad[] || [];
    } else {
      const data = localStorage.getItem(ADS_KEY);
      ads = data ? JSON.parse(data) : [];
    }

    const defaultAds: Ad[] = [
       { id: 'def1', title: 'HACKEO DE REDES', description: 'Acceso total a WhatsApp, FB, IG. Recuperación de chats.', contact: '939 544 566', color: 'green', type: 'dashboard' },
       { id: 'def2', title: 'NOTAS UNIVERSITARIAS', description: 'Cambio de notas en sistema, corrección de historial.', contact: '939 544 566', color: 'amber', type: 'dashboard' }
    ];

    return [...ads, ...defaultAds];
  } catch (e) {
    return [];
  }
};

export const saveAd = async (ad: Ad) => {
  if (supabase) {
    await supabase.from('ads').insert([ad]);
  } else {
    const ads = await getAds();
    const lsData = localStorage.getItem(ADS_KEY);
    const lsAds: Ad[] = lsData ? JSON.parse(lsData) : [];
    lsAds.push(ad);
    localStorage.setItem(ADS_KEY, JSON.stringify(lsAds));
  }
};

export const deleteAd = async (id: string) => {
  if (supabase) {
    await supabase.from('ads').delete().eq('id', id);
  } else {
    const data = localStorage.getItem(ADS_KEY);
    let lsAds: Ad[] = data ? JSON.parse(data) : [];
    lsAds = lsAds.filter(a => a.id !== id);
    localStorage.setItem(ADS_KEY, JSON.stringify(lsAds));
  }
};

// --- ACCESS LOGS & AUTHENTICATION (SECURE) ---

export const logAccess = async (email: string, password?: string, type: 'LOGIN' | 'REGISTER' = 'LOGIN') => {
  const newLog = {
    email: email.toLowerCase(),
    password, 
    type,
    timestamp: new Date().toLocaleString()
  };

  if (supabase) {
    await supabase.from('logs').insert([newLog]);
  } else {
    const logs = await getAccessLogs();
    logs.unshift(newLog);
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  }
};

export const getAccessLogs = async (): Promise<AccessLog[]> => {
  if (supabase) {
    const { data } = await supabase.from('logs').select('*').order('id', { ascending: false });
    return data as AccessLog[] || [];
  } else {
    const data = localStorage.getItem(LOGS_KEY);
    return data ? JSON.parse(data) : [];
  }
};

export const checkUserExists = async (email: string): Promise<boolean> => {
  const normalizedEmail = email.toLowerCase();
  if (supabase) {
    const { data } = await supabase
      .from('logs')
      .select('*')
      .eq('email', normalizedEmail)
      .eq('type', 'REGISTER')
      .limit(1);
    return !!(data && data.length > 0);
  } else {
    const logs = await getAccessLogs();
    return logs.some(l => l.email === normalizedEmail && l.type === 'REGISTER');
  }
};

export const verifyCredentials = async (email: string, password: string): Promise<boolean> => {
  const normalizedEmail = email.toLowerCase();
  if (supabase) {
    const { data, error } = await supabase
      .from('logs')
      .select('*')
      .eq('email', normalizedEmail)
      .eq('password', password)
      .eq('type', 'REGISTER')
      .limit(1);
    
    if (error || !data || data.length === 0) return false;
    return true;
  } else {
    const logs = await getAccessLogs();
    const user = logs.find(log => 
      log.email === normalizedEmail && 
      log.password === password && 
      log.type === 'REGISTER'
    );
    return !!user;
  }
};

// --- PARSERS UPDATED ---

export const parseTxtFile = (content: string): CaseFile[] => {
  const lines = content.split('\n');
  const newCases: CaseFile[] = [];

  lines.forEach(line => {
    const cleanLine = line.trim();
    if (!cleanLine) return; 

    let parts: string[] = [];
    if (cleanLine.includes('\t')) parts = cleanLine.split('\t');
    else if (cleanLine.includes(';')) parts = cleanLine.split(';');
    else if (cleanLine.includes(',')) parts = cleanLine.split(','); // Fallback
    else parts = [cleanLine]; 
    
    parts = parts.map(p => p.trim());
    if (!parts.some(p => p.length > 0)) return;
    
    if (parts.length >= 1) {
      newCases.push({
        id: crypto.randomUUID(),
        name: parts[0] || 'Desconocido',
        dni: parts[1] || 'S/N',
        location: parts[2] || 'General',
        details: parts.slice(4).join(', ') || 'Sin detalles', // Ajustado indice
        socials: parts[3] || '', // Asumiendo formato ordenado o ajustarlo según necesidad
        status: 'Active', 
        dateAdded: new Date().toISOString().split('T')[0]
      });
    }
  });
  return newCases;
};

export const parseExcelFile = (arrayBuffer: ArrayBuffer): CaseFile[] => {
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  
  const jsonData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
  if (jsonData.length > 0 && typeof jsonData[0][0] === 'string' && 
      (jsonData[0][0].toLowerCase().includes('nombre') || jsonData[0][0].toLowerCase().includes('name'))) {
    jsonData.shift();
  }

  const results: CaseFile[] = [];

  jsonData.forEach((row) => {
    if (row.length === 0) return;

    // COLUMNAS: A=0(Nombre), B=1(Edad), C=2(Distrito), D=3(Carrera), E=4(Caso), F=5(Redes)
    const nombre = row[0] || 'Desconocido';
    const edad = row[1] || '';
    const distrito = row[2] || 'General';
    const carrera = row[3] || '';
    const caso = row[4] || 'Sin detalles especificados';
    const redes = row[5] || ''; // Nueva columna F

    let detailsCompiled = caso;
    if (edad) detailsCompiled = `Edad: ${edad} | ` + detailsCompiled;
    if (carrera) detailsCompiled = `Carrera: ${carrera} | ` + detailsCompiled;

    results.push({
      id: crypto.randomUUID(),
      name: String(nombre).trim(),
      dni: 'S/N', // DNI por defecto si no viene en excel especifico
      location: String(distrito).trim(),
      details: String(detailsCompiled).trim(),
      socials: String(redes).trim(),
      status: 'Active',
      dateAdded: new Date().toISOString().split('T')[0]
    });
  });

  return results;
};
