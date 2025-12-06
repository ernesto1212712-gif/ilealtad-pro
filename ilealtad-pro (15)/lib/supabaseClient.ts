import { createClient } from '@supabase/supabase-js';

// --- TUS CREDENCIALES DE SUPABASE ---

// 1. TU URL:
const SUPABASE_URL = 'https://fgnbpkaegbwnojprvyuf.supabase.co';

// 2. TU CLAVE ANON PUBLIC:
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnbmJwa2FlZ2J3bm9qcHJ2eXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NzE2MjMsImV4cCI6MjA4MDU0NzYyM30.IFH2pkTiIgRvzI1SorWsmXQdOEyzNIQrqoI2fG9kCwI';

// Lógica de conexión
// Ahora que las claves están puestas, la variable 'supabase' dejará de ser null
// y la aplicación se conectará a la nube automáticamente.
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);