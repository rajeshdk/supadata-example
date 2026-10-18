import type { Metadata } from 'next';
import './globals.css';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: [
    'Supadata',
    'AI Agent',
    'Next.js',
    'TypeScript',
    'YouTube Transcripts',
    'Web Scraping',
    'Tool Calling',
    'Starter Template',
  ],
  authors: [{ name: 'Supadata Community' }],
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    type: 'website',
    url: siteConfig.repository,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-indigo-500 selection:text-white flex flex-col">
        {children}
      </body>
    </html>
  );
}
