import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppProvider } from '@/contexts/app-context';
import { NextAuthProvider } from '@/contexts/next-auth-provider';
import AppRoot from './app-root';


const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'Infralith — AI-Powered Construction Intelligence',
  description: 'Pre-construction blueprint evaluation platform for engineers and project supervisors.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <body className="font-body antialiased" suppressHydrationWarning>
        <NextAuthProvider>
          <AppProvider>
            <AppRoot>
              {children}
              <Toaster />
            </AppRoot>
          </AppProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}