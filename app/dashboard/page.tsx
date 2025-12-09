'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { LogOut, Plus, Trash2, Copy, ExternalLink } from 'lucide-react';

interface ShortURL {
  id: number;
  long_url: string;
  short_code: string;
  created_at: string;
  clicks: number;
}

export default function Dashboard() {
  const [shortUrls, setShortUrls] = useState<ShortURL[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [newUrl, setNewUrl] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/auth/login';
        return;
      }
      setUser(user);
      fetchShortUrls();
    };
    checkAuth();
  }, []);

  const fetchShortUrls = async () => {
    try {
      const { data, error } = await supabase
        .from('short_urls')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setShortUrls(data || []);
    } catch (error) {
      console.error('Error fetching URLs:', error);
    } finally {
      setLoading(false);
    }
  };

  const createShortUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;

    setCreating(true);
    try {
      const shortCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const { error } = await supabase
        .from('short_urls')
        .insert([{
          long_url: newUrl,
          short_code: shortCode,
          clicks: 0
        }]);

      if (error) throw error;
      setNewUrl('');
      fetchShortUrls();
    } catch (error) {
      console.error('Error creating short URL:', error);
    } finally {
      setCreating(false);
    }
  };

  const deleteUrl = async (id: number) => {
    try {
      const { error } = await supabase
        .from('short_urls')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchShortUrls();
    } catch (error) {
      console.error('Error deleting URL:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
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
          <div>
            <h1 className="text-2xl font-bold text-white">The GDevelopers</h1>
            <p className="text-slate-400 text-sm">Short URL Manager</p>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/analytics" className="text-slate-300 hover:text-white transition">
              📊 Analytics
            </Link>
            <Link href="/profile" className="text-slate-300 hover:text-white transition">
              👤 Profile
            </Link>
            <Link href="/docs" className="text-slate-300 hover:text-white transition">
              📚 Docs
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Create New URL Section */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Short URL
          </h2>
          <form onSubmit={createShortUrl} className="flex gap-4">
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="Enter long URL (e.g., https://example.com/very/long/path)"
              className="flex-1 px-4 py-2 bg-slate-700 text-white placeholder-slate-400 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
              required
            />
            <button
              type="submit"
              disabled={creating}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create'}
            </button>
          </form>
        </div>

        {/* URLs List */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-xl font-bold text-white">Your Short URLs ({shortUrls.length})</h2>
          </div>

          {shortUrls.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-400">
              No short URLs yet. Create one above to get started!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Short Code</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Original URL</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Clicks</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Created</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {shortUrls.map((url) => (
                    <tr key={url.id} className="hover:bg-slate-700/30 transition">
                      <td className="px-6 py-4">
                        <code className="text-blue-400 font-mono text-sm">{url.short_code}</code>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-300 text-sm truncate max-w-xs" title={url.long_url}>
                          {url.long_url}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-300 font-semibold">{url.clicks}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm">
                        {new Date(url.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => copyToClipboard(`https://shorturl.thegdevelopers.online/api/redirect/${url.short_code}`)}
                            className="p-2 hover:bg-slate-700 rounded transition text-slate-300 hover:text-blue-400"
                            title="Copy short URL"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <a
                            href={`https://shorturl.thegdevelopers.online/api/redirect/${url.short_code}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-slate-700 rounded transition text-slate-300 hover:text-green-400"
                            title="Visit short URL"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => deleteUrl(url.id)}
                            className="p-2 hover:bg-red-900/30 rounded transition text-slate-300 hover:text-red-400"
                            title="Delete URL"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
