"use client";

import type { Pujari } from "@/lib/data";
import 'leaflet/dist/leaflet.css';
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useEffect, useRef, useState } from "react";
import L from 'leaflet';

const mapContainerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
};

// Center on Andhra Pradesh / Telangana region
const defaultCenter: L.LatLngExpression = [16.3067, 80.4367];

/** Creates a glowing saffron SVG pin icon */
function createPujariIcon(verified: boolean) {
  const color = verified ? "ff8c00" : "cc7722";
  const glow  = verified ? "ff8c00" : "cc7722";
  return L.divIcon({
    html: `
      <div style="position:relative;width:44px;height:52px;filter:drop-shadow(0 3px 8px #${glow}88);">
        <svg xmlns="http://www.w3.org/2000/svg" width="44" height="52" viewBox="0 0 24 28">
          <path d="M12 0C7.6 0 4 3.6 4 8c0 6.4 8 18 8 18s8-11.6 8-18c0-4.4-3.6-8-8-8z"
                fill="#${color}" stroke="white" stroke-width="1.2"/>
          <circle cx="12" cy="8" r="3.5" fill="white" opacity="0.9"/>
        </svg>
        ${verified ? `<div style="position:absolute;top:-4px;right:-4px;width:14px;height:14px;background:#ff8c00;border:2px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:8px;color:white;">✓</div>` : ''}
      </div>
    `,
    className: 'bg-transparent border-0',
    iconSize:    [44, 52],
    iconAnchor:  [22, 52],
    popupAnchor: [0, -54],
  });
}

/** Builds the rich HTML popup for a pujari marker */
function buildPopupHtml(pujari: Pujari): string {
  const stars = '★'.repeat(Math.round(pujari.rating)) + '☆'.repeat(5 - Math.round(pujari.rating));
  return `
    <div style="min-width:180px;font-family:'Lato',sans-serif;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
        <img src="${pujari.photo}" alt="${pujari.name}"
             style="width:44px;height:44px;border-radius:50%;object-fit:cover;border:2px solid #ff8c00;" />
        <div>
          <div style="font-weight:700;font-size:13px;color:#1a1008;">${pujari.name}</div>
          ${pujari.verified ? `<div style="font-size:10px;color:#ff8c00;font-weight:600;">✓ VaidikaConnect Verified</div>` : ''}
        </div>
      </div>
      <div style="font-size:11px;color:#7a6040;margin-bottom:4px;">
        ⭐ <span style="color:#cc7722;font-weight:600;">${pujari.rating.toFixed(1)}</span>
        &nbsp;${stars}&nbsp;(${pujari.reviewCount} reviews)
      </div>
      <div style="font-size:11px;color:#7a6040;margin-bottom:4px;">
        🎓 ${pujari.experience} yrs exp &nbsp;·&nbsp; ₹${pujari.basePrice.toLocaleString()}+
      </div>
      <div style="font-size:11px;color:#7a6040;margin-bottom:8px;">
        🗣 ${pujari.languages.join(', ')}
      </div>
    </div>
  `;
}

export function HomePujariMap({ pujaris }: { pujaris: Pujari[] }) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const mapRef           = useRef<HTMLDivElement>(null);
  const mapInstanceRef   = useRef<L.Map | null>(null);
  const markersLayerRef  = useRef<L.LayerGroup | null>(null);

  // ── Step 1: initialize map once on client mount ───────────────────────────
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: defaultCenter,
      zoom: 7,
      scrollWheelZoom: false,
      zoomControl: true,
    });

    // Beautiful light Carto tile layer
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      }
    ).addTo(map);

    // A separate layer group to hold all pujari markers
    const layer = L.layerGroup().addTo(map);

    mapInstanceRef.current  = map;
    markersLayerRef.current = layer;

    return () => {
      map.remove();
      mapInstanceRef.current  = null;
      markersLayerRef.current = null;
    };
  }, [isClient]);

  // ── Step 2: whenever pujaris change (Firebase update), redraw ALL markers ─
  useEffect(() => {
    const map   = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    // Clear existing markers first
    layer.clearLayers();

    if (pujaris.length === 0) return;

    const bounds: L.LatLngTuple[] = [];

    pujaris.forEach(pujari => {
      const { lat, lng } = pujari.location;
      if (!lat || !lng) return;

      bounds.push([lat, lng]);

      const marker = L.marker([lat, lng], { icon: createPujariIcon(!!pujari.verified) });

      // Rich popup with photo, rating, experience
      const popupNode = document.createElement('div');
      popupNode.innerHTML = buildPopupHtml(pujari);

      const viewBtn = document.createElement('button');
      viewBtn.innerHTML = '🔍 View Full Profile';
      viewBtn.style.cssText = `
        width:100%;margin-top:4px;padding:6px 10px;
        background:linear-gradient(135deg,#ff8c00,#ffb347);
        color:white;border:none;border-radius:8px;
        font-size:12px;font-weight:700;cursor:pointer;
        box-shadow:0 2px 8px rgba(255,140,0,0.4);
        transition:opacity 0.2s;
      `;
      viewBtn.onmouseover = () => { viewBtn.style.opacity = '0.85'; };
      viewBtn.onmouseout  = () => { viewBtn.style.opacity = '1'; };
      viewBtn.onclick     = () => router.push(`/pujari/${pujari.id}`);
      popupNode.appendChild(viewBtn);

      marker.bindPopup(L.popup({ maxWidth: 240 }).setContent(popupNode));
      layer.addLayer(marker);
    });

    // Auto-fit the map viewport to show all pujaris
    if (bounds.length > 0) {
      if (bounds.length === 1) {
        map.setView(bounds[0], 12);
      } else {
        map.fitBounds(L.latLngBounds(bounds), { padding: [40, 40], maxZoom: 10 });
      }
    }
  }, [pujaris, router]);

  if (!isClient) {
    return <Skeleton className="w-full h-full" />;
  }

  return <div ref={mapRef} style={mapContainerStyle} />;
}
