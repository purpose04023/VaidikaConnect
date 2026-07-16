"use client";

import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { Sparkles, Heart, Landmark, ShieldCheck } from "lucide-react";

export function Footer() {
  const { language } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t-2 border-amber-500 bg-gradient-to-b from-background/90 to-amber-500/5 backdrop-blur-md mt-auto relative overflow-hidden">
      {/* Subtle bottom orb for footer decoration */}
      <div className="orb w-72 h-72 bg-amber-500/10 dark:bg-amber-500/5 bottom-[-10%] left-[40%]" />

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 text-left">
          
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-background border p-1 shadow-sm transition-transform group-hover:scale-105">
                <img src="/logo.png" alt="VaidikaConnect Logo" className="w-full h-full rounded-full object-cover" />
              </div>
              <div className="flex flex-col text-left leading-none font-bold font-headline select-none">
                <span className="text-sm block text-primary tracking-wide">Vaidika</span>
                <span className="text-[10px] block text-foreground uppercase tracking-widest mt-0.5">Connect</span>
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xs">
              {language === 'te' 
                ? "వైదిక సంప్రదాయాలను ఆధునిక కాలానికి అనుగుణంగా అందరికీ అందుబాటులోకి తీసుకురావడం మా లక్ష్యం." 
                : "Our mission is to make ancient Vedic traditions accessible to all in the modern digital age."}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="font-cinzel font-bold text-foreground text-lg mb-4 border-b border-amber-500/30 pb-1.5 w-fit">
              {language === 'te' ? "త్వరిత లింకులు" : "Quick Links"}
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
              <li className="flex items-center gap-2 hover:text-primary transition-colors">
                <Landmark className="h-3.5 w-3.5 text-amber-500/60" />
                <Link href="/aalaya-sannidi" className="hover:underline">{language === 'te' ? "ఆలయ సన్నిది" : "AalayaSannidi"}</Link>
              </li>
              <li className="flex items-center gap-2 hover:text-primary transition-colors">
                <Sparkles className="h-3.5 w-3.5 text-amber-500/60" />
                <Link href="/find-pujari" className="hover:underline">{language === 'te' ? "పూజారిని వెతకండి" : "Find Pujari"}</Link>
              </li>
              <li className="flex items-center gap-2 hover:text-primary transition-colors">
                <Heart className="h-3.5 w-3.5 text-amber-500/60" />
                <Link href="/join-network" className="hover:underline">{language === 'te' ? "నెట్‌వర్క్‌లో చేరండి" : "Join Network"}</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Explore */}
          <div className="space-y-4">
            <h3 className="font-cinzel font-bold text-foreground text-lg mb-4 border-b border-amber-500/30 pb-1.5 w-fit">
              {language === 'te' ? "అన్వేషించండి" : "Explore"}
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
              <li><Link href="/programs" className="hover:text-primary transition-colors hover:underline">{language === 'te' ? "పూజా కార్యక్రమాలు" : "Programs"}</Link></li>
              <li><Link href="/pilgrimage/darshan" className="hover:text-primary transition-colors hover:underline">{language === 'te' ? "యాత్రలు & దర్శనాలు" : "Pilgrimage & Temples"}</Link></li>
              <li><Link href="/spiritual/reading" className="hover:text-primary transition-colors hover:underline">{language === 'te' ? "ఆధ్యాత్మిక పఠనం" : "Spiritual Readings"}</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="space-y-4">
            <h3 className="font-cinzel font-bold text-foreground text-lg mb-4 border-b border-amber-500/30 pb-1.5 w-fit">
              {language === 'te' ? "చట్టపరమైనవి" : "Legal"}
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
              <li className="flex items-center gap-2 hover:text-primary transition-colors">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-500/60" />
                <Link href="/privacy" className="hover:underline">{language === 'te' ? "గోప్యతా విధానం" : "Privacy Policy"}</Link>
              </li>
              <li className="flex items-center gap-2 hover:text-primary transition-colors">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-500/60" />
                <Link href="/terms" className="hover:underline">{language === 'te' ? "సేవా నిబంధనలు" : "Terms of Service"}</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom copyright with decorative Divider */}
        <div className="mt-16 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground text-center">
          <p>© {year} <span className="font-medium text-foreground/80 font-cinzel">Soppa Sudheendra Sripada / VaidikaConnect</span>. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 bg-amber-500/5 dark:bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 font-bold text-amber-600 dark:text-amber-500 text-[10px] tracking-wider select-none font-cinzel">
              ॐ VEDIC LEGACY
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
