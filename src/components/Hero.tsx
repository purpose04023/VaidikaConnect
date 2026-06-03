"use client";

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/language-context';
import { ManagedImage } from '@/components/common/ManagedImage';

export function Hero({ 
  title, 
  subtitle 
}: { 
  title: string; 
  subtitle: string; 
}) {
  const { t, language } = useLanguage();

  return (
    <section className="w-full bg-background min-h-[90vh] flex items-center relative overflow-hidden py-16 md:py-28 border-b border-border">
      {/* 1. Subtle, pulsing radial gradient in the background center to create an ethereal depth effect */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div className="absolute w-[800px] h-[800px] rounded-full opacity-35 animate-pulse-slow" 
             style={{ 
               background: 'radial-gradient(circle, rgba(255, 140, 0, 0.15) 0%, rgba(228, 179, 99, 0.05) 50%, transparent 100%)',
               filter: 'blur(80px)'
             }}
         />
         {/* Dynamic incense smoke orbs in corners */}
         <div className="absolute top-[-10%] left-[5%] w-[400px] h-[400px] rounded-full opacity-25" 
              style={{ 
                background: 'radial-gradient(circle, rgba(228, 179, 99, 0.08) 0%, transparent 80%)',
                filter: 'blur(60px)'
              }}
         />
         <div className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] rounded-full opacity-20" 
              style={{ 
                background: 'radial-gradient(circle, rgba(255, 140, 0, 0.08) 0%, transparent 80%)',
                filter: 'blur(70px)'
              }}
         />
         {/* Decorative subtle Om in Sanskrit watermark */}
         <span className="absolute right-[8%] top-[12%] text-foreground/[0.015] text-[280px] font-bold select-none pointer-events-none font-serif leading-none animate-float">ॐ</span>
       </div>
 
       <div className="container mx-auto px-6 relative z-10">
         {/* Asymmetric layout (Grid with text left, interactive cards showcase right) */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
           
           {/* Left Column - Text Content (lg:col-span-7) */}
           <div className="text-left flex flex-col items-start lg:col-span-7 space-y-6 md:space-y-8 -mt-4 lg:-mt-8">
             
             {/* Balanced Heading (Sized perfectly for laptops/desktops) */}
             <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl tracking-tighter font-extrabold text-foreground leading-[1.1] break-words whitespace-normal font-sans">
               {title.includes(".") ? (
                 <>
                   {title.split(".")[0]}.<br />
                   <span className="gold-gradient-text">{title.split(".")[1]}</span>
                 </>
               ) : (
                 title
               )}
             </h1>
 
             {/* Dynamic Content Subtitle */}
             <p className="max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed font-light font-sans tracking-wide">
               {subtitle}
             </p>
 
             {/* Glowing Buttons Action Section */}
             <div className="flex flex-wrap gap-4 pt-2 w-full sm:w-auto">
               {/* Highly stylized, glowing pill-shape "Explore Poojas" button */}
               <Link href="/explore" className="group relative rounded-full p-[1.5px] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,140,0,0.6)] focus:outline-none focus:ring-2 focus:ring-primary inline-block">
                 <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF8C00] via-[#E4B363] to-[#FF8C00] p-[1.5px]" />
                 <div className="px-8 py-4 rounded-full bg-gradient-to-r from-[#FF8C00] to-[#E4B363] flex items-center justify-center gap-3 relative z-10">
                   <span className="text-black font-extrabold tracking-wide text-base">
                     {t('home.hero_cta_explore') || (language === 'te' ? "పూజలను అన్వేషించండి" : "Explore Pujas")}
                   </span>
                   <ArrowRight className="h-5 w-5 text-black transition-transform duration-300 group-hover:translate-x-1" />
                 </div>
               </Link>
 
 
               {/* Login Button with Glassmorphism */}
               <Button asChild size="lg" className="rounded-full bg-secondary/50 border border-border text-foreground hover:bg-secondary/80 hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] px-8 py-6 text-base font-semibold tracking-wide transition-all h-auto">
                 <Link href="/login">{t('home.hero_cta_login') || "Login / Sign Up"}</Link>
               </Button>
             </div>
 
             {/* Quick stats (Glassmorphic containers) */}
             <div className="grid grid-cols-3 gap-4 md:gap-6 pt-6 w-full max-w-lg">
               {[
                 { num: "68+", label: language === "te" ? "పూజా కార్యక్రమాలు" : "Sacred Programs" },
                 { num: "500+", label: language === "te" ? "ఆనందకరమైన కుటుంబాలు" : "Happy Families" },
                 { num: "30+", label: language === "te" ? "ప్రముఖ పండితులు" : "Expert Pujaris" },
               ].map((stat) => (
                 <div key={stat.label} className="glass-card rounded-2xl p-4 text-center hover:border-primary/25 transition-all duration-500">
                   <p className="text-2xl md:text-3xl font-extrabold gold-gradient-text tracking-tighter">{stat.num}</p>
                   <p className="text-[10px] md:text-xs text-muted-foreground font-medium tracking-widest uppercase mt-1.5">{stat.label}</p>
                 </div>
               ))}
             </div>
 
           </div>
 
           {/* Right Column - Sacred Overlapping Glassmorphic Showcase (lg:col-span-5) */}
           <div className="hidden lg:flex lg:col-span-5 relative justify-center items-center h-[550px] w-full">
             {/* Background divine light ring */}
             <div className="absolute w-[420px] h-[420px] rounded-full border border-primary/20 opacity-30 animate-spin-slow pointer-events-none flex items-center justify-center">
               <div className="w-[380px] h-[380px] rounded-full border border-dashed border-accent/20" />
             </div>
 
             {/* Overlapping Glassmorphic Card 1 (Ganesha - Divine Beginnings) */}
             <div className="absolute transform -translate-x-12 -translate-y-16 scale-95 z-10 w-[240px] glass-card rounded-3xl p-4 shadow-[0_15px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.6)] hover:-translate-y-20 transition-all duration-500">
               <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-black/40">
                 <ManagedImage 
                   src="/images/deities/ganesha.png" 
                   alt="Lord Ganesha"
                   fill
                   className="object-cover w-full h-full scale-105 hover:scale-110 transition-transform duration-500"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                 <span className="absolute bottom-3 left-3 text-[10px] bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                   Vighnaharta
                 </span>
               </div>
               <div className="mt-3 text-left">
                 <h3 className="text-base font-bold text-foreground tracking-tight">Lord Ganesha</h3>
                 <p className="text-xs text-muted-foreground mt-1 line-clamp-1">Veneration before every new endeavor</p>
               </div>
             </div>
 
             {/* Overlapping Glassmorphic Card 2 (Shiva - Cosmic Consciousness) */}
             <div className="absolute transform translate-x-16 translate-y-12 z-20 w-[260px] glass-card rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.8)] hover:translate-y-8 transition-all duration-500">
               <div className="relative h-[200px] w-full overflow-hidden rounded-2xl bg-black/40">
                 <ManagedImage 
                   src="/images/deities/shiva.png" 
                   alt="Lord Shiva"
                   fill
                   className="object-cover w-full h-full scale-105 hover:scale-110 transition-transform duration-500"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                 <span className="absolute bottom-3 left-3 text-[10px] bg-accent/20 text-accent border border-accent/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                   Mahadeva
                 </span>
               </div>
               <div className="mt-4 text-left">
                 <h3 className="text-lg font-bold text-foreground tracking-tight">Lord Shiva</h3>
                 <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">Supreme meditative energy & cosmic purification</p>
               </div>
             </div>
 
             {/* Decorative floaters */}
             <div className="absolute top-[10%] right-[10%] text-primary/40 text-xl font-bold animate-float z-0">
               ॐ
             </div>
             <div className="absolute bottom-[20%] left-[10%] text-accent/30 text-lg font-bold animate-pulse-slow z-0" style={{ animationDelay: '2s' }}>
               ✦
             </div>
 
           </div>
 
         </div>
       </div>
     </section>
   );
 }
