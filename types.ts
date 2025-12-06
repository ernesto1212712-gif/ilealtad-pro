
export interface CaseFile {
  id: string;
  name: string;
  dni: string;
  location: string;
  details: string;
  socials?: string; // Nuevo campo: Redes Sociales / Enlaces
  status: 'Active' | 'Closed' | 'Pending';
  dateAdded: string;
}

export interface User {
  email: string;
  name: string;
  role: 'admin' | 'agent';
}

export interface Stats {
  totalCases: number;
  activeCases: number;
  resolvedCases: number;
}

export interface Ad {
  id: string;
  title: string;
  description: string;
  contact: string;
  color: 'blue' | 'green' | 'amber' | 'red' | 'purple';
  type: 'sidebar' | 'dashboard';
}
