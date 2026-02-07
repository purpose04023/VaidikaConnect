"use client";

import type { Pujari } from "@/lib/data";
import type { CarouselApi } from "@/components/ui/carousel";
import React, { useEffect, useState, useRef, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';
import { Skeleton } from "@/components/ui/skeleton";
import L from 'leaflet';

const mapContainerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
};
const center: L.LatLngExpression = [16.3067, 80.4367]; // Guntur, AP

interface PujariMapProps {
    pujaris: Pujari[];
    selectedPujariId: number | null;
    setSelectedPujariId: (id: number) => void;
    carouselApi: CarouselApi | undefined;
}

export function PujariMap({ pujaris, selectedPujariId, setSelectedPujariId, carouselApi }: PujariMapProps) {
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

    const handleMarkerClick = useCallback((id: number) => {
        setSelectedPujariId(id);
        const index = pujaris.findIndex(p => p.id === id);
        if (index !== -1 && carouselApi) {
          carouselApi.scrollTo(index);
        }
    }, [pujaris, carouselApi, setSelectedPujariId]);

    // Initialize map
    useEffect(() => {
        if (isClient && mapRef.current && !mapInstanceRef.current) {
            mapInstanceRef.current = L.map(mapRef.current, {
                center: center,
                zoom: 12,
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

    // Update markers when pujaris list changes
    useEffect(() => {
        if (mapInstanceRef.current && isClient) {
            Object.values(markersRef.current).forEach(marker => marker.remove());
            markersRef.current = {};

            pujaris.forEach(pujari => {
                const marker = L.marker([pujari.location.lat, pujari.location.lng], {
                    icon: createPujariIcon(false),
                })
                .addTo(mapInstanceRef.current!)
                .bindPopup(pujari.name)
                .on('click', () => handleMarkerClick(pujari.id));
                
                markersRef.current[pujari.id] = marker;
            });
        }
    }, [isClient, pujaris, handleMarkerClick]);

    // Update marker styles and pan map when selectedPujariId changes
    useEffect(() => {
      const selectedPujari = pujaris.find(p => p.id === selectedPujariId);
      if (mapInstanceRef.current && selectedPujari) {
        Object.entries(markersRef.current).forEach(([id, marker]) => {
          const isSelected = Number(id) === selectedPujariId;
          marker.setIcon(createPujariIcon(isSelected));
          marker.setZIndexOffset(isSelected ? 1000 : 0);
          if (isSelected) {
            marker.openPopup();
          }
        });
        
        mapInstanceRef.current.flyTo([selectedPujari.location.lat, selectedPujari.location.lng], mapInstanceRef.current.getZoom());
      }
    }, [selectedPujariId, pujaris]);

    if (!isClient) {
        return <Skeleton className="w-full h-full" />;
    }

    return <div ref={mapRef} style={mapContainerStyle} />;
}
