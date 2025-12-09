'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { BarChart3, TrendingUp, Link2, MousePointerClick, ArrowLeft } from 'lucide-react';

interface AnalyticsData {
  totalUrls: number;
  totalClicks: number;
  topUrl: any;
  recentUrls: any[];
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUrls: 0,
    totalClicks: 0,
    topUrl: null,
    recentUrls: []
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/auth/login';
        return;
      }
      setUser(user);
      fetchAnalytics();
    };
    checkAuth();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data, error } = await supabase
        .from('short_urls')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const urls = data || [];
      const totalClicks = urls.reduce((sum, url) => sum + (url.clicks || 0), 0);
      const topUrl = urls.reduce((max, url) => (url.clicks > (max?.clicks || 0) ? url : max), null);

      setAnalytics({
        totalUrls: urls.length,
        totalClicks,
        topUrl,
        recentUrls: urls.slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Total URLs */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-2">Total Short URLs</p>
                <p className="text-4xl font-bold text-white">{analytics.totalUrls}</p>
              </div>
              <Link2 className="w-12 h-12 text-blue-400 opacity-20" />
            </div>
          </div>

          {/* Total Clicks */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-2">Total Clicks</p>
                <p className="text-4xl font-bold text-white">{analytics.totalClicks}</p>
              </div>
              <MousePointerClick className="w-12 h-12 text-green-400 opacity-20" />
            </div>
          </div>

          {/* Avg Clicks */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-2">Average Clicks</p>
                <p className="text-4xl font-bold text-white">
                  {analytics.totalUrls > 0 ? (analytics.totalClicks / analytics.totalUrls).toFixed(1) : 0}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-purple-400 opacity-20" />
            </div>
          </div>
        </div>

        {/* Top Performing URL */}
        {analytics.topUrl && (
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Top Performing URL
            </h2>
            <div className="space-y-2">
              <p className="text-slate-400">Short Code: <span className="text-blue-400 font-mono">{analytics.topUrl.short_code}</span></p>
              <p className="text-slate-400">Clicks: <span className="text-green-400 font-bold">{analytics.topUrl.clicks}</span></p>
              <p className="text-slate-400 text-sm break-all">URL: {analytics.topUrl.long_url}</p>
            </div>
          </div>
        )}

        {/* Recent URLs */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent URLs</h2>
          {analytics.recentUrls.length === 0 ? (
            <p className="text-slate-400">No URLs yet</p>
          ) : (
            <div className="space-y-4">
              {analytics.recentUrls.map((url) => (
                <div key={url.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-slate-300 font-mono text-sm">{url.short_code}</p>
                    <p className="text-slate-400 text-xs truncate">{url.long_url}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold">{url.clicks}</p>
                    <p className="text-slate-400 text-xs">{new Date(url.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
