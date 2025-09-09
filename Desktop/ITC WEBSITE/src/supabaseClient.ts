import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gexyezortpknaqxmcwis.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseAnonKey) {
  throw new Error("VITE_SUPABASE_KEY is not set in .env file");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
