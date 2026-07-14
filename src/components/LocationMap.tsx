"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapPoojari {
  id: string | number;
  name: string;
  lat: number;
  lng: number;
}

interface LocationMapProps {
  pujaris: MapPoojari[];
  centerLat: number;
  centerLng: number;
  selectedId: string | number | null;
  onSelect: (id: string | number) => void;
}

export default function LocationMap({
  pujaris,
  centerLat,
  centerLng,
  selectedId,
  onSelect,
}: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string | number, L.Marker>>({});

  const createIcon = (isSelected: boolean) => {
    const color = isSelected ? "f59e0b" : "6b7280"; // Amber-500 vs Gray-500
    const scale = isSelected ? 1.25 : 1;
    return L.divIcon({
      html: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="#${color}" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="transform: scale(${scale});"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
      className: "bg-transparent border-0 transition-transform duration-200",
      iconSize: [48, 48],
      iconAnchor: [24, 48],
      popupAnchor: [0, -48],
    });
  };

  // Initialize Map Instance
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        center: [centerLat, centerLng],
        zoom: 13,
        scrollWheelZoom: true,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        }
      ).addTo(mapInstanceRef.current);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update center when centerLat/centerLng changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([centerLat, centerLng], 13, {
        animate: true,
        duration: 1.5,
      });
      
      // Also add a custom temporary marker for the user's location
      const userIcon = L.divIcon({
        html: `<div className="relative flex h-5 w-5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span><span className="relative inline-flex rounded-full h-5 w-5 bg-sky-500 border-2 border-white"></span></div>`,
        className: "bg-transparent border-0",
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });
      
      const userMarker = L.marker([centerLat, centerLng], { icon: userIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup("Your Location")
        .openPopup();
        
      return () => {
        userMarker.remove();
      };
    }
  }, [centerLat, centerLng]);

  // Update Markers
  useEffect(() => {
    if (mapInstanceRef.current) {
      // Clear old markers
      Object.values(markersRef.current).forEach((marker) => marker.remove());
      markersRef.current = {};

      // Add new markers
      pujaris.forEach((pujari) => {
        const marker = L.marker([pujari.lat, pujari.lng], {
          icon: createIcon(pujari.id === selectedId),
        })
          .addTo(mapInstanceRef.current!)
          .bindPopup(pujari.name)
          .on("click", () => onSelect(pujari.id));

        markersRef.current[pujari.id] = marker;
      });
    }
  }, [pujaris, onSelect]);

  // Handle marker style update when selection changes
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const isSelected = String(id) === String(selectedId);
      marker.setIcon(createIcon(isSelected));
      marker.setZIndexOffset(isSelected ? 1000 : 0);
      if (isSelected && mapInstanceRef.current) {
        marker.openPopup();
        mapInstanceRef.current.panTo(marker.getLatLng());
      }
    });
  }, [selectedId]);

  return <div ref={mapRef} className="w-full h-full rounded-2xl overflow-hidden shadow-inner min-h-[350px] md:min-h-full" />;
}
