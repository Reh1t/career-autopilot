import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

import Navbar from '@/components/layout/Navbar';

import Footer from '@/components/layout/Footer';

import WaitlistModal from '@/components/WaitlistModal';

export const metadata: Metadata = {
  title: 'AutoApplier | Your workflow on autopilot',
  description: 'AI Job Agent that automates your applications.',
};

import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased selection:bg-accent/30 selection:text-white flex flex-col min-h-screen bg-[#060907] relative`}>
        {/* Global Ambient Glow */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_120%_120%_at_50%_0%,rgba(36,63,48,0.25)_0%,rgba(6,9,7,1)_100%)] -z-50 pointer-events-none" />

        {/* Global Noise Texture */}
        <div className="fixed inset-0 opacity-[0.1] mix-blend-screen bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none -z-40"></div>

        <Navbar />
        <main className="flex-1 relative z-0">
          {children}
        </main>
        <Footer />
        <WaitlistModal />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
