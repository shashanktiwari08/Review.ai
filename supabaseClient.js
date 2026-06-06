// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qwnphseiadealuepqajg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3bnBoc2VpYWRlYWx1ZXBxYWpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NjczMjEsImV4cCI6MjA5NjM0MzMyMX0.XKJqGR9kb9xnDX3IhsUuaA3DyUNFKB9bfwwXREtTcqA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
