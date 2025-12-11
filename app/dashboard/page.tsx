'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { LogOut, Copy, Download, Trash2, Palette, Plus, TrendingUp, ExternalLink } from 'lucide-react';

const themes = [
  { id: 'midnight', label: 'Midnight', bg: 'from-slate-900 via-slate-950 to-black', card: 'bg-slate-900/70', accent: 'text-blue-300', primary: '#3b82f6' },
  { id: 'ocean', label: 'Ocean', bg: 'from-cyan-900 via-blue-900 to-slate-950', card: 'bg-cyan-900/60', accent: 'text-cyan-200', primary: '#0ea5e9' },
  { id: 'sunset', label: 'Sunset', bg: 'from-amber-900 via-orange-900 to-red-950', card: 'bg-amber-900/40', accent: 'text-amber-200', primary: '#f97316' },
  { id: 'forest', label: 'Forest', bg: 'from-green-900 via-emerald-950 to-black', card: 'bg-green-900/50', accent: 'text-green-200', primary: '#10b981' },
  { id: 'aurora', label: 'Aurora', bg: 'from-purple-900 via-pink-900 to-slate-950', card: 'bg-purple-900/50', accent: 'text-purple-200', primary: '#a855f7' },
  { id: 'cyberpunk', label: 'Cyberpunk', bg: 'from-slate-950 via-purple-950 to-black', card: 'bg-slate-900/80', accent: 'text-pink-300', primary: '#ec4899' },
];

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
  const [themeId, setThemeId] = useState('midnight');
  const theme = useMemo(() => themes.find((t) => t.id === themeId) || themes[0], [themeId]);

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

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.bg} flex items-center justify-center`}>
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg} text-slate-100`}>
      {/* Landing Page Header */}
      <nav className="fixed w-full z-50 transition-all duration-300 backdrop-blur-md shadow-lg" style={{ backgroundColor: '#0f172acc' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.svg" alt="The GDevelopers Advanced Suite" className="h-8 sm:h-10" />
          </Link>
          <div className="hidden md:flex gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-white transition">
              Dashboard
            </Link>
            <Link href="/tools" className="text-sm font-medium text-slate-300 hover:text-white transition">
              Tools
            </Link>
            <Link href="/extension" className="text-sm font-medium text-slate-300 hover:text-white transition">
              Online Extension
            </Link>
            <Link href="/docs" className="text-sm font-medium text-slate-300 hover:text-white transition">
              Docs
            </Link>
            <Link href="/about" className="text-sm font-medium text-slate-300 hover:text-white transition">
              About
            </Link>
          </div>
          <div className="flex gap-4 items-center">
            {/* Advanced Theme Selector */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white transition border border-slate-700">
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Theme</span>
              </button>
              <div className="absolute right-0 mt-2 w-56 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="text-xs font-semibold text-white mb-2">Select Theme</div>
                <div className="grid grid-cols-2 gap-2">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setThemeId(t.id)}
                      className={`px-2 py-2 text-xs font-medium rounded-lg border-2 transition-all ${
                        themeId === t.id
                          ? 'border-white/40 bg-white/15 text-white shadow-lg'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:border-white/20'
                      }`}
                      style={themeId === t.id ? { boxShadow: `0 0 12px ${t.primary}40` } : {}}
                    >
                      <div className="flex items-center gap-1 justify-center">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.primary }}></div>
                        <span className="hidden sm:inline">{t.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Logout</span>
              </button>
            )}
            <Link href="/" className="px-4 py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition">
              Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-20">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700/50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Total URLs</p>
                <p className="text-3xl font-bold text-white mt-2">{shortUrls.length}</p>
              </div>
              <Plus className="w-12 h-12 text-blue-500/30" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 border border-cyan-700/50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-300 text-sm font-medium">Total Clicks</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {shortUrls.reduce((sum, url) => sum + url.clicks, 0)}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-cyan-500/30" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-700/50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Avg Clicks</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {shortUrls.length > 0 
                    ? Math.round(shortUrls.reduce((sum, url) => sum + url.clicks, 0) / shortUrls.length)
                    : 0
                  }
                </p>
              </div>
              <ExternalLink className="w-12 h-12 text-purple-500/30" />
            </div>
          </div>
        </div>

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
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden shadow-lg">
          <div className="px-6 py-4 border-b border-slate-700 bg-gradient-to-r from-slate-800 to-slate-700">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Your Short URLs ({shortUrls.length})
            </h2>
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
                    <tr key={url.id} className="hover:bg-slate-700/50 transition duration-200 group">
                      <td className="px-6 py-4">
                        <code className="text-blue-400 font-mono text-sm bg-slate-900/50 px-3 py-1 rounded group-hover:bg-slate-900 transition">
                          {url.short_code}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-300 text-sm truncate max-w-xs" title={url.long_url}>
                          {url.long_url}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-300 font-semibold bg-cyan-900/30 px-3 py-1 rounded-full text-sm">
                          {url.clicks} clicks
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm">
                        {new Date(url.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => copyToClipboard(`https://extensions.thegdevelopers.online/shorturl/${url.short_code}`)}
                            className="p-2 bg-blue-900/30 hover:bg-blue-900/60 rounded transition text-blue-300 hover:text-blue-200 font-medium"
                            title="Copy short URL"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <a
                            href={`https://extensions.thegdevelopers.online/shorturl/${url.short_code}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-green-900/30 hover:bg-green-900/60 rounded transition text-green-300 hover:text-green-200 font-medium"
                            title="Visit short URL"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => deleteUrl(url.id)}
                            className="p-2 bg-red-900/30 hover:bg-red-900/60 rounded transition text-red-300 hover:text-red-200 font-medium"
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

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <div className="mb-2">
                <img src="/logo.svg" alt="The GDevelopers" className="h-48 w-48" />
              </div>
              <p className="text-slate-400 text-sm">Building powerful tools for developers and creators.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/dashboard" className="text-slate-400 hover:text-white transition">Dashboard</Link></li>
                <li><Link href="/ai-analytics" className="text-slate-400 hover:text-white transition">AI Analytics</Link></li>
                <li><Link href="/docs" className="text-slate-400 hover:text-white transition">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-slate-400 hover:text-white transition">About</Link></li>
                <li><a href="https://thegdevelopers.info" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition">Website</a></li>
                <li><a href="mailto:info@thegdevelopers.info" className="text-slate-400 hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://github.com/ShivAyushNITGoa" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition">GitHub</a></li>
                <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition">Twitter</a></li>
                <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-3 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-xs">© 2025 The GDevelopers. All rights reserved.</p>
            <p className="text-slate-400 text-xs mt-1 md:mt-0">Made with ❤️ for developers</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
