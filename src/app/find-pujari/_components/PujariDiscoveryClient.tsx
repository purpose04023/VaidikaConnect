"use client";

import type { Pujari } from "@/lib/data";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { PujariCard } from './PujariCard';
import { Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from 'next/dynamic';
import { useContent } from "@/lib/content-store";

const PujariMap = dynamic(
    () => import('./PujariMap').then(mod => mod.PujariMap),
    { 
        ssr: false,
        loading: () => <Skeleton className="w-full h-full" />
    }
);


export function PujariDiscoveryClient({
  pujaris,
  recommendation,
  pujaId,
}: {
  pujaris: Pujari[];
  recommendation: string;
  pujaId?: number;
}) {
  const { pujaris: editablePujaris } = useContent();
  const sourcePujaris = editablePujaris.length ? editablePujaris : pujaris;
  const displayPujaris = pujaId
    ? sourcePujaris.filter(pujari => pujari.pujas.includes(pujaId))
    : sourcePujaris;
  const [selectedPujariId, setSelectedPujariId] = useState<number | null>(displayPujaris.length > 0 ? displayPujaris[0].id : null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  useEffect(() => {
    if (displayPujaris.length === 0) {
      setSelectedPujariId(null);
      return;
    }

    if (!displayPujaris.some(pujari => pujari.id === selectedPujariId)) {
      setSelectedPujariId(displayPujaris[0].id);
    }
  }, [displayPujaris, selectedPujariId]);

  const handleCardSelect = (id: number) => {
    setSelectedPujariId(id);
    const index = displayPujaris.findIndex(p => p.id === id);
    if (index !== -1 && carouselApi) {
      carouselApi.scrollTo(index, true); // add true for jump
    }
  };
  
  useEffect(() => {
    if (!carouselApi) {
      return
    }
 
    const onSelect = (api: NonNullable<CarouselApi>) => {
      const selectedIndex = api.selectedScrollSnap();
      if (displayPujaris[selectedIndex]) {
        setSelectedPujariId(displayPujaris[selectedIndex].id);
      }
    }
 
    carouselApi.on("select", onSelect)
 
    return () => {
      carouselApi.off("select", onSelect)
    }
  }, [carouselApi, displayPujaris]);


  return (
    <div className="space-y-8">
      {/* AI Recommendation Card */}
      <Card className="bg-gradient-to-br from-primary/20 to-accent/20 border-primary">
        <CardHeader className="flex flex-row items-center gap-4">
          <Sparkles className="w-8 h-8 text-primary" />
          <CardTitle className="font-headline text-2xl text-primary">AI Recommendation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/80">{recommendation}</p>
        </CardContent>
      </Card>

      {/* Map and Pujari List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden shadow-lg border">
            <PujariMap 
                pujaris={displayPujaris} 
                selectedPujariId={selectedPujariId}
                setSelectedPujariId={setSelectedPujariId}
                carouselApi={carouselApi}
            />
        </div>
        
        <div className="flex flex-col">
            <h2 className="font-headline text-2xl mb-4">Pujaris Found ({displayPujaris.length})</h2>
            {displayPujaris.length > 0 ? (
                <div className="w-full">
                <Carousel 
                  opts={{ align: "start" }} 
                  className="w-full"
                  setApi={setCarouselApi}
                >
                    <CarouselContent>
                    {displayPujaris.map((pujari) => (
                        <CarouselItem key={pujari.id} className="md:basis-1/1 lg:basis-1/1">
                        <PujariCard
                            pujari={pujari}
                            isSelected={selectedPujariId === pujari.id}
                            onSelect={handleCardSelect}
                        />
                        </CarouselItem>
                    ))}
                    </CarouselContent>
                    {displayPujaris.length > 1 && (
                      <>
                        <CarouselPrevious className="hidden sm:flex" />
                        <CarouselNext className="hidden sm:flex" />
                      </>
                    )}
                </Carousel>
                </div>
            ) : (
                <Card className="flex items-center justify-center h-full">
                    <CardContent className="text-center text-muted-foreground p-6">
                        <p>No pujaris found for the selected criteria.</p>
                        <p>Please try selecting a different program.</p>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}
