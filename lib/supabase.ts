import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Log for debugging
if (typeof window !== 'undefined') {
  console.log('[Supabase] URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
  console.log('[Supabase] Key:', supabaseAnonKey ? '✓ Set' : '✗ Missing');
}

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = `Missing Supabase environment variables:
    - NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? 'Set' : 'Missing'}
    - NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? 'Set' : 'Missing'}`;
  
  if (typeof window !== 'undefined') {
    console.error('[Supabase] ' + errorMsg);
  }
  
  throw new Error(errorMsg);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'auto';
  notifications_enabled: boolean;
  sync_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeatureUsage {
  id: string;
  user_id: string;
  feature_id: string;
  used_at: string;
  count: number;
}
