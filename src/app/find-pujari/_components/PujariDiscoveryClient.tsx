"use client";

import type { Pujari } from "@/lib/data";
import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { PujariCard } from './PujariCard';
import { Sparkles } from "lucide-react";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { Skeleton } from "@/components/ui/skeleton";

// Map settings
const mapContainerStyle = {
  width: '100%',
  height: '100%',
};
const center = { lat: 40.730610, lng: -73.935242 };
const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: [
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
    { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { featureType: "administrative", elementType: "geometry", stylers: [{ visibility: "off" }] },
  ]
};

export function PujariDiscoveryClient({ pujaris, recommendation }: { pujaris: Pujari[], recommendation: string }) {
  const [selectedPujariId, setSelectedPujariId] = useState<number | null>(pujaris.length > 0 ? pujaris[0].id : null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ['marker'],
  });

  const handleMarkerClick = (id: number) => {
    setSelectedPujariId(id);
    const index = pujaris.findIndex(p => p.id === id);
    if (index !== -1 && carouselApi) {
      carouselApi.scrollTo(index);
    }
  };

  const handleCardSelect = (id: number) => {
    setSelectedPujariId(id);
  };
  
  useEffect(() => {
    if (!carouselApi) {
      return
    }
 
    const onSelect = (api: CarouselApi) => {
      const selectedIndex = api.selectedScrollSnap();
      if (pujaris[selectedIndex]) {
        setSelectedPujariId(pujaris[selectedIndex].id);
      }
    }
 
    carouselApi.on("select", onSelect)
 
    return () => {
      carouselApi.off("select", onSelect)
    }
  }, [carouselApi, pujaris])


  const orangeColor = "ff9933";
  const grayColor = "a1a1aa"; // text-card-foreground/70 approx gray

  const MapView = () => {
    if (loadError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-destructive/10 text-destructive-foreground p-4 text-center">
          <p className="font-bold">Error loading maps.</p>
          <p className="text-sm">Please ensure you have a valid Google Maps API key.</p>
        </div>
      );
    }
    if (!isLoaded) {
      return <Skeleton className="w-full h-full" />;
    }
    return (
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={11}
        center={center}
        options={mapOptions}
      >
        {pujaris.map(pujari => {
          const isSelected = selectedPujariId === pujari.id;
          return (
            <MarkerF
              key={pujari.id}
              position={pujari.location}
              title={pujari.name}
              onClick={() => handleMarkerClick(pujari.id)}
              zIndex={isSelected ? 10 : 1}
              icon={{
                url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="%23${isSelected ? orangeColor : grayColor}" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" transform="scale(${isSelected ? 1.25 : 1})"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
                scaledSize: new window.google.maps.Size(48, 48),
              }}
            />
          );
        })}
      </GoogleMap>
    );
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
          <MapView />
        </div>
        
        <div className="flex flex-col">
            <h2 className="font-headline text-2xl mb-4">Pujaris Found ({pujaris.length})</h2>
            {pujaris.length > 0 ? (
                <div className="w-full">
                <Carousel 
                  opts={{ align: "start" }} 
                  className="w-full"
                  setApi={setCarouselApi}
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
