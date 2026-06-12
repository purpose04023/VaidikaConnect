"use client";

import { useContent } from "@/lib/content-store";
import { useLanguage } from "@/context/language-context";
import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ManagedImage } from "@/components/common/ManagedImage";
import { 
  Search, 
  Sparkles, 
  ChevronRight, 
  ArrowRight,
  Filter
} from "lucide-react";

export default function ExplorePoojasPage() {
  const { language, t } = useLanguage();
  const { pujas } = useContent();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    return ["All", "Deeksha Poojalu", "Prenatal", "Childhood", "Homams", "Kalyanams", "Vratas"];
  }, []);

  const filteredPujas = useMemo(() => {
    return pujas.filter((puja) => {
      // 1. Search Query Filter
      const nameMatch = puja.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        puja.name_en.toLowerCase().includes(searchQuery.toLowerCase());
      const descMatch = puja.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        puja.description_te.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSearch = nameMatch || descMatch;

      // 2. Category Filter
      if (activeCategory === "All") {
        return matchesSearch;
      }
      
      // Support matching either in category_en or categories tags array
      const matchesCategory = puja.category_en === activeCategory || 
                              (puja.categories || []).includes(activeCategory);

      return matchesSearch && matchesCategory;
    });
  }, [pujas, searchQuery, activeCategory]);

  return (
    <div className="min-h-screen pb-20 bg-background text-foreground text-left">
      {/* Hero Banner Section */}
      <section className="w-full divine-bg relative overflow-hidden py-16 md:py-24 text-center">
        <div className="pointer-events-none absolute inset-0 overflow-hidden select-none opacity-20">
          <img src="/logo.jpg" alt="" className="absolute top-8 left-[5%] w-[200px] h-[200px] rounded-full object-cover grayscale opacity-[0.03] pointer-events-none" />
          <img src="/logo.jpg" alt="" className="absolute bottom-0 right-[5%] w-[150px] h-[150px] rounded-full object-cover grayscale opacity-[0.03] pointer-events-none" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/30 text-primary text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4 fill-primary" />
            {language === "te" ? "సర్వ పూజా డైరెక్టరీ" : "Complete Sacred Program Directory"}
          </div>
          <h1 className="font-headline text-4xl md:text-6xl font-bold gold-gradient-text">
            {language === "te" ? "వైదిక పూజా కార్యక్రమాలు" : "Explore All Vedic Poojas"}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed break-words whitespace-normal">
            {language === "te"
              ? "వ్రతాలు, నోములు, హోమాలు, కళ్యాణాలు మరియు దీక్షల సంపూర్ణ పట్టికను ఇక్కడ అన్వేషించండి."
              : "Search, filter, and book from our comprehensive catalog of authentic Vedic rituals and ceremonies."}
          </p>

          {/* Centered search bar */}
          <div className="relative mt-10 max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#c8a261]" />
            <Input
              type="search"
              placeholder={language === "te" ? "పూజల పేరు లేదా వివరణతో శోధించండి..." : "Search pujas by name or description..."}
              className="pl-12 h-14 text-base rounded-2xl shadow-md border-border/60 bg-background/90 focus-visible:ring-amber-500/30 text-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Categories & Catalog Grid Grid */}
      <section className="container mx-auto px-4 py-12">
        {/* Category Pills Slider */}
        <div className="flex flex-col space-y-4 mb-10">
          <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground border-b border-border/30 pb-2">
            <Filter className="h-4 w-4 text-primary" />
            <span>{language === "te" ? "వర్గములను వడపోయుము" : "FILTER BY CATEGORY"}</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <Button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  variant={isActive ? "default" : "outline"}
                  className={`h-10 px-5 text-xs font-bold rounded-xl transition-all ${
                    isActive 
                      ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md"
                      : "border-border/60 hover:bg-primary/10 text-muted-foreground"
                  }`}
                >
                  {cat === "All" && (language === "te" ? "అన్నీ" : "All")}
                  {cat !== "All" && cat}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Results Banner */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-headline text-2xl font-bold border-l-4 border-primary pl-3">
            {language === "te" ? "కార్యక్రమాలు" : "Sacred Programs"}
            <span className="ml-2 text-sm text-muted-foreground font-normal">
              ({filteredPujas.length} {language === "te" ? "లభించాయి" : "found"})
            </span>
          </h2>
        </div>

        {/* Dynamic Grid */}
        {filteredPujas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPujas.map((puja) => {
              const pujaSlug = puja.name_en.toLowerCase().replace(/[^a-z0-9]+/g, "-");
              return (
                <Card 
                  key={puja.id} 
                  className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col group cursor-pointer border border-border/50 rounded-3xl bg-card/50"
                >
                  <Link href={`/programs/${pujaSlug}`} className="block flex-grow flex flex-col">
                    <CardHeader className="p-0 overflow-hidden relative">
                      <ManagedImage
                        src={puja.image}
                        alt={puja.name}
                        width={600}
                        height={400}
                        className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                        data-ai-hint={puja.imageHint}
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                        <Badge className="bg-primary text-white border-none font-bold text-[10px] uppercase py-0.5 px-2 rounded-full">
                          {language === "te" ? puja.category : puja.category_en}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-6 flex-grow flex flex-col space-y-3">
                      <CardTitle className="font-headline text-2xl group-hover:text-primary transition-colors duration-200 break-words whitespace-normal leading-relaxed">
                        {language === "te" ? puja.name : puja.name_en}
                      </CardTitle>
                      
                      <p className="text-muted-foreground line-clamp-3 text-sm break-words whitespace-normal leading-relaxed">
                        {language === "te" ? puja.description_te : puja.description}
                      </p>

                      {/* Display Categories/Tags list dynamically if present */}
                      {(puja.categories || []).length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {puja.categories?.map((cat) => (
                            <span 
                              key={cat} 
                              className="text-[9px] font-bold uppercase tracking-wider bg-muted/60 text-muted-foreground py-0.5 px-2 rounded-full border border-border/40"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Link>

                  <CardFooter className="p-6 pt-0 flex gap-2 border-t border-border/20 mt-4">
                    <Button 
                      asChild 
                      variant="outline" 
                      className="flex-1 rounded-xl h-11 border-border/60 hover:bg-primary/10 text-xs font-bold gap-1"
                    >
                      <Link href={`/programs/${pujaSlug}`}>
                        <span>{language === "te" ? "వివరాలు చదవండి" : "Read Details"}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>

                    <Button 
                      asChild 
                      className="flex-1 divine-button rounded-xl h-11 text-xs font-bold gap-1"
                    >
                      <Link href={`/find-pujari?puja=${puja.id}`}>
                        <span>{language === "te" ? "పండితుని బుక్ చేయండి" : "Book Ceremony"}</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed rounded-3xl bg-muted/5 border-border/50 max-w-lg mx-auto">
            <p className="text-muted-foreground italic mb-2">
              {language === "te" ? "శోధనకు సరిపోలిన పూజా కార్యక్రమాలు ఏవీ లభించలేదు." : "No ceremonies matched your active search filters."}
            </p>
            <Button 
              variant="link" 
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              className="text-primary font-bold text-sm"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
