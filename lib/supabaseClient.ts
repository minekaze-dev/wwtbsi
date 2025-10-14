import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kgjdbmerkilxjqusapuh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnamRibWVya2lseGpxdXNhcHVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NDgyMjMsImV4cCI6MjA3NjAyNDIyM30.Dy4RDv2W958FAXwPFyFDKxArhlBa5-XSBlZhF9SXtMo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
