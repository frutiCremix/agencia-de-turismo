import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = 'https://zzctmhsvenlxhvrzpgxm.supabase.co'
const keySupabase=process.env.SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, keySupabase);

