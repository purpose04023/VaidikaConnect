"use client";

import { useState, useMemo, useEffect } from "react";
import { useContent } from "@/lib/content-store";
import type { Deity } from "@/lib/data/stotrams";
import { useLanguage } from "@/context/language-context";
import { 
  BookOpen, 
  Search, 
  ChevronRight, 
  ExternalLink, 
  Sparkles, 
  Flower, 
  Menu, 
  Compass, 
  Languages, 
  ArrowUpRight, 
  FolderHeart, 
  Info,
  X,
  FileText,
  BadgeAlert
} from "lucide-react";
import { ManagedImage } from "./common/ManagedImage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import vignanamData from "@/lib/data/vignanam-categories.json";

interface VignanamItem {
  title: string;
  url: string;
}

interface VignanamCategory {
  category: string;
  items: VignanamItem[];
}

export default function StotramsDisplay() {
  const { language } = useLanguage();
  const { deities } = useContent();

  const categoriesData: VignanamCategory[] = vignanamData;

  // Define the special Deity Category
  const DEITY_CATEGORY_NAME = language === "te" ? "🕉️ దేవతా పఠనాలు & CMS" : "🕉️ Deity Readings & CMS";
  const DEITY_CATEGORY_DESC = language === "te" 
    ? "సజీవ సవరణ (CMS) సౌకర్యంతో దేవతా అష్టోత్తర శతనామావళి మరియు సహస్రనామ స్తోత్రాల పఠన వేదిక."
    : "Read the sacred 108 and 1000 names of Hindu Deities with live double-click editing.";

  // State
  const [activeCategoryName, setActiveCategoryName] = useState<string>(DEITY_CATEGORY_NAME);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Auto-scroll to top of stotram list when category changes
  useEffect(() => {
    const rightPane = document.getElementById("stotrams-list-container");
    if (rightPane) {
      rightPane.scrollTop = 0;
    }
  }, [activeCategoryName]);

  // Format count string out of category name e.g. "నిత్య పారాయణ శ్లోకాః (26)" -> "26"
  const getCategoryCount = (catName: string) => {
    const match = catName.match(/\((\d+)\)/);
    return match ? match[1] : "";
  };

  const getCleanCategoryName = (catName: string) => {
    return catName.replace(/\(\d+\)/, "").trim();
  };

  // Compile active category items
  const activeCategory = useMemo(() => {
    if (activeCategoryName === DEITY_CATEGORY_NAME) {
      return {
        category: DEITY_CATEGORY_NAME,
        description: DEITY_CATEGORY_DESC,
        isSpecial: true,
        items: []
      };
    }
    const found = categoriesData.find(c => c.category === activeCategoryName);
    return found ? {
      category: found.category,
      description: language === "te" 
        ? "విజ్ఞానం.ఆర్గ్ సౌజన్యంతో వేలాది స్తోత్రాలు, మంత్రాలు, మరియు ఉపనిషత్తుల సేకరణ."
        : "Authentic stotram, mantras and shlokas library parsed from Vignanam.org.",
      isSpecial: false,
      items: found.items
    } : {
      category: categoriesData[0].category,
      description: "",
      isSpecial: false,
      items: categoriesData[0].items
    };
  }, [activeCategoryName, categoriesData, DEITY_CATEGORY_NAME, DEITY_CATEGORY_DESC, language]);

  // Global search across all stotrams and deities
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();

    // 1. Search in Deities
    const matchedDeities = deities.filter(d => 
      d.name.toLowerCase().includes(query) || 
      d.nameEn.toLowerCase().includes(query)
    );

    // 2. Search in all Vignanam items
    const matchedItems: { item: VignanamItem; category: string }[] = [];
    categoriesData.forEach(cat => {
      cat.items.forEach(item => {
        if (item.title.toLowerCase().includes(query)) {
          matchedItems.push({
            item,
            category: getCleanCategoryName(cat.category)
          });
        }
      });
    });

    return {
      deities: matchedDeities,
      stotrams: matchedItems
    };
  }, [searchQuery, deities, categoriesData]);

  // Sidebar list view
  const sidebarContent = (
    <div className="flex flex-col h-full bg-background/30 backdrop-blur-md">
      {/* Sidebar Search Bar */}
      <div className="p-4 border-b border-border/40">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={language === "te" ? "మొత్తం గ్రంథాలయంలో వెతకండి..." : "Search all stotrams..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background/50 border-border/60 rounded-xl focus-visible:ring-amber-500/30 text-sm h-10"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Categories Scrollable List */}
      <ScrollArea className="flex-1 px-3 py-2">
        <div className="flex flex-col gap-1 pb-6">
          {/* 1. Special Deity Category */}
          <button
            onClick={() => {
              setActiveCategoryName(DEITY_CATEGORY_NAME);
              setSearchQuery("");
              setIsMobileDrawerOpen(false);
            }}
            className={`w-full text-left px-4 py-3.5 rounded-xl transition-all duration-300 flex items-center justify-between group relative overflow-hidden ${
              activeCategoryName === DEITY_CATEGORY_NAME && !searchQuery
                ? "bg-gradient-to-r from-amber-500/20 to-orange-600/20 border-l-4 border-amber-500 text-foreground font-semibold shadow-inner"
                : "hover:bg-muted/40 hover:text-foreground text-muted-foreground"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-amber-500 dark:text-amber-400 group-hover:scale-110 transition-transform">
                🕉️
              </span>
              <span className="font-semibold text-sm leading-tight">
                {language === "te" ? "పూజా మూర్తులు" : "Deity Readings"}
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full">
              CMS
            </span>
          </button>

          <div className="h-px bg-border/40 my-2 mx-2" />

          {/* 2. Vignanam Categories */}
          {categoriesData.map((cat, idx) => {
            const count = getCategoryCount(cat.category);
            const cleanName = getCleanCategoryName(cat.category);
            const isActive = activeCategoryName === cat.category && !searchQuery;

            return (
              <button
                key={idx}
                onClick={() => {
                  setActiveCategoryName(cat.category);
                  setSearchQuery("");
                  setIsMobileDrawerOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-between group border-l-4 border-transparent ${
                  isActive
                    ? "bg-muted/80 text-foreground font-semibold border-l-amber-500 shadow-sm"
                    : "hover:bg-muted/30 hover:text-foreground text-muted-foreground"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <BookOpen className={`w-4 h-4 shrink-0 transition-transform ${isActive ? "text-amber-500" : "opacity-60 group-hover:scale-110"}`} />
                  <span className="font-medium text-sm leading-tight truncate pr-2">
                    {cleanName}
                  </span>
                </div>
                {count && (
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isActive ? "bg-amber-500/20 text-amber-600 dark:text-amber-400" : "bg-muted/60 text-muted-foreground group-hover:bg-muted"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Header section with modern soft glows */}
      <div className="text-center md:text-left mb-6 max-w-4xl">
        <h1 className="font-headline text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-3 bg-gradient-to-r from-foreground via-foreground to-amber-600 bg-clip-text text-transparent">
          {language === 'te' ? 'అష్టోత్తరాలు & సహస్రనామాలు' : 'Sacred Reading Library'}
        </h1>
        <p className="text-muted-foreground text-sm md:text-base lg:text-lg">
          {language === 'te' 
            ? 'దేవతల అష్టోత్తర నామావళి మరియు సంపూర్ణ స్తోత్రాలు. విజ్ఞానం.ఆర్గ్ సౌజన్యంతో సేకరించబడిన వేలాది ఆధ్యాత్మిక పారాయణాలు.'
            : 'Read the sacred 108 and 1000 names of Hindu Deities, and search across thousands of divine stotrams.'}
        </p>
      </div>

      {/* Main Glass Dashboard container */}
      <div className="backdrop-blur-lg bg-card/30 dark:bg-black/10 border border-border/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[calc(100vh-14rem)] min-h-[600px] relative">
        
        {/* Left Side: Desktop sticky sidebar */}
        <aside className="hidden md:flex flex-col w-72 lg:w-80 border-r border-border/40 shrink-0 bg-muted/10">
          {sidebarContent}
        </aside>

        {/* Mobile Header for switching categories */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-border/40 bg-muted/10">
          <div className="flex items-center gap-2 min-w-0">
            <Compass className="h-5 w-5 text-amber-500 shrink-0" />
            <span className="font-bold text-sm leading-tight truncate">
              {searchQuery ? (language === "te" ? "వెతుకులాట ఫలితాలు" : "Search Results") : getCleanCategoryName(activeCategoryName)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Sheet Drawer button */}
            <Sheet open={isMobileDrawerOpen} onOpenChange={setIsMobileDrawerOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 px-3 gap-1 rounded-xl">
                  <Menu className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-semibold">{language === "te" ? "విభాగాలు" : "Browse"}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80">
                <SheetHeader className="p-4 border-b border-border/40 bg-muted/10 text-left">
                  <SheetTitle className="font-headline text-lg font-bold text-foreground">
                    {language === "te" ? "స్తోత్ర గ్రంథాలయం" : "Reading Library"}
                  </SheetTitle>
                </SheetHeader>
                <div className="h-[calc(100vh-5rem)]">
                  {sidebarContent}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search Input (only visible on mobile layout when drawer is closed) */}
        <div className="md:hidden p-3 border-b border-border/40 bg-background/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={language === "te" ? "స్తోత్రాల శోధన..." : "Search stotrams..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background/50 border-border/60 rounded-xl focus-visible:ring-amber-500/30 text-sm h-9"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Content Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-background/10">
          
          {/* Scrollable stotrams grid */}
          <ScrollArea id="stotrams-list-container" className="flex-1 p-6 md:p-8">
            
            {/* If Search is active, render search results */}
            {searchResults ? (
              <div className="flex flex-col gap-6">
                <div className="border-b border-border/40 pb-5">
                  <div className="flex items-center gap-2 text-amber-500 font-semibold mb-2">
                    <Sparkles className="h-5 w-5 animate-pulse" />
                    <span>{language === "te" ? "వెతుకులాట ఫలితాలు" : "Search Results"}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {language === "te" 
                      ? `"${searchQuery}" కోసం వెతికిన ఫలితాలు:`
                      : `Found matches for "${searchQuery}"`}
                  </p>
                </div>

                {/* 1. Deity Search Results */}
                {searchResults.deities.length > 0 && (
                  <div className="flex flex-col gap-4">
                    <h3 className="font-headline text-lg font-bold text-foreground/80 flex items-center gap-2 border-b border-border/20 pb-2">
                      <Flower className="h-4 w-4 text-amber-500" />
                      {language === "te" ? "పూజా మూర్తులు" : "Deities"}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {searchResults.deities.map((deity) => (
                        <DeityCard key={deity.id} deity={deity} language={language} />
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Stotram Search Results */}
                <div className="flex flex-col gap-4 mt-2">
                  <h3 className="font-headline text-lg font-bold text-foreground/80 flex items-center gap-2 border-b border-border/20 pb-2">
                    <BookOpen className="h-4 w-4 text-amber-500" />
                    {language === "te" ? "స్తోత్ర పారాయణాలు" : "Stotram Texts"}
                  </h3>
                  {searchResults.stotrams.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
                      {searchResults.stotrams.map(({ item, category }, idx) => (
                        <StotramCard key={idx} item={item} categoryTag={category} />
                      ))}
                    </div>
                  ) : (
                    searchResults.deities.length === 0 && (
                      <div className="text-center py-16 text-muted-foreground">
                        <BadgeAlert className="w-12 h-12 mx-auto mb-4 opacity-30 text-amber-500" />
                        <p className="text-sm font-semibold">{language === "te" ? "ఏ ఫలితాలు లభించలేదు" : "No results found"}</p>
                        <p className="text-xs mt-1 text-muted-foreground/60">{language === "te" ? "మరొక పదంతో ప్రయత్నించండి" : "Try searching for a different keyword"}</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            ) : (
              // If NO Search active, render active category content
              <div className="flex flex-col gap-6">
                
                {/* Dynamic Category Hero Panel */}
                <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-orange-600/5 to-transparent p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Glowing decorative background circles */}
                  <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-amber-500/10 dark:bg-amber-500/5 blur-3xl pointer-events-none" />
                  <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-orange-500/10 dark:bg-orange-500/5 blur-3xl pointer-events-none" />

                  <div className="relative z-10 space-y-2 max-w-xl">
                    <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      {language === "te" ? "శ్రీ వైదిక గ్రంథాలయం" : "Vaidika Reading Space"}
                    </span>
                    <h2 className="font-headline text-2xl md:text-3xl lg:text-4xl text-foreground font-bold tracking-tight">
                      {getCleanCategoryName(activeCategory.category)}
                    </h2>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {activeCategory.description}
                    </p>
                  </div>

                  {!activeCategory.isSpecial && (
                    <div className="relative z-10 shrink-0 self-start md:self-center bg-background/80 dark:bg-black/30 backdrop-blur-md px-4 py-3 rounded-2xl border border-border/40 shadow-sm flex flex-col items-center">
                      <span className="text-2xl font-extrabold text-amber-500 leading-none">
                        {activeCategory.items.length}
                      </span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">
                        {language === "te" ? "స్తోత్రాలు" : "Texts"}
                      </span>
                    </div>
                  )}
                </div>

                {/* 1. Special Deity Grid render */}
                {activeCategory.isSpecial ? (
                  <div className="flex flex-col gap-6 pb-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                      {deities.map((deity) => (
                        <DeityCard key={deity.id} deity={deity} language={language} />
                      ))}
                    </div>
                  </div>
                ) : (
                  // 2. Standard Stotrams Grid render
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-16">
                    {activeCategory.items.map((item, idx) => (
                      <StotramCard key={idx} item={item} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Sub-components to keep code clean, modular and beautiful
// ──────────────────────────────────────────────────────────────────────────────

function DeityCard({ deity, language }: { deity: Deity; language: string }) {
  return (
    <div className="group relative h-full">
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none blur-sm" />
      <Card className="bg-white/5 backdrop-blur-md hover:bg-white/10 border-white/10 hover:border-amber-500/30 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 h-full flex flex-col overflow-hidden rounded-2xl relative">
        <div className="absolute top-3 right-3 opacity-30 group-hover:opacity-80 transition-opacity z-20">
          <Flower className="h-4 w-4 text-amber-500 animate-spin-slow" />
        </div>

        <div className="p-5 flex flex-col items-center text-center flex-1">
          <div className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 rounded-full overflow-hidden border border-white/10 shadow-lg relative group-hover:scale-105 transition-transform duration-500 bg-muted">
            <ManagedImage 
              src={deity.imageUrl || "https://placehold.co/400x400/png"} 
              alt={deity.nameEn}
              data-ai-hint={deity.imageHint}
              className="object-cover w-full h-full"
            />
          </div>
          
          <div className="mt-4 flex-1">
            <h4 className="font-headline text-base sm:text-lg md:text-xl font-bold text-foreground leading-relaxed break-words whitespace-normal">
              {deity.name}
            </h4>
            <p className="text-[10px] sm:text-xs text-muted-foreground tracking-widest uppercase mt-1">
              {deity.nameEn}
            </p>
          </div>
        </div>

        <div className="border-t border-white/5 p-3 bg-white/5 flex flex-col gap-2">
          <a
            href={deity.ashtotharamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl bg-white/5 hover:bg-amber-500/20 border border-white/5 hover:border-amber-500/30 text-foreground transition-all duration-300"
          >
            <span className="font-semibold">{language === 'te' ? 'అష్టోత్తర శతనామావళి' : '108 Names (Ashtotharam)'}</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60 shrink-0" />
          </a>
          <a
            href={deity.sahasranamamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl bg-white/5 hover:bg-amber-500/20 border border-white/5 hover:border-amber-500/30 text-foreground transition-all duration-300"
          >
            <span className="font-semibold">{language === 'te' ? 'సహస్రనామ స్తోత్రం' : '1000 Names (Sahasranamam)'}</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60 shrink-0" />
          </a>
        </div>
      </Card>
    </div>
  );
}

function StotramCard({ item, categoryTag }: { item: VignanamItem; categoryTag?: string }) {
  const { language } = useLanguage();
  
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-amber-500/30 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group overflow-hidden"
    >
      <div className="p-5 flex-1 flex gap-4 items-start">
        <div className="p-2.5 rounded-xl bg-white/5 text-muted-foreground group-hover:bg-gradient-to-br group-hover:from-amber-500 group-hover:to-orange-500 group-hover:text-white transition-all duration-300 group-hover:scale-110 shadow-sm shrink-0">
          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500/70" />
        </div>
        
        <div className="min-w-0 flex-1">
          {categoryTag && (
            <span className="inline-block text-[9px] font-bold uppercase tracking-wide bg-white/10 px-2 py-0.5 rounded-full text-amber-400 mb-2">
              {categoryTag}
            </span>
          )}
          <h4 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2 break-words whitespace-normal leading-relaxed">
            {item.title}
          </h4>
        </div>
      </div>

      <div className="border-t border-white/5 px-4 py-2.5 bg-white/5 flex items-center justify-between text-muted-foreground group-hover:text-foreground transition-colors">
        <span className="text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
          {language === "te" ? "విజ్ఞానంలో చదవండి ↗" : "Read on Vignanam ↗"}
        </span>
        <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all shrink-0" />
      </div>
    </a>
  );
}
