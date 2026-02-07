"use client";

import type { Pujari } from "@/lib/data";
import 'leaflet/dist/leaflet.css';
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useEffect, useState, useRef } from "react";
import L from 'leaflet';

const mapContainerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
};

const center: L.LatLngExpression = [40.730610, -73.935242];

export function HomePujariMap({ pujaris }: { pujaris: Pujari[] }) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && mapRef.current && !mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapRef.current!, {
            center: center,
            zoom: 11,
            scrollWheelZoom: false,
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        }).addTo(mapInstanceRef.current);

        const createPujariIcon = () => {
            const orangeColor = "ff9933";
            return L.divIcon({
                html: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="%23${orangeColor}" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
                className: 'bg-transparent border-0',
                iconSize: [40, 40],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40]
            });
        };

        pujaris.forEach(pujari => {
            const marker = L.marker([pujari.location.lat, pujari.location.lng], { icon: createPujariIcon() })
                .addTo(mapInstanceRef.current!);

            const popupContent = document.createElement('div');
            popupContent.innerHTML = `<div class="font-bold">${pujari.name}</div>`;
            const button = document.createElement('button');
            button.className = "text-primary underline mt-1";
            button.innerText = "View Profile";
            button.onclick = () => router.push(`/pujari/${pujari.id}`);
            popupContent.appendChild(button);
            
            marker.bindPopup(popupContent);
        });
    }

    // Cleanup function to remove map on component unmount
    return () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }
    };
  }, [isClient, pujaris, router]);


  if (!isClient) {
    return <Skeleton className="w-full h-full" />;
  }

  return <div ref={mapRef} style={mapContainerStyle} />;
}
