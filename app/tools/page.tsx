'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { LogOut, Zap, Code2, BookOpen } from 'lucide-react';

export default function Tools() {
  const [user, setUser] = useState<any>(null);

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

  const toolCategories = [
    {
      name: 'Calculators & Math',
      icon: '🧮',
      color: 'from-blue-600 to-blue-400',
      tools: [
        { name: 'Calculator', icon: '🧮', desc: 'Advanced calculator with history' },
        { name: 'BMI Calculator', icon: '⚖️', desc: 'Calculate body mass index' },
        { name: 'Mortgage Calculator', icon: '🏠', desc: 'Calculate mortgage payments' },
      ]
    },
    {
      name: 'Productivity & Notes',
      icon: '✅',
      color: 'from-green-600 to-green-400',
      tools: [
        { name: 'Todo List', icon: '✅', desc: 'Create and manage tasks' },
        { name: 'Quick Notes', icon: '📌', desc: 'Save quick notes locally' },
        { name: 'Countdown Timer', icon: '⏳', desc: 'Countdown to a date' },
      ]
    },
    {
      name: 'Time & Timers',
      icon: '⏱️',
      color: 'from-purple-600 to-purple-400',
      tools: [
        { name: 'Timer', icon: '⏱️', desc: 'Countdown timer with alerts' },
        { name: 'Stopwatch', icon: '⏲️', desc: 'Measure elapsed time' },
      ]
    },
    {
      name: 'File Converters',
      icon: '🔄',
      color: 'from-orange-600 to-orange-400',
      tools: [
        { name: 'Image Converter', icon: '🖼️', desc: 'Convert image formats (10 input, 8 output)' },
        { name: 'Document Converter', icon: '📄', desc: 'Convert documents (12 input, 6 output)' },
      ]
    },
    {
      name: 'Developer Tools',
      icon: '💻',
      color: 'from-red-600 to-red-400',
      tools: [
        { name: 'JSON Formatter', icon: '{ }', desc: 'Format & validate JSON' },
        { name: 'HTML Preview', icon: '🌐', desc: 'Preview HTML code' },
        { name: 'CSS Minifier', icon: '✂️', desc: 'Minify CSS code' },
        { name: 'JS Minifier', icon: '✂️', desc: 'Minify JavaScript code' },
        { name: 'URL Encoder', icon: '🔗', desc: 'Encode/decode URLs' },
      ]
    },
    {
      name: 'Security & Encryption',
      icon: '🔐',
      color: 'from-indigo-600 to-indigo-400',
      tools: [
        { name: 'Password Strength', icon: '🔐', desc: 'Check password strength' },
        { name: 'Text Encrypt', icon: '🔒', desc: 'Encrypt and decrypt text' },
      ]
    },
    {
      name: 'Network & System',
      icon: '🌐',
      color: 'from-cyan-600 to-cyan-400',
      tools: [
        { name: 'IP Address', icon: '🌐', desc: 'Check your IP and location' },
        { name: 'Speed Test', icon: '⚡', desc: 'Test internet connection speed' },
        { name: 'WHOIS Lookup', icon: '🔍', desc: 'Look up domain information' },
        { name: 'DNS Checker', icon: '🌐', desc: 'Check DNS records' },
        { name: 'Screen Resolution', icon: '📺', desc: 'Check screen resolution' },
        { name: 'System Info', icon: '💻', desc: 'View system information' },
        { name: 'Battery Info', icon: '🔋', desc: 'Check battery status' },
      ]
    },
    {
      name: 'Weather & Location',
      icon: '🌤️',
      color: 'from-yellow-600 to-yellow-400',
      tools: [
        { name: 'Weather', icon: '🌤️', desc: 'Check weather by location' },
      ]
    },
    {
      name: 'URL & Web Tools',
      icon: '🔗',
      color: 'from-pink-600 to-pink-400',
      tools: [
        { name: 'URL Shortener', icon: '🔗', desc: 'Shorten long URLs' },
      ]
    },
    {
      name: 'Generators & Utilities',
      icon: '🎲',
      color: 'from-teal-600 to-teal-400',
      tools: [
        { name: 'Random Name Gen', icon: '👤', desc: 'Generate random names' },
        { name: 'Lorem Ipsum', icon: '📄', desc: 'Generate placeholder text' },
        { name: 'Color Palette', icon: '🎨', desc: 'Generate color palettes' },
        { name: 'Dice Roller', icon: '🎲', desc: 'Roll dice for games' },
        { name: 'Coin Flip', icon: '🪙', desc: 'Flip a coin for decisions' },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
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
            <Link href="/tools" className="text-sm font-medium text-white transition">
              Tools
            </Link>
            <Link href="/docs" className="text-sm font-medium text-slate-300 hover:text-white transition">
              Docs
            </Link>
            <Link href="/about" className="text-sm font-medium text-slate-300 hover:text-white transition">
              About
            </Link>
          </div>
          <div className="flex gap-4">
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
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Available Tools</h1>
          <p className="text-slate-400 text-lg mb-2">
            Access all our useful tools and utilities. These tools work both online and offline.
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-2"><span className="w-3 h-3 bg-green-500 rounded-full"></span>55 Total Tools</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-500 rounded-full"></span>10 Categories</span>
          </div>
        </div>

        {/* Categorized Tools */}
        <div className="space-y-12 mb-12">
          {toolCategories.map((category, catIndex) => (
            <div key={catIndex}>
              {/* Category Header */}
              <div className={`bg-gradient-to-r ${category.color} rounded-lg p-6 mb-6 shadow-lg`}>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{category.icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{category.name}</h2>
                    <p className="text-white/80 text-sm">{category.tools.length} tools</p>
                  </div>
                </div>
              </div>

              {/* Tools Grid for Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {category.tools.map((tool, toolIndex) => (
                  <div
                    key={toolIndex}
                    className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-700 rounded-lg p-5 hover:border-blue-500 hover:shadow-lg transition group cursor-pointer"
                  >
                    <div className="text-3xl mb-2">{tool.icon}</div>
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition">
                      {tool.name}
                    </h3>
                    <p className="text-slate-400 text-sm mb-3">{tool.desc}</p>
                    <span className="inline-block px-3 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-full">
                      Available in Extension
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Why Use Our Tools?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-lg font-bold text-white mb-2">Fast & Offline</h3>
              <p className="text-slate-400">Most tools work completely offline without internet connection</p>
            </div>
            <div>
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="text-lg font-bold text-white mb-2">Secure & Private</h3>
              <p className="text-slate-400">Your data stays on your device. No tracking or data collection</p>
            </div>
            <div>
              <div className="text-3xl mb-3">📱</div>
              <h3 className="text-lg font-bold text-white mb-2">Always Available</h3>
              <p className="text-slate-400">Access tools from anywhere using our Chrome extension</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <img src="/logo.svg" alt="The GDevelopers" className="h-48 w-48" />
              <p className="text-slate-400 text-sm">Building powerful tools for developers and creators.</p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/tools" className="hover:text-white transition">Tools</Link></li>
                <li><Link href="/docs" className="hover:text-white transition">Documentation</Link></li>
                <li><Link href="/about" className="hover:text-white transition">About</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="https://thegdevelopers.info" className="hover:text-white transition">Website</a></li>
                <li><a href="mailto:info@thegdevelopers.info" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Connect</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="https://github.com" className="hover:text-white transition">GitHub</a></li>
                <li><a href="https://twitter.com" className="hover:text-white transition">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-4 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-xs">© 2025 The GDevelopers. All rights reserved.</p>
            <p className="text-slate-400 text-xs mt-2 md:mt-0">Made with ❤️ for developers</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
