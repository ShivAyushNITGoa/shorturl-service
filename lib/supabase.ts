import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate credentials
const validateCredentials = () => {
  const errors: string[] = [];

  if (!supabaseUrl) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL is missing');
  } else if (!supabaseUrl.includes('supabase.co')) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL is invalid (should end with .supabase.co)');
  }

  if (!supabaseAnonKey) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is missing');
  } else if (supabaseAnonKey.includes('REPLACE_WITH')) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured (still has placeholder)');
  } else if (!supabaseAnonKey.startsWith('eyJ')) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is invalid (should start with eyJ)');
  } else if (supabaseAnonKey.length < 100) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is too short (incomplete key)');
  }

  return errors;
};

const validationErrors = validateCredentials();

// Log for debugging
if (typeof window !== 'undefined') {
  console.log('[Supabase] Configuration Check:');
  console.log('[Supabase] URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
  console.log('[Supabase] Key:', supabaseAnonKey ? '✓ Set' : '✗ Missing');
  if (validationErrors.length > 0) {
    console.error('[Supabase] Validation Errors:', validationErrors);
  }
}

if (validationErrors.length > 0) {
  const errorMsg = `Invalid Supabase Configuration:\n${validationErrors.join('\n')}\n\nPlease set correct environment variables in .env.local`;
  
  if (typeof window !== 'undefined') {
    console.error('[Supabase] ' + errorMsg);
  }
  
  throw new Error(errorMsg);
}

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

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
