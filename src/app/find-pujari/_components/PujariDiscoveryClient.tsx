"use client";

import type { Pujari } from "@/lib/data";
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { PujariCard } from './PujariCard';
import { Sparkles } from "lucide-react";
import 'leaflet/dist/leaflet.css';
import { Skeleton } from "@/components/ui/skeleton";
import L from 'leaflet';

// Map settings
const mapContainerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
};
const center: L.LatLngExpression = [40.730610, -73.935242];

export function PujariDiscoveryClient({ pujaris, recommendation }: { pujaris: Pujari[], recommendation: string }) {
  const [selectedPujariId, setSelectedPujariId] = useState<number | null>(pujaris.length > 0 ? pujaris[0].id : null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

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
  }, [carouselApi, pujaris]);

  const MapView = () => {
    const [isClient, setIsClient] = useState(false);
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markersRef = useRef<Record<number, L.Marker>>({});

    useEffect(() => {
        setIsClient(true);
    }, []);

    const createPujariIcon = (isSelected: boolean) => {
        const orangeColor = "ff9933";
        const grayColor = "a1a1aa";
        const color = isSelected ? orangeColor : grayColor;
        const scale = isSelected ? 1.25 : 1;
        
        return L.divIcon({
            html: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="%23${color}" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="transform: scale(${scale});"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
            className: 'bg-transparent border-0 transition-transform duration-200',
            iconSize: [48, 48],
            iconAnchor: [24, 48],
            popupAnchor: [0, -48]
        });
    };

    const handleMarkerClick = (id: number) => {
        setSelectedPujariId(id);
        const index = pujaris.findIndex(p => p.id === id);
        if (index !== -1 && carouselApi) {
          carouselApi.scrollTo(index);
        }
      };

    useEffect(() => {
        if (isClient && mapRef.current && !mapInstanceRef.current) {
            mapInstanceRef.current = L.map(mapRef.current, {
                center: center,
                zoom: 11,
                scrollWheelZoom: true,
            });

            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            }).addTo(mapInstanceRef.current);
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [isClient]);

    useEffect(() => {
        if (mapInstanceRef.current) {
            // Clear existing markers
            Object.values(markersRef.current).forEach(marker => marker.remove());
            markersRef.current = {};

            // Add new markers
            pujaris.forEach(pujari => {
                const isSelected = selectedPujariId === pujari.id;
                const marker = L.marker([pujari.location.lat, pujari.location.lng], {
                    icon: createPujariIcon(isSelected),
                    zIndexOffset: isSelected ? 1000 : 0,
                })
                .addTo(mapInstanceRef.current!)
                .bindPopup(pujari.name)
                .on('click', () => handleMarkerClick(pujari.id));
                
                markersRef.current[pujari.id] = marker;
            });
        }
    }, [isClient, pujaris]);

    useEffect(() => {
      const selectedPujari = pujaris.find(p => p.id === selectedPujariId);
      if (mapInstanceRef.current && selectedPujari) {
        // Update marker styles
        Object.entries(markersRef.current).forEach(([id, marker]) => {
          const isSelected = Number(id) === selectedPujariId;
          marker.setIcon(createPujariIcon(isSelected));
          marker.setZIndexOffset(isSelected ? 1000 : 0);
        });
        
        mapInstanceRef.current.flyTo([selectedPujari.location.lat, selectedPujari.location.lng], mapInstanceRef.current.getZoom());
      }
    }, [selectedPujariId]);

    if (!isClient) {
        return <Skeleton className="w-full h-full" />;
    }

    return <div ref={mapRef} style={mapContainerStyle} />;
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
