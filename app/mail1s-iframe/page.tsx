'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './mail1s-iframe.module.css';

export default function Mail1sIframePage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'shortlinks' | 'email' | 'storage' | 'docs'>('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📮</span>
            <div>
              <h1 className="text-2xl font-bold">Mail1s.net</h1>
              <p className="text-sm text-slate-400">Integrated Services</p>
            </div>
          </div>
          <Link href="/" className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition">
            ← Back
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 z-40 bg-slate-800/90 backdrop-blur border-b border-slate-700">
        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto px-4 py-3">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setActiveTab('shortlinks')}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
              activeTab === 'shortlinks'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
            }`}
          >
            🔗 Short Links
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
              activeTab === 'email'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
            }`}
          >
            📧 Email
          </button>
          <button
            onClick={() => setActiveTab('storage')}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
              activeTab === 'storage'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
            }`}
          >
            💾 Storage
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
              activeTab === 'docs'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
            }`}
          >
            📖 Docs
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={styles.iframeContainer}>
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <iframe
            src="https://mail1s.net/dashboard"
            title="Mail1s.net Dashboard"
            className={styles.iframe}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
            allow="geolocation; microphone; camera"
          />
        )}

        {/* Short Links Tab */}
        {activeTab === 'shortlinks' && (
          <div className={styles.iframeWrapper}>
            <iframe
              src="https://mail1s.net/dashboard/short-links"
              title="Mail1s.net Short Links"
              className={styles.iframe}
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
              allow="geolocation; microphone; camera"
            />
          </div>
        )}

        {/* Email Tab */}
        {activeTab === 'email' && (
          <div className={styles.iframeWrapper}>
            <iframe
              src="https://mail1s.net/dashboard/email"
              title="Mail1s.net Email"
              className={styles.iframe}
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
              allow="geolocation; microphone; camera"
            />
          </div>
        )}

        {/* Storage Tab */}
        {activeTab === 'storage' && (
          <div className={styles.iframeWrapper}>
            <iframe
              src="https://mail1s.net/dashboard/storage"
              title="Mail1s.net Storage"
              className={styles.iframe}
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
              allow="geolocation; microphone; camera"
            />
          </div>
        )}

        {/* Docs Tab */}
        {activeTab === 'docs' && (
          <div className={styles.iframeWrapper}>
            <iframe
              src="https://mail1s.net/docs"
              title="Mail1s.net Documentation"
              className={styles.iframe}
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
              allow="geolocation; microphone; camera"
            />
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="fixed bottom-4 right-4 bg-slate-800 border border-slate-700 rounded-lg p-4 max-w-sm shadow-lg">
        <p className="text-sm text-slate-300">
          <span className="font-semibold">💡 Tip:</span> You can also use the API-based dashboard at{' '}
          <Link href="/mail1s" className="text-blue-400 hover:text-blue-300 underline">
            /mail1s
          </Link>
        </p>
      </div>
    </div>
  );
}
