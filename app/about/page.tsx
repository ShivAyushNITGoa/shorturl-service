'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Github, Globe, Mail, Zap, Users, Target, LogOut } from 'lucide-react';

export default function About() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Landing Page Header */}
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
            <Link href="/docs" className="text-sm font-medium text-slate-300 hover:text-white transition">
              Docs
            </Link>
            <Link href="/about" className="text-sm font-medium text-white transition">
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        {/* About Section */}
        <section className="mb-12">
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
            <h2 className="text-4xl font-bold text-white mb-6">The GDevelopers</h2>
            <p className="text-slate-300 text-lg mb-4">
              We are a team of passionate developers dedicated to creating powerful, user-friendly tools for developers and content creators.
            </p>
            <p className="text-slate-300 text-lg mb-4">
              Our mission is to provide free, open-source tools that help you be more productive and efficient in your daily work.
            </p>
            <p className="text-slate-300 text-lg">
              From Chrome extensions to web applications, we build solutions that solve real problems and make a difference.
            </p>
          </div>
        </section>

        {/* Our Products */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Our Products</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h3 className="text-2xl font-bold text-white mb-3">🔗 URL Shortener</h3>
              <p className="text-slate-300 mb-4">
                Create short, shareable links with click tracking. Perfect for social media, emails, and marketing campaigns.
              </p>
              <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 font-semibold">
                Try it now →
              </Link>
            </div>

            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h3 className="text-2xl font-bold text-white mb-3">⏱️ Chrome Extension</h3>
              <p className="text-slate-300 mb-4">
                23 powerful tools in your browser. Pomodoro timer, QR codes, JSON formatter, and much more.
              </p>
              <a href="https://chrome.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-semibold">
                Install extension →
              </a>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Our Team</h2>
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
            <p className="text-slate-300 mb-6">
              We're a small but dedicated team of developers passionate about creating tools that make a difference.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👨‍💻</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Shiv Ayush</h3>
                  <p className="text-slate-400">Lead Developer</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👩‍💻</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Community</h3>
                  <p className="text-slate-400">Contributors & Users</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Get in Touch</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <a href="mailto:info@thegdevelopers.info" className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-blue-500 transition">
              <Mail className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">Email</h3>
              <p className="text-slate-300 text-sm">info@thegdevelopers.info</p>
            </a>

            <a href="https://thegdevelopers.info" target="_blank" rel="noopener noreferrer" className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-green-500 transition">
              <Globe className="w-8 h-8 text-green-400 mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">Website</h3>
              <p className="text-slate-300 text-sm">thegdevelopers.info</p>
            </a>

            <a href="https://github.com/ShivAyushNITGoa" target="_blank" rel="noopener noreferrer" className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-purple-500 transition">
              <Github className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">GitHub</h3>
              <p className="text-slate-300 text-sm">ShivAyushNITGoa</p>
            </a>
          </div>
        </section>

        {/* Values */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-6">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h3 className="text-xl font-bold text-white mb-2">🎯 Quality</h3>
              <p className="text-slate-300">
                We believe in building high-quality tools that are reliable, fast, and user-friendly.
              </p>
            </div>
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h3 className="text-xl font-bold text-white mb-2">🔓 Open Source</h3>
              <p className="text-slate-300">
                Our code is open and transparent. We believe in community-driven development.
              </p>
            </div>
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h3 className="text-xl font-bold text-white mb-2">🛡️ Privacy</h3>
              <p className="text-slate-300">
                Your data is yours. We never sell or share your information with third parties.
              </p>
            </div>
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h3 className="text-xl font-bold text-white mb-2">💡 Innovation</h3>
              <p className="text-slate-300">
                We constantly innovate and improve our products based on user feedback.
              </p>
            </div>
          </div>
        </section>
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
