import type { Metadata } from 'next';
import '../styles/globals.css';
import { LanguageProvider } from '../hooks/useLanguage';
import { AuthProvider } from '../hooks/useAuth';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const metadata: Metadata = {
  title: 'Digital Pilgrim 1.0 — Explore Heritage. Experience Culture. Discover the Godavari.',
  description:
    'Your sacred digital companion for Godavari Pushkaralu and the timeless spiritual destinations of Andhra Pradesh.',
  keywords: [
    'Godavari Pushkaralu',
    'Andhra Pradesh Heritage',
    'Rajahmundry Temples',
    'Kotilingeswara Swamy',
    'Draksharamam',
    'Pattiseema',
    'Pushkar Ghat',
    'Pilgrim Guide',
    'Telugu Heritage',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Telugu:wght@400;500;600;700&family=Noto+Serif:ital,wght@0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF7F0] text-[#302A27] antialiased selection:bg-heritage-gold/30 selection:text-primary-maroon">
        <LanguageProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
