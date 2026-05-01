import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { ToastContainer } from '@/components/ui/Toast';
import { AppShell } from './AppShell';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ScholarAI Pro — Research Intelligence Platform',
  description:
    'AI-powered academic research platform for manuscript evaluation, literature search, systematic reviews, and statistical analysis.',
  keywords: [
    'academic research',
    'manuscript evaluation',
    'systematic review',
    'literature search',
    'Claude AI',
    'PubMed',
    'research assistant',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable}`}
      style={{ backgroundColor: '#07090f' }}
    >
      <body className="font-dm antialiased" style={{ backgroundColor: '#07090f', color: '#dde4ee' }}>
        <AppShell>
          <Sidebar />
          <TopBar />
          <main
            className="min-h-screen"
            style={{
              marginLeft: '240px',
              paddingTop: '56px',
              backgroundColor: '#07090f',
            }}
          >
            {children}
          </main>
          <ToastContainer />
        </AppShell>
      </body>
    </html>
  );
}
