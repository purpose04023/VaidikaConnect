"use client";

import Link from "next/link";
import { useLanguage } from "@/context/language-context";

export function Footer() {
  const { t, language } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/40 bg-background/80 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
          
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="VaidikaConnect Logo" className="w-8 h-8 rounded-full object-cover" />
              <span className="font-bold font-headline text-xl text-foreground">VaidikaConnect</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {language === 'te' 
                ? "వైదిక సంప్రదాయాలను ఆధునిక కాలానికి అనుగుణంగా అందరికీ అందుబాటులోకి తీసుకురావడం మా లక్ష్యం." 
                : "Our mission is to make ancient Vedic traditions accessible to all in the modern age."}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="font-bold text-foreground text-lg mb-4">{language === 'te' ? "త్వరిత 링크లు" : "Quick Links"}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/aalaya-sannidi" className="hover:text-primary transition-colors">{language === 'te' ? "ఆలయ సన్నిది" : "AalayaSannidi"}</Link></li>
              <li><Link href="/find-pujari" className="hover:text-primary transition-colors">{language === 'te' ? "పూజారిని వెతకండి" : "Find Pujari"}</Link></li>
              <li><Link href="/join-network" className="hover:text-primary transition-colors">{language === 'te' ? "నెట్‌వర్క్‌లో చేరండి" : "Join Network"}</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">{language === 'te' ? "సంప్రదించండి" : "Contact"}</Link></li>
            </ul>
          </div>

          {/* Column 3: Explore */}
          <div className="space-y-4">
            <h3 className="font-bold text-foreground text-lg mb-4">{language === 'te' ? "అన్వేషించండి" : "Explore"}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/programs" className="hover:text-primary transition-colors">{language === 'te' ? "పూజా కార్యక్రమాలు" : "Programs"}</Link></li>
              <li><Link href="/pilgrimage/darshan" className="hover:text-primary transition-colors">{language === 'te' ? "యాత్రలు & దర్శనాలు" : "Pilgrimage & Temples"}</Link></li>
              <li><Link href="/spiritual/reading" className="hover:text-primary transition-colors">{language === 'te' ? "ఆధ్యాత్మిక పఠనం" : "Spiritual Readings"}</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="space-y-4">
            <h3 className="font-bold text-foreground text-lg mb-4">{language === 'te' ? "చట్టపరమైనవి" : "Legal"}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">{language === 'te' ? "గోప్యతా విధానం" : "Privacy Policy"}</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">{language === 'te' ? "సేవా నిబంధనలు" : "Terms of Service"}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground text-center">
          <p>© {year} <span className="font-medium text-foreground/80">Soppa Sudheendra Sripada / VaidikaConnect</span>. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <img src="/logo.png" alt="" className="w-4 h-4 rounded-full grayscale opacity-50" />
              Vedic Legacy
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
