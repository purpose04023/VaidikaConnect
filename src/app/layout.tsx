import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/common/Header';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/context/language-context';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { GoogleMapsProvider } from '@/context/google-maps-context';

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
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <LanguageProvider>
            <GoogleMapsProvider>
              <Header />
              <main>{children}</main>
              <Toaster />
            </GoogleMapsProvider>
          </LanguageProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
