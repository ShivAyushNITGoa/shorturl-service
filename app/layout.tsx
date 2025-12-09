import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The GDevelopers - Advanced Suite',
  description: 'Advanced developer productivity suite with AI, utilities, and real-time sync',
  authors: [{ name: 'The GDevelopers', url: 'https://thegdevelopers.info' }],
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        {children}
      </body>
    </html>
  );
}
