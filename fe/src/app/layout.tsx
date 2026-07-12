import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { Providers } from './providers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: 'HSSE Management System',
  description: 'PT. Industri Nabati Lestari',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Providers>
            {children}
            <ToastContainer position="top-right" autoClose={3000} theme="colored" />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
