import { createClient } from '@supabase/supabase-js';

// ⚠️  REEMPLAZA ESTOS DOS VALORES CON LOS TUYOS DE SUPABASE
// Los encuentras en: Supabase > Project Settings > API
const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL  || 'https://TU_PROYECTO.supabase.co';
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || 'TU_ANON_KEY';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
