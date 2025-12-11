'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Zap, Code2, Palette, Smartphone, Cloud, Shield, Moon, Sun,
  ArrowRight, CheckCircle, TrendingUp, Users, Zap as Lightning,
  BarChart3, Lock, Rocket, Globe, Smartphone as Mobile, Cpu, LogOut
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const themes = [
  { id: 'midnight', label: 'Midnight', bg: 'from-slate-900 via-slate-950 to-black', card: 'bg-slate-900/70', accent: 'text-blue-300', primary: '#3b82f6' },
  { id: 'ocean', label: 'Ocean', bg: 'from-cyan-900 via-blue-900 to-slate-950', card: 'bg-cyan-900/60', accent: 'text-cyan-200', primary: '#0ea5e9' },
  { id: 'sunset', label: 'Sunset', bg: 'from-amber-900 via-orange-900 to-red-950', card: 'bg-amber-900/40', accent: 'text-amber-200', primary: '#f97316' },
  { id: 'forest', label: 'Forest', bg: 'from-green-900 via-emerald-950 to-black', card: 'bg-green-900/50', accent: 'text-green-200', primary: '#10b981' },
  { id: 'aurora', label: 'Aurora', bg: 'from-purple-900 via-pink-900 to-slate-950', card: 'bg-purple-900/50', accent: 'text-purple-200', primary: '#a855f7' },
  { id: 'cyberpunk', label: 'Cyberpunk', bg: 'from-slate-950 via-purple-950 to-black', card: 'bg-slate-900/80', accent: 'text-pink-300', primary: '#ec4899' },
];

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [themeId, setThemeId] = useState('midnight');
  const theme = useMemo(() => themes.find((t) => t.id === themeId) || themes[0], [themeId]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg} text-slate-100`}>
      {/* Navbar */}
      <nav className="fixed w-full z-50 transition-all duration-300 backdrop-blur-md shadow-lg" style={{ backgroundColor: '#0f172acc' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.svg" alt="The GDevelopers Advanced Suite" className="h-8 sm:h-10" />
          </Link>
          <div className="hidden md:flex gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition">
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

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 pt-20 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl" style={{ backgroundColor: theme.primary }}></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full blur-3xl" style={{ backgroundColor: theme.primary }}></div>
        </div>

        <div className="text-center max-w-4xl mx-auto animate-fade-in relative z-10">
          <div className="inline-block mb-6 px-4 py-2 rounded-full" style={{ backgroundColor: theme.primary + '20', border: `1px solid ${theme.primary}` }}>
            <span style={{ color: theme.primary }} className="text-sm font-semibold">✨ Advanced Developer Suite v2.0</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Professional Tools for <span style={{ color: theme.primary }}>Developers</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-slate-300">
            Boost productivity with 20+ powerful tools. Chrome extension, web app, and real-time cloud sync.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: theme.primary }}>20+</div>
              <div className="text-sm opacity-75">Tools</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: theme.primary }}>100%</div>
              <div className="text-sm opacity-75">Free</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: theme.primary }}>∞</div>
              <div className="text-sm opacity-75">Sync</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105 text-white" style={{ backgroundColor: theme.primary }}>
              🚀 Get Started Free
            </Link>
            <Link href="/dashboard" className="px-8 py-3 rounded-lg font-semibold transition-all hover:opacity-80 text-slate-300" style={{ backgroundColor: theme.primary + '20', border: `2px solid ${theme.primary}` }}>
              📊 Dashboard
            </Link>
            <Link href="/docs" className="px-8 py-3 rounded-lg font-semibold transition-all hover:opacity-80 text-slate-300" style={{ backgroundColor: theme.primary + '20', border: `2px solid ${theme.primary}` }}>
              📚 Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-text">
            Powerful Features
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="card animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorized Tools Section - Toggle List */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              55 Tools Organized by Category
            </h2>
            <p className="text-xl text-slate-400">
              Click on any category to expand and see all tools
            </p>
          </div>

          {/* Toggle List */}
          <div className="space-y-2 mb-12">
            {[
              { id: 'productivity-time', icon: '⏱️', name: 'Productivity & Time', count: 3, tools: ['Pomodoro Timer', 'Timer', 'Stopwatch'] },
              { id: 'text-document', icon: '📝', name: 'Text & Document', count: 7, tools: ['Markdown', 'Grammar Check', 'Text Analyzer', 'Text Case Converter', 'Word Counter', 'Markdown Preview', 'Document Converter'] },
              { id: 'developer', icon: '💻', name: 'Developer Tools', count: 11, tools: ['Syntax Highlighter', 'JSON Formatter', 'JSON Beautifier', 'Regex Tester', 'HTML Preview', 'CSS Minifier', 'JS Minifier', 'URL Encoder', 'Base64 Encoder', 'Cron Expression', 'Email Validator'] },
              { id: 'generators', icon: '🎲', name: 'Generators & Utilities', count: 6, tools: ['QR Code Generator', 'UUID Generator', 'Hash Generator', 'Random Name Gen', 'Lorem Ipsum', 'Dice Roller'] },
              { id: 'calculators', icon: '🧮', name: 'Calculators & Math', count: 3, tools: ['Calculator', 'BMI Calculator', 'Mortgage Calculator'] },
              { id: 'productivity', icon: '✅', name: 'Productivity', count: 5, tools: ['Todo List', 'Quick Notes', 'Clipboard Manager', 'Countdown Timer', 'Screenshot Tool'] },
              { id: 'network', icon: '🌐', name: 'Network & System', count: 7, tools: ['IP Address Lookup', 'Speed Test', 'WHOIS Lookup', 'DNS Checker', 'Screen Resolution', 'System Info', 'Battery Info'] },
              { id: 'security', icon: '🔐', name: 'Security & Encryption', count: 4, tools: ['Password Generator', 'Password Strength', 'Text Encrypt', 'Hash Generator'] },
              { id: 'converters', icon: '🔄', name: 'File Converters', count: 3, tools: ['Image Converter', 'Unit Converter', 'Timestamp Converter'] },
              { id: 'misc', icon: '🎨', name: 'Miscellaneous', count: 5, tools: ['Weather', 'URL Shortener', 'Color Tools', 'Color Palette', 'Coin Flip'] },
            ].map((category) => (
              <div key={category.id} className="border border-slate-700 rounded-lg overflow-hidden hover:border-blue-500/60 transition">
                <button
                  onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                  className="w-full px-6 py-4 flex items-center justify-between bg-slate-800/50 hover:bg-slate-800 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-white">{category.name}</h3>
                      <p className="text-sm text-slate-400">{category.count} tools</p>
                    </div>
                  </div>
                  <span className={`text-2xl transition-transform ${expandedCategory === category.id ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {expandedCategory === category.id && (
                  <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-700">
                    <ul className="space-y-2">
                      {category.tools.map((tool, idx) => (
                        <li key={idx} className="text-slate-300">• {tool}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="text-center space-x-4 flex flex-wrap justify-center gap-4">
            <Link 
              href="/tools" 
              className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition"
            >
              View All Tools →
            </Link>
            <Link 
              href="/mail1s" 
              className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition"
            >
              📮 Mail1s API Dashboard
            </Link>
            <Link 
              href="/mail1s-iframe" 
              className="inline-block px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition"
            >
              📮 Mail1s Web Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-4 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-text">
            Built With Modern Tech
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Code2 className="w-6 h-6 text-lime-400" />
                Frontend
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li>✓ Chrome Extension (Manifest V3)</li>
                <li>✓ Next.js 14 Web App</li>
                <li>✓ React 18 + TypeScript</li>
                <li>✓ Tailwind CSS</li>
              </ul>
            </div>

            <div className="card">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Cloud className="w-6 h-6 text-blue-400" />
                Backend
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li>✓ Supabase (PostgreSQL)</li>
                <li>✓ Real-time Sync</li>
                <li>✓ Row Level Security</li>
                <li>✓ Authentication Ready</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center card">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Install the extension and start boosting your productivity today.
          </p>
          <a href="https://chrome.google.com" target="_blank" rel="noopener noreferrer" className="btn-primary inline-block">
            Install Now
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/30 py-16 px-4 text-gray-300">
        <div className="max-w-7xl mx-auto">
          {/* Footer Top */}
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/G-icon.svg" alt="The GDevelopers" className="w-8 h-8" />
                <span className="text-white font-bold">The GDevelopers</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Advanced developer productivity suite with 18 free tools for maximum efficiency.
              </p>
              <div className="flex gap-4">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-lime-400 transition">
                  GitHub
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-lime-400 transition">
                  Twitter
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-lime-400 transition">
                  LinkedIn
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="text-gray-400 hover:text-lime-400 transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="/dashboard" className="text-gray-400 hover:text-lime-400 transition">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="/about" className="text-gray-400 hover:text-lime-400 transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/auth/signup" className="text-gray-400 hover:text-lime-400 transition">
                    Get Started
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-white font-bold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/docs" className="text-gray-400 hover:text-lime-400 transition">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="/analytics" className="text-gray-400 hover:text-lime-400 transition">
                    Analytics
                  </a>
                </li>
                <li>
                  <a href="/profile" className="text-gray-400 hover:text-lime-400 transition">
                    Profile
                  </a>
                </li>
                <li>
                  <a href="/docs#faq" className="text-gray-400 hover:text-lime-400 transition">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="mailto:info@thegdevelopers.info" className="text-gray-400 hover:text-lime-400 transition">
                    info@thegdevelopers.info
                  </a>
                </li>
                <li>
                  <a href="https://thegdevelopers.info" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-lime-400 transition">
                    thegdevelopers.info
                  </a>
                </li>
                <li>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-lime-400 transition">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Divider */}
          <div className="border-t border-white/10 pt-8">
            {/* Footer Bottom */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-400">
                © 2025 The GDevelopers. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-lime-400 transition">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-lime-400 transition">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-400 hover:text-lime-400 transition">
                  Cookie Policy
                </a>
              </div>
            </div>
            <p className="text-center text-xs text-gray-500 mt-4">
              Made with ❤️ by The GDevelopers | Advanced Developer Suite v2.0.0
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: '⏱️',
    title: 'Pomodoro Timer',
    description: 'Focus timer for productivity with customizable work sessions.'
  },
  {
    icon: '📱',
    title: 'QR Code Generator',
    description: 'Convert text and URLs to QR codes instantly.'
  },
  {
    icon: '📝',
    title: 'Markdown Converter',
    description: 'Convert markdown syntax to HTML with live preview.'
  },
  {
    icon: '🔗',
    title: 'URL Shortener',
    description: 'Shorten long URLs with custom encoding.'
  },
  {
    icon: '✍️',
    title: 'Grammar Checker',
    description: 'Check text for grammar and formatting issues.'
  },
  {
    icon: '💻',
    title: 'Syntax Highlighter',
    description: 'Highlight code with proper formatting and colors.'
  },
  {
    icon: '🔐',
    title: 'Password Generator',
    description: 'Generate secure random passwords with custom options.'
  },
  {
    icon: '🎨',
    title: 'Color Tools',
    description: 'Pick colors and convert between HEX, RGB, and HSL.'
  },
  {
    icon: '📊',
    title: 'Text Analyzer',
    description: 'Analyze text statistics and reading time.'
  },
  {
    icon: '{ }',
    title: 'JSON Formatter',
    description: 'Format, validate, and minify JSON data.'
  },
  {
    icon: '⏰',
    title: 'Timestamp Converter',
    description: 'Convert between Unix timestamps and dates.'
  },
  {
    icon: '📋',
    title: 'Clipboard Manager',
    description: 'Manage clipboard history with quick access.'
  },
];
