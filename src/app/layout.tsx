import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/common/Header';
import Navbar from '@/components/common/Navbar';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/context/language-context';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { ContentProvider } from '@/lib/content-store';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'VaidikaConnect',
  description: 'Find and connect with qualified Vaidika Pujaris for performing Vedic rituals and pujas.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin=""/>
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <FirebaseClientProvider>
          <LanguageProvider>
            <ContentProvider>
              <Header />
              <Navbar />
              <main className="flex-1">{children}</main>
              <Toaster />
            </ContentProvider>
          </LanguageProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}

