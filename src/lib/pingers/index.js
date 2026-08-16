import { SupabaseRestPinger } from './supabase-rest.js';
import { SupabaseAuthPinger } from './supabase-auth.js';
import { SupabaseTablePinger } from './supabase-table.js';
import { HttpPinger } from './http-pinger.js';

export const getPinger = (project) => {
  const method = project.ping_method?.toUpperCase() || 'SUPABASE_TABLE';
  
  switch (method) {
    case 'SUPABASE_AUTH':
      return new SupabaseAuthPinger(project);
    case 'SUPABASE_REST':
      return new SupabaseRestPinger(project);
    case 'HTTP_GET':
    case 'HTTP_POST':
      return new HttpPinger(project);
    case 'SUPABASE_TABLE':
    default:
      return new SupabaseTablePinger(project);
  }
};
