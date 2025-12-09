'use client';

import Link from 'next/link';
import { BookOpen, Code2, Zap, Shield, HelpCircle } from 'lucide-react';
import Navbar from '@/components/navbar';

export default function Documentation() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
    </div>
  );
}
