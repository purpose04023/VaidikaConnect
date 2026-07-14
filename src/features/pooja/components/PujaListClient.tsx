"use client";

import type { Puja } from "@/lib/data";
import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/context/language-context";
import { ManagedImage } from "@/components/common/ManagedImage";
import { useUser } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export function PujaListClient({ pujas, variant = "sections" }: { pujas: Puja[], variant?: "tabs" | "sections" }) {
  const { t, language } = useLanguage();
  const { user } = useUser();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const subcategory = searchParams.get("subcategory");

  const categories = useMemo<string[]>(
    () => [...new Set(pujas.map(p => language === 'te' ? p.category : p.category_en))].sort(),
    [pujas, language]
  );
  const [activeTab, setActiveTab] = useState<string | undefined>();
  const [loadingPujaId, setLoadingPujaId] = useState<string | number | null>(null);

  const targetCategoryName = useMemo(() => {
    if (!subcategory) return null;
    const cleanSub = subcategory.trim().toLowerCase();
    
    // Find a puja where category_en or category matches
    const matchedPuja = pujas.find(p => {
      const catEn = p.category_en.toLowerCase();
      const catTe = p.category.toLowerCase();
      return catEn === cleanSub || 
             catTe === cleanSub ||
             catEn.replace('pujas', '').trim() === cleanSub.replace('pujas', '').trim() ||
             catEn.replace('poojas', '').trim() === cleanSub.replace('poojas', '').trim();
    });
    
    if (matchedPuja) {
      return language === 'te' ? matchedPuja.category : matchedPuja.category_en;
    }
    return subcategory;
  }, [pujas, subcategory, language]);

  useEffect(() => {
    if (targetCategoryName && categories.includes(targetCategoryName)) {
      setActiveTab(targetCategoryName);
    } else if (categories.length > 0 && (!activeTab || !categories.includes(activeTab))) {
      setActiveTab(categories[0]);
    }
  }, [categories, activeTab, targetCategoryName]);

  // Effect to automatically scroll to the subcategory section when page loads in sections mode
  useEffect(() => {
    if (targetCategoryName) {
      const elementId = `category-${targetCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      
      const timer = setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300); // Small delay to ensure items have rendered
      
      return () => clearTimeout(timer);
    }
  }, [targetCategoryName]);

  const handleFindPujaris = (puja: Puja) => {
    setLoadingPujaId(puja.id);
    router.push(`/find-pujari?puja=${puja.id}`);
  };

  const filteredPujas = useMemo(() => {
    if (!searchQuery) {
      return [];
    }
    return pujas.filter(
      (puja) =>
        puja.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        puja.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        puja.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        puja.description_te.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [pujas, searchQuery]);
  
  const searchResultsByCategory = useMemo(() => {
    return filteredPujas.reduce((acc, puja) => {
        const category = language === 'te' ? puja.category : puja.category_en;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(puja);
        return acc;
    }, {} as Record<string, Puja[]>);
  }, [filteredPujas, language]);

  const PujaCard = ({ puja }: { puja: Puja }) => {
    const isCustom = puja.id.toString().startsWith('custom-');
    const pujaSlug = puja.name_en.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const handleClickCard = (e: React.MouseEvent) => {
      if (isCustom) {
        e.preventDefault();
        e.stopPropagation();
        const element = document.getElementById("custom-pooja-form-section");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    return (
      <Card 
        key={puja.id}
        onClick={handleClickCard}
        className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col group cursor-pointer border border-border/50 rounded-2xl bg-card"
      >
        {isCustom ? (
          <div className="block flex-grow flex flex-col">
            <CardHeader className="p-0 overflow-hidden">
              <ManagedImage
                  src="/logo.png"
                  alt={puja.name}
                  width={600}
                  height={400}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  data-ai-hint="Custom Request Logo"
              />
            </CardHeader>
            <CardContent className="p-6 flex-grow flex flex-col text-left space-y-2">
              <CardTitle className="font-headline text-2xl mb-1 group-hover:text-primary transition-colors duration-200 break-words whitespace-normal leading-relaxed text-primary">
                {language === 'te' ? puja.name : puja.name_en}
              </CardTitle>
              <p className="text-muted-foreground line-clamp-3 text-sm break-words whitespace-normal leading-relaxed">
                {language === 'te' ? puja.description_te : puja.description}
              </p>
            </CardContent>
            <CardFooter className="pt-0 pb-5 px-6 mt-auto">
              <Button 
                className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold shadow-md divine-button h-auto"
              >
                {language === 'te' ? "ఇప్పుడే అభ్యర్థించండి" : "Request Now"}
              </Button>
            </CardFooter>
          </div>
        ) : (
          <>
            <Link href={`/programs/${pujaSlug}`} className="block flex-grow flex flex-col">
              <CardHeader className="p-0 overflow-hidden">
                <ManagedImage
                    src={puja.image}
                    alt={puja.name}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint={puja.imageHint}
                />
              </CardHeader>
              <CardContent className="p-6 flex-grow flex flex-col text-left space-y-2">
                <CardTitle className="font-headline text-2xl mb-1 group-hover:text-primary transition-colors duration-200 break-words whitespace-normal leading-relaxed">{language === 'te' ? puja.name : puja.name_en}</CardTitle>
                <p className="text-muted-foreground line-clamp-3 text-sm break-words whitespace-normal leading-relaxed">{language === 'te' ? puja.description_te : puja.description}</p>
              </CardContent>
            </Link>
            <CardFooter className="pt-0 pb-5 px-6">
              <Button 
                className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold shadow-md divine-button h-auto" 
                onClick={(e) => { e.stopPropagation(); handleFindPujaris(puja); }}
                disabled={loadingPujaId !== null}
              >
                {loadingPujaId === puja.id ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  t('home.select_program')
                )}
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    );
  };

  return (
    <div>
      <div className="relative mb-8 max-w-xl mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t('home.search_placeholder')}
          className="pl-10 h-12 text-lg rounded-full shadow-inner bg-card"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {searchQuery ? (
        <div className="space-y-8">
          {filteredPujas.length > 0 ? (
            Object.keys(searchResultsByCategory).map(category => (
                <div key={category}>
                    <h2 className="font-headline text-2xl border-b pb-2 mb-6">{category} ({searchResultsByCategory[category].length})</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {searchResultsByCategory[category].map(puja => (
                            <PujaCard key={puja.id} puja={puja} />
                        ))}
                    </div>
                </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground mt-8">
              <p>{t('home.no_pujas_found')}</p>
            </div>
          )}
        </div>
      ) : (
        variant === "tabs" ? (
          activeTab && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-center mb-8">
                  <TabsList className="grid h-auto w-full max-w-5xl grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2">
                  {categories.map(category => (
                      <TabsTrigger key={category} value={category} className="text-xs sm:text-sm">{category}</TabsTrigger>
                  ))}
                  </TabsList>
              </div>

              {categories.map(category => {
                  const categoryPujas = pujas.filter(puja => (language === 'te' ? puja.category : puja.category_en) === category);
                  
                  const customCategoryPuja: Puja = {
                    id: `custom-${category}`,
                    name: `ఇతర ${category}`,
                    name_en: `Other ${category}`,
                    category: category as any,
                    category_en: category as any,
                    description: `Request a custom ${category} ritual not listed above. Our AI will verify and assign pricing.`,
                    description_te: `పైన జాబితా చేయని ఇతర ${category} పూజా విధానాన్ని అభ్యర్థించండి. మా AI ధృవీకరించి ధరను కేటాయిస్తుంది.`,
                    image: "/logo.png",
                    imageHint: "Custom Request"
                  };
                  const displayedPujas = [...categoryPujas, customCategoryPuja];

                  return (
                    <TabsContent key={category} value={category}>
                        {displayedPujas.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {displayedPujas.map(puja => (
                                <PujaCard key={puja.id} puja={puja} />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-muted-foreground mt-8">
                            <p>{t('home.no_pujas_in_category')}</p>
                          </div>
                        )}
                    </TabsContent>
                  )
              })}
            </Tabs>
          )
        ) : (
          <div className="space-y-12">
            {categories.map(category => {
                const categoryPujas = pujas.filter(puja => (language === 'te' ? puja.category : puja.category_en) === category);
                
                if (categoryPujas.length === 0) return null;

                const categoryId = `category-${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

                const customCategoryPuja: Puja = {
                  id: `custom-${category}`,
                  name: `ఇతర ${category}`,
                  name_en: `Other ${category}`,
                  category: category as any,
                  category_en: category as any,
                  description: `Request a custom ${category} ritual not listed above. Our AI will verify and assign pricing.`,
                  description_te: `పైన జాబితా చేయని ఇతర ${category} పూజా విధానాన్ని అభ్యర్థించండి. మా AI ధృవీకరించి ధరను కేటాయిస్తుంది.`,
                  image: "/logo.png",
                  imageHint: "Custom Request"
                };
                const displayedPujas = [...categoryPujas, customCategoryPuja];

                return (
                    <div key={category} id={categoryId} className="scroll-mt-24">
                        <h2 className="font-headline text-3xl border-b pb-2 mb-6 text-primary">{category}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {displayedPujas.map(puja => (
                                <PujaCard key={puja.id} puja={puja} />
                            ))}
                        </div>
                    </div>
                )
            })}
          </div>
        )
      )}

    </div>
  );
}
