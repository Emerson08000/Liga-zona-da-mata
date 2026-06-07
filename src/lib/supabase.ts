import { createClient } from '@supabase/supabase-js'

// Se o Vite não ler do .env, ele usa os valores direto aqui como segurança
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lljufgrciitltngpseid.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInN1YiI6ImxsanVmZ3JjaWl0bHRuZ3BzZWlkIiwiaWF0IjoxNzE1cU9iZUhSZXZ3QnZlZmxraWljbTlzWlNJNkltRnViMjRsY0pweFFpT2pFM09EQXdOTA4M4MjuImV4cCI6MjNfgyNX0.WSQ-Ou_QME9WXPEeV1658P3eoK-YFkDjEi-G4qc-HOk'

export const supabase = createClient(supabaseUrl, supabaseKey)