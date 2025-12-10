'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Home, BarChart3, User, FileText, Info } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  // Get user on mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: '/#features', label: 'Features' },
    { href: '/docs', label: 'Docs' },
    { href: '/about', label: 'About' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <img src="/logo.svg" alt="Logo" className="w-6 h-6" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-white font-bold text-lg">The GDevelopers</span>
              <span className="text-xs text-blue-400">URL Shortener</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-700 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {user.email?.[0].toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-slate-200 truncate max-w-[150px]">
                  {user.email}
                </span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2 pb-3 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-1 rounded-lg transition-all duration-200 whitespace-nowrap text-xs text-slate-300 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
