import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zzctmhsvenlxhvrzpgxm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6Y3RtaHN2ZW5seGh2cnpwZ3htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg2MTQ2MjEsImV4cCI6MjAyNDE5MDYyMX0.3gXn93mvof_A10sEsdSmgQX7fY_in5nvZU4n61ONTlI';
export const supabase = createClient(supabaseUrl, supabaseKey)

