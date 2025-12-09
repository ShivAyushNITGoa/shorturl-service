'use client';

import Link from 'next/link';
import { Github, Mail, Globe, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <img src="/logo.svg" alt="Logo" className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg">The GDevelopers</span>
                <span className="text-xs text-blue-400">URL Shortener</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm">
              Professional URL shortening and analytics platform for developers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-slate-400 hover:text-blue-400 transition text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="text-slate-400 hover:text-blue-400 transition text-sm">
                  Analytics
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-slate-400 hover:text-blue-400 transition text-sm">
                  Profile
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-slate-400 hover:text-blue-400 transition text-sm">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-slate-400 hover:text-blue-400 transition text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-blue-400 transition text-sm">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-blue-400 transition text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-blue-400 transition text-sm">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex gap-4 mb-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition"
                title="GitHub"
              >
                <Github className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition"
                title="Twitter"
              >
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>
              <a
                href="mailto:info@thegdevelopers.info"
                className="w-10 h-10 bg-slate-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition"
                title="Email"
              >
                <Mail className="w-5 h-5 text-white" />
              </a>
            </div>
            <p className="text-slate-400 text-sm">
              <a href="https://thegdevelopers.info" className="hover:text-blue-400 transition">
                thegdevelopers.info
              </a>
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © {currentYear} The GDevelopers. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-slate-400 hover:text-blue-400 transition text-sm">
              Privacy
            </a>
            <a href="#" className="text-slate-400 hover:text-blue-400 transition text-sm">
              Terms
            </a>
            <a href="#" className="text-slate-400 hover:text-blue-400 transition text-sm">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
