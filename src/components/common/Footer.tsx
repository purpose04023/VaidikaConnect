"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";
import {
  Sparkles, Heart, Landmark, ShieldCheck, Mail, Phone,
  BookOpen, MapPin, Instagram, Youtube, Twitter, Facebook
} from "lucide-react";

export function Footer() {
  const { language } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-amber-500/40 bg-gradient-to-b from-background to-amber-950/10 dark:to-amber-950/20 mt-auto relative overflow-hidden">
      {/* Decorative orb */}
      <div className="absolute bottom-[-10%] left-[40%] w-72 h-72 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 py-14 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-left">

          {/* Column 1: Brand + Description + Social */}
          <div className="space-y-5 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-background border border-amber-500/20 p-1 shadow-sm transition-transform group-hover:scale-105 shrink-0">
                <img src="/logo.png" alt="VaidikaConnect Logo" className="w-full h-full rounded-full object-cover" />
              </div>
              <div className="flex flex-col text-left leading-none font-bold font-headline select-none">
                <span className="text-sm block text-primary tracking-wide">Vaidika</span>
                <span className="text-[10px] block text-foreground uppercase tracking-widest mt-0.5">Connect</span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xs">
              {language === "te"
                ? "వైదిక సంప్రదాయాలను ఆధునిక కాలానికి అనుగుణంగా అందరికీ అందుబాటులోకి తీసుకురావడం మా లక్ష్యం."
                : "Bridging ancient Vedic traditions with the modern world — connecting devotees with authentic priests and sacred rituals."}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a href="https://instagram.com/vaidikaconnect" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-600 dark:text-amber-400 transition-colors"
                aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://youtube.com/@vaidikaconnect" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-600 dark:text-amber-400 transition-colors"
                aria-label="YouTube">
                <Youtube className="h-4 w-4" />
              </a>
              <a href="https://twitter.com/vaidikaconnect" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-600 dark:text-amber-400 transition-colors"
                aria-label="Twitter/X">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://facebook.com/vaidikaconnect" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-600 dark:text-amber-400 transition-colors"
                aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="space-y-4">
            <h3 className="font-bold text-foreground text-sm uppercase tracking-widest border-b border-amber-500/30 pb-2">
              {language === "te" ? "సేవలు" : "Services"}
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
              <li className="flex items-center gap-2 hover:text-primary transition-colors">
                <Sparkles className="h-3.5 w-3.5 text-amber-500/70 shrink-0" />
                <Link href="/find-pujari">{language === "te" ? "పూజారిని వెతకండి" : "Find a Pujari"}</Link>
              </li>
              <li className="flex items-center gap-2 hover:text-primary transition-colors">
                <BookOpen className="h-3.5 w-3.5 text-amber-500/70 shrink-0" />
                <Link href="/programs">{language === "te" ? "పూజా కార్యక్రమాలు" : "Pooja Programs"}</Link>
              </li>
              <li className="flex items-center gap-2 hover:text-primary transition-colors">
                <Landmark className="h-3.5 w-3.5 text-amber-500/70 shrink-0" />
                <Link href="/pilgrimage/darshan">{language === "te" ? "దర్శన టికెట్లు" : "Temple Darshan"}</Link>
              </li>
              <li className="flex items-center gap-2 hover:text-primary transition-colors">
                <BookOpen className="h-3.5 w-3.5 text-amber-500/70 shrink-0" />
                <Link href="/spiritual/reading">{language === "te" ? "స్తోత్రాలు" : "Stotrams & Reading"}</Link>
              </li>
              <li className="flex items-center gap-2 hover:text-primary transition-colors">
                <Heart className="h-3.5 w-3.5 text-amber-500/70 shrink-0" />
                <Link href="/aalaya-sannidi">{language === "te" ? "ఆలయ సన్నిది" : "AalayaSannidi"}</Link>
              </li>
              <li className="flex items-center gap-2 hover:text-primary transition-colors">
                <Heart className="h-3.5 w-3.5 text-amber-500/70 shrink-0" />
                <Link href="/join-network">{language === "te" ? "పూజారిగా చేరండి" : "Join as Pujari"}</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Info */}
          <div className="space-y-4">
            <h3 className="font-bold text-foreground text-sm uppercase tracking-widest border-b border-amber-500/30 pb-2">
              {language === "te" ? "చట్టపరమైనవి" : "Legal & Info"}
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
              <li className="flex items-center gap-2 hover:text-primary transition-colors">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-500/70 shrink-0" />
                <Link href="/privacy">{language === "te" ? "గోప్యతా విధానం" : "Privacy Policy"}</Link>
              </li>
              <li className="flex items-center gap-2 hover:text-primary transition-colors">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-500/70 shrink-0" />
                <Link href="/terms">{language === "te" ? "సేవా నిబంధనలు" : "Terms of Service"}</Link>
              </li>
              <li className="flex items-center gap-2 hover:text-primary transition-colors">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-500/70 shrink-0" />
                <Link href="/contact">{language === "te" ? "మమ్మల్ని సంప్రదించండి" : "Contact Us"}</Link>
              </li>
            </ul>

            <div className="pt-3 space-y-2 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground/70 uppercase tracking-widest text-[10px]">
                {language === "te" ? "నమోదిత సంస్థ" : "Registered"}
              </p>
              <p className="leading-relaxed">Andhra Pradesh, India</p>
              <p className="text-[10px] italic opacity-70">MSME / GST Registered</p>
            </div>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-4">
            <h3 className="font-bold text-foreground text-sm uppercase tracking-widest border-b border-amber-500/30 pb-2">
              {language === "te" ? "సంప్రదించండి" : "Contact"}
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Mail className="h-3.5 w-3.5 text-amber-500/70 mt-0.5 shrink-0" />
                <a href="mailto:support@vaidikaconnect.com" className="hover:text-primary transition-colors break-all">
                  support@vaidikaconnect.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-3.5 w-3.5 text-amber-500/70 mt-0.5 shrink-0" />
                <a href="tel:+919876543210" className="hover:text-primary transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-amber-500/70 mt-0.5 shrink-0" />
                <span>Vijayawada, Andhra Pradesh, India — 520001</span>
              </li>
            </ul>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/919876543210?text=Namaskaram%2C%20I%20need%20help%20with%20VaidikaConnect"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-2 text-xs px-3 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-400 hover:bg-green-500/20 transition-colors font-medium"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp Us
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground text-center">
          <p>
            © {year}{" "}
            <span className="font-semibold text-foreground/80">VaidikaConnect</span>
            {" — "}Soppa Sudheendra Sripada. All rights reserved.
          </p>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <span className="text-border">·</span>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <span className="text-border">·</span>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            <span className="ml-2 flex items-center gap-1.5 bg-amber-500/5 px-3 py-1 rounded-full border border-amber-500/20 font-bold text-amber-600 dark:text-amber-500 text-[10px] tracking-wider select-none">
              ॐ VEDIC LEGACY
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
