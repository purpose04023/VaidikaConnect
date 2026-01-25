"use client";

import type { Pujari } from "@/lib/data";
import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { PujariCard } from './PujariCard';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { MapPin, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// Define map boundaries for marker positioning
const MAP_BOUNDS = {
  lat: { min: 40.60, max: 40.85 }, // NYC area latitude
  lng: { min: -74.15, max: -73.90 }, // NYC area longitude
};

export function PujariDiscoveryClient({ pujaris, recommendation }: { pujaris: Pujari[], recommendation: string }) {
  const [selectedPujariId, setSelectedPujariId] = useState<number | null>(pujaris.length > 0 ? pujaris[0].id : null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  const mapImageUrl = useMemo(() => PlaceHolderImages.find(p => p.id === 'map-background')?.imageUrl || '', []);

  const handleMarkerClick = (id: number) => {
    setSelectedPujariId(id);
    const index = pujaris.findIndex(p => p.id === id);
    if (index !== -1) {
      carouselApi?.scrollTo(index);
    }
  };

  const handleCardSelect = (id: number) => {
    setSelectedPujariId(id);
  };
  
  const handleSlideChange = (api: CarouselApi) => {
    if (api) {
      const selectedIndex = api.selectedScrollSnap();
      if (pujaris[selectedIndex]) {
        setSelectedPujariId(pujaris[selectedIndex].id);
      }
    }
  };

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
          <Image
            src={mapImageUrl}
            alt="Map of available pujaris"
            fill
            className="object-cover"
            data-ai-hint={PlaceHolderImages.find(p => p.id === 'map-background')?.imageHint || ''}
            priority
          />
          {pujaris.map(pujari => {
            const top = 100 - ((pujari.location.lat - MAP_BOUNDS.lat.min) / (MAP_BOUNDS.lat.max - MAP_BOUNDS.lat.min) * 100);
            const left = (pujari.location.lng - MAP_BOUNDS.lng.min) / (MAP_BOUNDS.lng.max - MAP_BOUNDS.lng.min) * 100;

            if (top < 0 || top > 100 || left < 0 || left > 100) return null;

            return (
              <button
                key={pujari.id}
                className="absolute transform -translate-x-1/2 -translate-y-full transition-all duration-300"
                style={{ top: `${top}%`, left: `${left}%` }}
                onClick={() => handleMarkerClick(pujari.id)}
                aria-label={`Select ${pujari.name}`}
              >
                <MapPin className={cn(
                  "w-10 h-10 drop-shadow-lg transition-all duration-300",
                  selectedPujariId === pujari.id
                    ? 'text-primary scale-125'
                    : 'text-card-foreground/70 hover:text-primary'
                )} />
                <span className={cn(
                  "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold",
                  selectedPujariId === pujari.id ? 'text-primary-foreground' : 'text-card'
                )}>
                  {pujari.id}
                </span>
              </button>
            );
          })}
        </div>
        
        <div className="flex flex-col">
            <h2 className="font-headline text-2xl mb-4">Pujaris Found ({pujaris.length})</h2>
            {pujaris.length > 0 ? (
                <div className="w-full">
                <Carousel 
                  opts={{ align: "start" }} 
                  className="w-full"
                  setApi={setCarouselApi}
                  onSelect={handleSlideChange}
                >
                    <CarouselContent>
                    {pujaris.map((pujari) => (
                        <CarouselItem key={pujari.id} className="md:basis-1/1 lg:basis-1/1">
                        <PujariCard
                            pujari={pujari}
                            isSelected={selectedPujariId === pujari.id}
                            onSelect={handleCardSelect}
                        />
                        </CarouselItem>
                    ))}
                    </CarouselContent>
                    {pujaris.length > 1 && (
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
                        <p>Please try adjusting the number of participants or selecting a different program.</p>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}
