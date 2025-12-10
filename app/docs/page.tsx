'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Zap, Code2, BookOpen, HelpCircle, LogOut, Shield } from 'lucide-react';

export default function Docs() {
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
            <Link href="/docs" className="text-sm font-medium text-white transition">
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        {/* Getting Started */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
            <Zap className="w-8 h-8 text-yellow-400" />
            Getting Started
          </h2>
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 space-y-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">1. Create an Account</h3>
              <p className="text-slate-300">
                Sign up with your email address at <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300">signup page</Link>. 
                You'll receive a confirmation email to verify your account.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">2. Login</h3>
              <p className="text-slate-300">
                Use your email and password to <Link href="/auth/login" className="text-blue-400 hover:text-blue-300">login</Link> to your account.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">3. Create Short URLs</h3>
              <p className="text-slate-300">
                Go to your <Link href="/dashboard" className="text-blue-400 hover:text-blue-300">dashboard</Link> and paste a long URL to create a short link.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">4. Share & Track</h3>
              <p className="text-slate-300">
                Copy your short URL and share it. Track clicks and analytics in your dashboard.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
            <Code2 className="w-8 h-8 text-blue-400" />
            Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h3 className="text-xl font-bold text-white mb-2">URL Shortening</h3>
              <p className="text-slate-300">
                Convert long URLs into short, shareable links. Perfect for social media, emails, and messaging.
              </p>
            </div>
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h3 className="text-xl font-bold text-white mb-2">Click Tracking</h3>
              <p className="text-slate-300">
                Track how many times each short URL is clicked. Monitor engagement and traffic.
              </p>
            </div>
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h3 className="text-xl font-bold text-white mb-2">Analytics Dashboard</h3>
              <p className="text-slate-300">
                View detailed analytics including total URLs, total clicks, and top performing links.
              </p>
            </div>
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h3 className="text-xl font-bold text-white mb-2">User Profile</h3>
              <p className="text-slate-300">
                Manage your account settings, update your profile, and control your preferences.
              </p>
            </div>
          </div>
        </section>

        {/* API Documentation */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-green-400" />
            API Documentation
          </h2>
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Redirect Endpoint</h3>
              <p className="text-slate-300 mb-2">Redirect to original URL using short code:</p>
              <code className="block bg-slate-700 p-3 rounded text-blue-300 text-sm overflow-x-auto">
                GET /api/redirect/[code]
              </code>
              <p className="text-slate-400 text-sm mt-2">Example: /api/redirect/ABC123</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Response</h3>
              <p className="text-slate-300 mb-2">On success (301 redirect):</p>
              <code className="block bg-slate-700 p-3 rounded text-green-300 text-sm">
                Redirects to original URL
              </code>
              <p className="text-slate-300 mb-2 mt-4">On error (404):</p>
              <code className="block bg-slate-700 p-3 rounded text-red-300 text-sm">
                Short URL not found
              </code>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
            <Shield className="w-8 h-8 text-red-400" />
            Security
          </h2>
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">✓ Secure Authentication</h3>
              <p className="text-slate-300">
                Your account is protected with industry-standard password hashing and encryption.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">✓ Data Privacy</h3>
              <p className="text-slate-300">
                Your data is stored securely in our Supabase database with row-level security policies.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">✓ HTTPS Encryption</h3>
              <p className="text-slate-300">
                All communication is encrypted with SSL/TLS certificates.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">✓ No Third-party Tracking</h3>
              <p className="text-slate-300">
                We only track clicks on your short URLs. No personal data is shared with third parties.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
            <HelpCircle className="w-8 h-8 text-purple-400" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className="bg-slate-800 rounded-lg border border-slate-700 p-6 cursor-pointer group">
              <summary className="font-bold text-white flex items-center justify-between">
                How long are short URLs valid?
                <span className="group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="text-slate-300 mt-4">
                Short URLs are valid indefinitely. They will continue to work as long as your account is active.
              </p>
            </details>

            <details className="bg-slate-800 rounded-lg border border-slate-700 p-6 cursor-pointer group">
              <summary className="font-bold text-white flex items-center justify-between">
                Can I delete a short URL?
                <span className="group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="text-slate-300 mt-4">
                Yes, you can delete any short URL from your dashboard. Once deleted, the link will no longer work.
              </p>
            </details>

            <details className="bg-slate-800 rounded-lg border border-slate-700 p-6 cursor-pointer group">
              <summary className="font-bold text-white flex items-center justify-between">
                Is there a limit to how many URLs I can create?
                <span className="group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="text-slate-300 mt-4">
                No, you can create unlimited short URLs. There are no restrictions on the number of links you can shorten.
              </p>
            </details>

            <details className="bg-slate-800 rounded-lg border border-slate-700 p-6 cursor-pointer group">
              <summary className="font-bold text-white flex items-center justify-between">
                How accurate is the click tracking?
                <span className="group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="text-slate-300 mt-4">
                Click tracking is very accurate. Each time someone visits your short URL, the click counter is incremented.
              </p>
            </details>
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
