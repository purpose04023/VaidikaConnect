"use client";

import type { Puja } from "@/lib/data";
import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/context/language-context";
import { ManagedImage } from "@/components/common/ManagedImage";

export function PujaListClient({ pujas, variant = "sections" }: { pujas: Puja[], variant?: "tabs" | "sections" }) {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const categories = useMemo<string[]>(
    () => [...new Set(pujas.map(p => language === 'te' ? p.category : p.category_en))].sort(),
    [pujas, language]
  );
  const [activeTab, setActiveTab] = useState<string | undefined>();
  const [loadingPujaId, setLoadingPujaId] = useState<number | null>(null);

  useEffect(() => {
    if (categories.length > 0 && (!activeTab || !categories.includes(activeTab))) {
      setActiveTab(categories[0]);
    }
  }, [categories, activeTab]);

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

  const PujaCard = ({ puja }: { puja: Puja }) => (
    <Card key={puja.id} className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col">
      <CardHeader className="p-0">
        <ManagedImage
            src={puja.image}
            alt={puja.name}
            width={600}
            height={400}
            className="w-full h-48 object-cover"
            data-ai-hint={puja.imageHint}
        />
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="font-headline text-2xl mb-2">{language === 'te' ? puja.name : puja.name_en}</CardTitle>
        <p className="text-muted-foreground">{language === 'te' ? puja.description_te : puja.description}</p>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full flex items-center justify-center gap-2" 
          onClick={() => handleFindPujaris(puja)}
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
    </Card>
  );

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
                  
                  return (
                    <TabsContent key={category} value={category}>
                        {categoryPujas.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {categoryPujas.map(puja => (
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

                return (
                    <div key={category}>
                        <h2 className="font-headline text-3xl border-b pb-2 mb-6 text-primary">{category}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {categoryPujas.map(puja => (
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
