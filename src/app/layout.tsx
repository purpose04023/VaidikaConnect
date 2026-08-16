import type { Metadata } from 'next';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import { Header } from '@/components/common/Header';
import Navbar from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/context/language-context';
import { ContentProvider } from '@/lib/content-store';
import { ComplaintBot } from '@/components/common/ComplaintBot';
import { ConsentBanner } from '@/components/ConsentBanner';
// Analytics is rendered conditionally in a client wrapper below (consent-gated).
// LAWYER-REVIEW-REQUIRED: if Vercel Analytics is confirmed "legitimate interest"
// under final DPDP Rules, it can be rendered unconditionally here again.

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
      <body className="font-body antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <LanguageProvider>
          <ContentProvider>
            <Header />
            <Navbar />
            <main className="flex-1 pt-28 md:pt-32">{children}</main>
            <Toaster />
            <Footer />
            <ComplaintBot />
            {/* Consent banner — shown on first visit, gates Analytics */}
            <ConsentBanner />
            {/*
              Analytics is currently DISABLED pending DPDP consent confirmation.
              To re-enable once consent is granted, use the useAnalyticsConsent()
              hook in a client-side wrapper and conditionally render <Analytics />.
              LAWYER-REVIEW-REQUIRED before enabling.
            */}
          </ContentProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
