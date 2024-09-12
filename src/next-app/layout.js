'use client';
import './globals.css';
import { OfficeProvider } from './contexts/OfficeContext';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import { Nunito_Sans, Poppins } from 'next/font/google';

export const nunitoSans = Nunito_Sans({
  weight: ['300', '400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito-sans',
});

export const poppins = Poppins({
  weight: ['300', '400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

export default function RootLayout({ children }) {
  return (
    <html className={`${nunitoSans.variable} ${poppins.variable}`} lang="en">
      <body>
        <AuthProvider>
          <OfficeProvider>
            <Navbar />

            <main className={`mt-12 p-[2rem] pt-[4rem] bg-white-100`}>
              {children}
            </main>
          </OfficeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
