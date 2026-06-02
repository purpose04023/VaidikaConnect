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
  title: 'VaidikaConnect — Sacred Vedic Services & Pujari Booking',
  description: 'Connect with qualified Vedic priests for authentic Hindu rituals, temple tourism, horoscopes, and spiritual services across Andhra Pradesh and beyond.',
  keywords: 'pujari, vedic rituals, hindu ceremonies, temple, pooja booking, astrology, samskaras',
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
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Lato:ital,wght@0,300;0,400;0,700;1,400&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin=""/>
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <FirebaseClientProvider>
          <LanguageProvider>
            <ContentProvider>
              <Header />
              <Navbar />
              <main className="flex-1">{children}</main>

              {/* Premium Footer */}
              <footer className="border-t border-primary/10 bg-background/80 backdrop-blur-sm mt-auto">
                <div className="container mx-auto px-4 py-10 max-w-screen-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl font-serif text-primary">ॐ</span>
                        <span className="font-headline text-lg font-bold text-primary">VaidikaConnect</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Preserving ancient Vedic traditions by connecting devotees with qualified, verified pujaris across South India.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-headline text-sm font-bold mb-3 text-foreground/80">Quick Links</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><a href="/programs" className="hover:text-primary transition-colors">Sacred Programs</a></li>
                        <li><a href="/find-pujari" className="hover:text-primary transition-colors">Find a Pujari</a></li>
                        <li><a href="/join-network" className="hover:text-primary transition-colors">Join Our Network</a></li>
                        <li><a href="/contact" className="hover:text-primary transition-colors">Contact Us</a></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-headline text-sm font-bold mb-3 text-foreground/80">Sacred Services</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>🕉️ Samskaras (Life Cycle Rituals)</li>
                        <li>📿 Stotrams & Ashtotharalu</li>
                        <li>🏛️ Temple Darshans & Bookings</li>
                        <li>🌟 Live Virtual Poojas</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground">
                      © {new Date().getFullYear()} VaidikaConnect. All rights reserved. Preserving Dharma.
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span>Made with</span>
                      <span className="text-rose-500">♡</span>
                      <span>for Sanatan Dharma</span>
                    </div>
                  </div>
                </div>
              </footer>

              <Toaster />
            </ContentProvider>
          </LanguageProvider>
        </FirebaseClientProvider>
        
        {/* Hidden Google Translate Target */}
        <div id="google_translate_element" style={{ display: 'none' }}></div>
        
        {/* Google Translate API Scripts */}
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            window.googleTranslateElementInit = function() {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
              }, 'google_translate_element');
            }
          `}
        </Script>
        <Script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="afterInteractive" />
      </body>
    </html>
  );
}
