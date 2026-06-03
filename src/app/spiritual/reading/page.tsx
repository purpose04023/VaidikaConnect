"use client";

import { useLanguage } from "@/context/language-context";
import { stotramsData } from "@/lib/data/stotrams";
import { Card } from "@/components/ui/card";
import { ManagedImage } from "@/components/common/ManagedImage";
import { 
  BookOpen, 
  ExternalLink, 
  Sparkles, 
  Flame, 
  Heart, 
  Sun, 
  Star, 
  Flower, 
  Compass
} from "lucide-react";

export default function SpiritualReadingPage() {
  const { language } = useLanguage();

  // Standalone Stotramanjari platform on GitHub Pages
  const stotramanjariBase = "https://master43721.github.io/stotramanjari";

  // Categories mapping directly to Stotramanjari navigation query params
  const categories = [
    {
      nameTe: "నిత్య పారాయణ శ్లోకాలు",
      nameEn: "Daily Chants",
      icon: Sun,
      color: "text-amber-500",
      url: `${stotramanjariBase}/?category=daily`
    },
    {
      nameTe: "గణేశ స్తోత్రాలు",
      nameEn: "Ganesha Stotrams",
      icon: Sparkles,
      color: "text-amber-400",
      url: `${stotramanjariBase}/?category=ganesha`
    },
    {
      nameTe: "శివ స్తోత్రాలు",
      nameEn: "Shiva Stotrams",
      icon: Flame,
      color: "text-[#FF8C00]",
      url: `${stotramanjariBase}/?category=shiva`
    },
    {
      nameTe: "విష్ణు స్తోత్రాలు",
      nameEn: "Vishnu Stotrams",
      icon: Star,
      color: "text-[#E4B363]",
      url: `${stotramanjariBase}/?category=vishnu`
    },
    {
      nameTe: "దేవీ స్తోత్రాలు",
      nameEn: "Devi Stotrams",
      icon: Heart,
      color: "text-rose-500",
      url: `${stotramanjariBase}/?category=devi`
    },
    {
      nameTe: "రామ స్తోత్రాలు",
      nameEn: "Rama Stotrams",
      icon: Flower,
      color: "text-emerald-400",
      url: `${stotramanjariBase}/?category=rama`
    },
    {
      nameTe: "హనుమద్ స్తోత్రాలు",
      nameEn: "Hanuman Stotrams",
      icon: Compass,
      color: "text-blue-400",
      url: `${stotramanjariBase}/?category=hanuman`
    },
    {
      nameTe: "వేద సూక్తములు",
      nameEn: "Vedic Suktams",
      icon: BookOpen,
      color: "text-purple-400",
      url: `${stotramanjariBase}/?category=vedas`
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-foreground relative overflow-hidden pt-6 pb-16 md:pt-10 md:pb-24">

      {/* Cinematic Divine Background Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div className="absolute w-[800px] h-[800px] rounded-full opacity-20 animate-pulse-slow" 
             style={{ 
               background: 'radial-gradient(circle, rgba(255, 140, 0, 0.12) 0%, rgba(228, 179, 99, 0.03) 50%, transparent 100%)',
               filter: 'blur(90px)'
             }}
        />
        <div className="absolute top-[-5%] right-[5%] w-[400px] h-[400px] rounded-full opacity-15" 
             style={{ 
               background: 'radial-gradient(circle, rgba(228, 179, 99, 0.08) 0%, transparent 80%)',
               filter: 'blur(60px)'
             }}
        />
        <span className="absolute left-[5%] bottom-[10%] text-white/[0.01] text-[200px] font-bold select-none pointer-events-none">ॐ</span>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Page Header */}
        <div className="text-left max-w-4xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.02] border border-white/[0.08] text-primary text-xs md:text-sm font-semibold uppercase tracking-wider shadow-[0_0_15px_rgba(228,179,99,0.05)]">
            ✦ Standalone Digital Library
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter text-white font-sans">
            స్తోత్రమంజరి <span className="gold-gradient-text">గ్రంథాలయం</span>
          </h1>
          <p className="max-w-2xl text-base md:text-lg text-white/60 leading-relaxed font-light">
            {language === "te" 
              ? "వేలాది పవిత్ర స్తోత్రాలు, అష్టోత్తరాలు, మరియు వేద సూక్తముల పఠనం కోసం మా ప్రత్యేక ప్లాట్‌ఫారమ్ 'స్తోత్రమంజరి' ని సందర్శించండి." 
              : "Read the sacred 108 and 1000 names, Vedic mantras, and daily chants inside our standalone reading platform Stotramanjari."}
          </p>
        </div>

        {/* Asymmetric Sidebar & Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar - Categories Navigation (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card border border-white/[0.05] bg-white/[0.02] backdrop-blur-2xl rounded-3xl p-6 shadow-2xl space-y-6">
              <div>
                <h3 className="font-headline text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  {language === "te" ? "స్తోత్ర విభాగాలు" : "Chants Categories"}
                </h3>
                <p className="text-xs text-white/50 mt-1 leading-relaxed">
                  {language === "te" ? "వర్గం వారీగా శ్లోకాలు చదవడానికి ఎంచుకోండి" : "Browse filtered stotram collections externally"}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {categories.map((cat, idx) => {
                  const Icon = cat.icon;
                  return (
                    <a
                      key={idx}
                      href={cat.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl bg-white/[0.01] hover:bg-white/[0.04] border border-white/[0.04] hover:border-[#E4B363]/20 text-white/70 hover:text-white transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={`p-2 rounded-xl bg-white/5 shrink-0 ${cat.color} group-hover:scale-110 transition-transform`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="font-semibold text-sm leading-loose break-words whitespace-normal font-sans">
                          {language === "te" ? cat.nameTe : cat.nameEn}
                        </span>
                      </div>
                      <ExternalLink className="h-4 w-4 opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all shrink-0" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Area - Deity Tiles Grid (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {stotramsData.map((deity) => (
                <div key={deity.id} className="group relative">
                  {/* Subtle hover gradient orb backdrop */}
                  <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-primary/10 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-sm" />
                  
                  <Card className="glass-card flex flex-col h-full overflow-hidden border border-white/[0.04] bg-white/[0.01] rounded-3xl relative p-5 shadow-2xl">
                    
                    {/* Header icon / flower */}
                    <div className="absolute top-4 right-4 opacity-25 group-hover:opacity-75 transition-all z-20">
                      <Sparkles className="h-4 w-4 text-primary animate-spin-slow" />
                    </div>

                    <div className="flex flex-col items-center text-center flex-grow space-y-4">
                      {/* Avatar */}
                      <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full overflow-hidden border border-white/10 shadow-xl relative group-hover:scale-105 transition-transform duration-500 bg-black/40 shrink-0">
                        <ManagedImage 
                          src={deity.imageUrl || "/images/deities/ganesha.png"} 
                          alt={deity.nameEn}
                          data-ai-hint={deity.imageHint}
                          className="object-cover w-full h-full"
                        />
                      </div>

                      {/* Deity Titles */}
                      <div className="space-y-1">
                        <h4 className="font-headline text-xl sm:text-2xl font-bold text-white leading-loose break-words whitespace-normal">
                          {deity.name}
                        </h4>
                        <p className="text-xs text-white/40 font-semibold tracking-widest uppercase">
                          {deity.nameEn}
                        </p>
                      </div>
                    </div>

                    {/* Navigation CTA button */}
                    <div className="mt-6 pt-4 border-t border-white/5">
                      <a
                        href={`${stotramanjariBase}/?category=${deity.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/[0.02] hover:bg-gradient-to-r hover:from-[#FF8C00] hover:to-[#E4B363] border border-white/[0.08] hover:border-transparent text-white hover:text-black font-extrabold text-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,140,0,0.3)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)]"
                      >
                        <span className="tracking-wide">READ NOW</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                      </a>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
