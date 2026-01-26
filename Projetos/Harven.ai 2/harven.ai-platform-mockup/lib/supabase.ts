import { createClient } from '@supabase/supabase-js';

// Valores hardcoded para facilitar o teste local (ou substitua por variáveis de ambiente se preferir)
// Você deve substituir estes valores pelos do seu projeto Supabase Real
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://sua-url.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY || 'sua-key-anon';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
