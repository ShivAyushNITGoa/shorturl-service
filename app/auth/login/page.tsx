'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Mail, Lock, LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('[Login] Attempting login with:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('[Login] Auth error:', error);
        throw error;
      }

      if (data?.user) {
        console.log('[Login] Success, sending auth to extension');
        
        const userEmail = data.user.email || '';
        const userId = data.user.id || '';
        const userName = data.user.user_metadata?.full_name || (userEmail ? userEmail.split('@')[0] : 'User');
        const authToken = data.session?.access_token || '';
        
        // Store in localStorage for extension to pick up
        localStorage.setItem('extensionAuthToken', authToken);
        localStorage.setItem('extensionUserEmail', userEmail);
        localStorage.setItem('extensionUserId', userId);
        localStorage.setItem('extensionUserName', userName);
        
        console.log('[Login] Auth stored in localStorage');
        
        // Try to send auth token to extension via chrome.runtime.sendMessage
        const chromeRuntime = (window as any).chrome?.runtime;
        if (chromeRuntime) {
          try {
            // Send to extension background script
            chromeRuntime.sendMessage(
              {
                type: 'AUTH_SUCCESS',
                authToken: authToken,
                userEmail: userEmail,
                userId: userId,
                userName: userName
              },
              (response: any) => {
                console.log('[Login] Auth message sent to extension:', response);
              }
            );
          } catch (err) {
            console.log('[Login] Could not send to extension, using localStorage fallback');
          }
        }
        
        // Also broadcast to all windows/tabs
        if (typeof window !== 'undefined') {
          window.postMessage({
            type: 'AUTH_SUCCESS',
            authToken: authToken,
            userEmail: userEmail,
            userId: userId,
            userName: userName
          }, '*');
          console.log('[Login] Auth broadcasted via postMessage');
        }
        
        console.log('[Login] Redirecting to dashboard');
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      console.error('[Login] Error:', err);
      const errorMessage = err.message || 'Login failed';
      
      // Provide helpful error messages
      if (errorMessage.includes('Invalid login credentials')) {
        setError('Invalid email or password');
      } else if (errorMessage.includes('Invalid API key')) {
        setError('Configuration error: Invalid Supabase API key. Please contact support.');
      } else if (errorMessage.includes('Network')) {
        setError('Network error. Please check your connection.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-slate-400">Sign in to your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 text-white placeholder-slate-400 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 text-white placeholder-slate-400 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-700"></div>
            <span className="text-slate-400 text-sm">or</span>
            <div className="flex-1 h-px bg-slate-700"></div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-slate-400">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300 font-semibold transition">
              Sign up
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-8">
          © 2025 The GDevelopers. All rights reserved.
        </p>
      </div>
    </div>
  );
}
