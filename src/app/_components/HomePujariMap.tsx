"use client";

import type { Pujari } from "@/lib/data";
import { useMemo } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { MapPin } from "lucide-react";
import Link from "next/link";

const MAP_BOUNDS = {
  lat: { min: 40.60, max: 40.85 },
  lng: { min: -74.15, max: -73.90 },
};

export function HomePujariMap({ pujaris }: { pujaris: Pujari[] }) {
  const mapImageUrl = useMemo(() => PlaceHolderImages.find(p => p.id === 'map-background')?.imageUrl || '', []);

  return (
    <div className="relative w-full h-full">
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
            <Link 
              key={pujari.id} 
              href={`/pujari/${pujari.id}`} 
              className="absolute transform -translate-x-1/2 -translate-y-full transition-all duration-300 group"
              style={{ top: `${top}%`, left: `${left}%` }}
            >
                <MapPin className="w-10 h-10 text-card-foreground/70 drop-shadow-lg transition-all duration-300 group-hover:text-primary group-hover:scale-125" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-card group-hover:text-primary-foreground">
                  {pujari.id}
                </span>
            </Link>
        );
      })}
    </div>
  );
}
