'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { User, Mail, LogOut, Save, ArrowLeft } from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/auth/login';
        return;
      }
      setUser(user);
      setFullName(user.user_metadata?.full_name || '');
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });

      if (error) throw error;
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage('Error updating profile: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/auth/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-300 hover:text-white transition">
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
          {/* Profile Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{fullName || 'User'}</h2>
              <p className="text-slate-400">{user?.email}</p>
            </div>
          </div>

          {/* Success Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg border ${
              message.includes('Error')
                ? 'bg-red-900/30 border-red-700 text-red-300'
                : 'bg-green-900/30 border-green-700 text-green-300'
            }`}>
              {message}
            </div>
          )}

          {/* Profile Form */}
          <form onSubmit={handleSave} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 text-white placeholder-slate-400 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition"
              />
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg border border-slate-600">
                <Mail className="w-5 h-5" />
                <span>{user?.email}</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Email cannot be changed</p>
            </div>

            {/* Account Created */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Account Created
              </label>
              <p className="text-slate-300">
                {new Date(user?.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 border-t border-slate-700"></div>

          {/* Danger Zone */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-red-400">Danger Zone</h3>
            <button
              onClick={handleLogout}
              className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
