'use client';

import { useEffect, useState } from 'react';
import { Zap, Code2, Palette, Smartphone, Cloud, Shield, Moon, Sun } from 'lucide-react';

type Theme = 'midnight' | 'sapphire' | 'emerald' | 'crimson' | 'amethyst' | 'platinum';

const themeConfig: Record<Theme, { 
  bg: string; 
  primary: string; 
  secondary: string; 
  accent: string; 
  name: string;
  description: string;
  textColor: string;
}> = {
  midnight: {
    bg: '#0f172a',
    primary: '#3b82f6',
    secondary: '#1e40af',
    accent: '#60a5fa',
    name: 'Midnight',
    description: 'Deep blue professional theme',
    textColor: '#f1f5f9'
  },
  sapphire: {
    bg: '#1e3a8a',
    primary: '#0ea5e9',
    secondary: '#0284c7',
    accent: '#38bdf8',
    name: 'Sapphire',
    description: 'Vibrant blue corporate theme',
    textColor: '#f0f9ff'
  },
  emerald: {
    bg: '#064e3b',
    primary: '#10b981',
    secondary: '#059669',
    accent: '#6ee7b7',
    name: 'Emerald',
    description: 'Fresh green growth theme',
    textColor: '#ecfdf5'
  },
  crimson: {
    bg: '#7f1d1d',
    primary: '#ef4444',
    secondary: '#dc2626',
    accent: '#fca5a5',
    name: 'Crimson',
    description: 'Bold red power theme',
    textColor: '#fef2f2'
  },
  amethyst: {
    bg: '#4c1d95',
    primary: '#a855f7',
    secondary: '#9333ea',
    accent: '#d8b4fe',
    name: 'Amethyst',
    description: 'Elegant purple luxury theme',
    textColor: '#faf5ff'
  },
  platinum: {
    bg: '#1f2937',
    primary: '#e5e7eb',
    secondary: '#d1d5db',
    accent: '#9ca3af',
    name: 'Platinum',
    description: 'Minimalist grayscale theme',
    textColor: '#f9fafb'
  }
};

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<Theme>('midnight');
  const [mounted, setMounted] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme || 'midnight';
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const currentTheme = themeConfig[theme] || themeConfig.midnight;

  if (!mounted) {
    return (
      <div style={{ backgroundColor: themeConfig.midnight.bg, color: themeConfig.midnight.textColor }} className="min-h-screen" />
    );
  }

  return (
    <div className="min-h-screen transition-all duration-500" style={{ backgroundColor: currentTheme.bg, color: currentTheme.textColor }}>
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'backdrop-blur-md' : ''}`} style={{ backgroundColor: isScrolled ? currentTheme.bg + '99' : 'transparent' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="The GDevelopers Advanced Suite" className="h-8 sm:h-10" />
          </div>
          <div className="flex gap-4 items-center">
            {/* Theme Toggle Button */}
            <div className="relative">
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all text-sm sm:text-base"
                style={{
                  backgroundColor: currentTheme.primary,
                  color: currentTheme.bg,
                }}
              >
                🎨 <span className="hidden sm:inline">Theme</span>
              </button>

              {/* Theme Menu */}
              {showThemeMenu && (
                <div
                  className="absolute right-0 mt-2 w-80 sm:w-96 rounded-lg shadow-2xl z-50 overflow-hidden max-h-96 overflow-y-auto"
                  style={{ backgroundColor: currentTheme.bg, border: `2px solid ${currentTheme.primary}` }}
                >
                  <div className="p-3 sm:p-4 space-y-2">
                    {(Object.keys(themeConfig) as Theme[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          handleThemeChange(t);
                          setShowThemeMenu(false);
                        }}
                        className="w-full text-left p-2 sm:p-3 rounded-lg transition-all text-sm sm:text-base"
                        style={{
                          backgroundColor: theme === t ? currentTheme.primary + '30' : 'transparent',
                          borderLeft: theme === t ? `4px solid ${currentTheme.primary}` : '4px solid transparent',
                          color: currentTheme.textColor,
                        }}
                      >
                        <div className="font-semibold text-sm sm:text-base">{themeConfig[t].name}</div>
                        <div className="text-xs sm:text-sm opacity-75 hidden sm:block">{themeConfig[t].description}</div>
                        <div className="flex gap-1 sm:gap-2 mt-2">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded" style={{ backgroundColor: themeConfig[t].primary }}></div>
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded" style={{ backgroundColor: themeConfig[t].secondary }}></div>
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded" style={{ backgroundColor: themeConfig[t].accent }}></div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <a href="https://thegdevelopers.info" target="_blank" rel="noopener noreferrer" className="btn-secondary">
              Website
            </a>
            <a href="#features" className="btn-primary">
              Explore
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">
            Advanced Developer Suite
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Powerful tools for productivity. Chrome extension, web app, and cloud sync.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/auth/signup" className="btn-primary">
              🚀 Get Started
            </a>
            <a href="/docs" className="btn-secondary">
              📚 Learn More
            </a>
            <a href="/about" className="btn-secondary">
              ℹ️ About Us
            </a>
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
