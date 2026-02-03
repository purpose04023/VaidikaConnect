"use client";

import type { Pujari } from "@/lib/data";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useGoogleMaps } from "@/context/google-maps-context";

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 40.730610,
  lng: -73.935242
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: [ // Adding some styles to make it look nicer
    {
      "featureType": "poi",
      "stylers": [
        { "visibility": "off" }
      ]
    },
    {
      "featureType": "transit",
      "stylers": [
        { "visibility": "off" }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.icon",
      "stylers": [
        { "visibility": "off" }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [
        { "visibility": "off" }
      ]
    }
  ]
};

export function HomePujariMap({ pujaris }: { pujaris: Pujari[] }) {
  const router = useRouter();
  const { isLoaded, loadError } = useGoogleMaps();

  const handleMarkerClick = (pujariId: number) => {
    router.push(`/pujari/${pujariId}`);
  };

  if (loadError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-destructive/10 text-destructive-foreground p-4 text-center">
        <p className="font-bold">Error loading maps.</p>
        <p className="text-sm">Please ensure you have a valid Google Maps API key in your .env file and that the Google Maps JavaScript API is enabled for your project.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return <Skeleton className="w-full h-full" />;
  }

  // This prevents crashes if the script loads but fails to initialize due to a bad API key.
  const googleMapsAvailable = typeof window !== 'undefined' && (window as any).google && (window as any).google.maps;
  if (!googleMapsAvailable) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-destructive/10 text-destructive-foreground p-4 text-center">
        <p className="font-bold">Could not initialize Google Maps.</p>
        <p className="text-sm">Please check that your Google Maps API key is correct and valid in your .env file.</p>
      </div>
    );
  }
  
  const orangeColor = "ff9933"; // Hex for hsl(36 100% 60%)

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={11}
      center={center}
      options={mapOptions}
    >
      {pujaris.map(pujari => (
        <MarkerF
          key={pujari.id}
          position={pujari.location}
          title={pujari.name}
          onClick={() => handleMarkerClick(pujari.id)}
          icon={{
            url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="%23${orangeColor}" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
            scaledSize: new (window as any).google.maps.Size(40, 40),
          }}
        />
      ))}
    </GoogleMap>
  );
}
