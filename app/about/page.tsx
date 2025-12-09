'use client';

import Link from 'next/link';
import { ArrowLeft, Github, Globe, Mail } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition">
            <ArrowLeft className="w-5 h-5" />
            Back Home
          </Link>
          <h1 className="text-2xl font-bold text-white">About Us</h1>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
    </div>
  );
}
