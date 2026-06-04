"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/language-context";
import { categoriesList, stotramsMap } from "@/lib/data/stotramanjari_data";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ManagedImage } from "@/components/common/ManagedImage";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { 
  Search, 
  BookOpen
} from "lucide-react";

export default function SpiritualReadingPage() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  // Base URL for Stotramanjari on GitHub Pages
  const stotramanjariBase = "https://master43721.github.io";

  // Filter categories and their stotrams based on search query
  const filteredCategories = categoriesList.map(category => {
    const matchingSlugs = category.slugs.filter(slug => {
      const stotram = stotramsMap[slug];
      if (!stotram) return false;
      return stotram.titleEng.toLowerCase().includes(searchQuery.toLowerCase()) ||
             stotram.titleTel.includes(searchQuery);
    });
    return {
      ...category,
      matchingSlugs
    };
  }).filter(category => category.matchingSlugs.length > 0);

  // Auto-expand accordions when searching; collapse when search is cleared
  useEffect(() => {
    if (searchQuery.trim() !== "") {
      setOpenCategories(filteredCategories.map(c => c.id));
    } else {
      setOpenCategories([]);
    }
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden pt-6 pb-16 md:pt-10 md:pb-24">

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
        <span className="absolute left-[5%] bottom-[10%] text-foreground/[0.01] text-[200px] font-bold select-none pointer-events-none">ॐ</span>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Page Header */}
        <div className="text-left max-w-4xl mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/30 border border-border text-primary text-xs md:text-sm font-semibold uppercase tracking-wider shadow-[0_0_15px_rgba(228,179,99,0.05)]">
            ✦ Standalone Digital Library
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter text-foreground font-sans">
            స్తోత్రమంజరి <span className="gold-gradient-text">గ్రంథాలయం</span>
          </h1>
          <p className="max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed font-light">
            {language === "te" 
              ? "వేలాది పవిత్ర స్తోత్రాలు, అష్టోత్తరాలు, మరియు వేద సూక్తముల పఠనం కోసం మా ప్రత్యేక ప్లాట్‌ఫారమ్ 'స్తోత్రమంజరి' ని సందర్శించండి." 
              : "Read the sacred 108 and 1000 names, Vedic mantras, and daily chants inside our standalone reading platform Stotramanjari."}
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mb-10 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl blur-md opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              placeholder={language === "te" ? "స్తోత్రము పేరుతో వెతకండి (తెలుగు లేదా English)..." : "Search stotrams by title (English or తెలుగు)..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 rounded-2xl bg-card/50 border-border/60 hover:border-primary/30 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary backdrop-blur-xl transition-all shadow-lg text-sm sm:text-base font-sans"
            />
          </div>
        </div>

        {/* Categories Accordion */}
        <div className="max-w-5xl">
          {filteredCategories.length > 0 ? (
            <AccordionPrimitive.Root 
              type="multiple" 
              value={openCategories} 
              onValueChange={setOpenCategories}
              className="space-y-4"
            >
              {filteredCategories.map((category) => {
                const isOpen = openCategories.includes(category.id);
                return (
                  <AccordionPrimitive.Item 
                    key={category.id} 
                    value={category.id}
                    className="glass-card rounded-2xl overflow-hidden border border-border/40 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-primary/20"
                  >
                    <AccordionPrimitive.Header className="flex">
                      <AccordionPrimitive.Trigger
                        className="w-full flex items-center justify-between px-5 py-4 text-left font-medium transition-all group outline-none"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          
                          {/* Category Avatar */}
                          <div className="h-12 w-12 rounded-xl overflow-hidden border border-white/10 shadow-md shrink-0 relative bg-muted">
                            <ManagedImage 
                              src={category.iconUrl} 
                              alt={language === "te" ? category.nameTe : category.nameEn}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          
                          {/* Collapse indicator [+] / [-] */}
                          <div className="h-5 w-5 border border-primary/30 dark:border-primary/50 flex items-center justify-center rounded text-primary text-xs font-mono font-bold shrink-0 select-none bg-primary/5 group-hover:bg-primary/10 transition-colors">
                            {isOpen ? "−" : "+"}
                          </div>

                          {/* Title */}
                          <span className="font-bold text-sm sm:text-base md:text-lg tracking-wide uppercase text-slate-800 dark:text-slate-100 font-sans group-hover:text-primary transition-colors leading-tight truncate">
                            {language === "te" ? category.nameTe : category.nameEn}
                            <span className="text-primary/70 ml-2 font-mono text-xs md:text-sm normal-case font-bold">
                              ({category.slugs.length})
                            </span>
                          </span>
                        </div>
                      </AccordionPrimitive.Trigger>
                    </AccordionPrimitive.Header>
                    
                    <AccordionPrimitive.Content
                      className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
                    >
                      <div className="px-5 pb-6 pt-2 border-t border-border/10 bg-card/10">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
                          {category.matchingSlugs.map((slug) => {
                            const stotram = stotramsMap[slug];
                            if (!stotram) return null;
                            const fullUrl = `${stotramanjariBase}${stotram.href}`;
                            return (
                              <a
                                key={slug}
                                href={fullUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start group/link text-[13px] sm:text-sm text-emerald-700 dark:text-emerald-400 hover:text-primary dark:hover:text-primary transition-colors py-0.5"
                              >
                                {/* Square bullet point */}
                                <span className="h-1.5 w-1.5 bg-amber-600 dark:bg-amber-500 rounded-sm inline-block mr-2.5 mt-2 shrink-0 group-hover/link:bg-primary transition-colors" />
                                <span className="underline decoration-emerald-700/20 group-hover/link:decoration-primary group-hover/link:translate-x-0.5 transition-all leading-relaxed font-sans font-medium">
                                  {language === "te" ? stotram.titleTel : stotram.titleEng}
                                </span>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </AccordionPrimitive.Content>
                  </AccordionPrimitive.Item>
                );
              })}
            </AccordionPrimitive.Root>
          ) : (
            <Card className="glass-card p-8 text-center rounded-2xl border border-border/40 shadow-xl">
              <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm sm:text-base font-sans">
                {language === "te" 
                  ? "ఏ శ్లోకాలు కనుగొనబడలేదు. దయచేసి మీ శోధనను సరిచూసుకోండి." 
                  : "No chants found matching your search. Please check your spelling."}
              </p>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}
