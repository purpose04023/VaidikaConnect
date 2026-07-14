"use client";

import React, { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import type { Pujari } from "@/lib/data";
import { 
  MapPin, 
  Navigation, 
  Phone, 
  MessageCircle, 
  Calendar, 
  Star, 
  Clock, 
  ChevronRight, 
  Sparkles,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";

// Dynamic import of Leaflet Map component with no SSR to prevent builds breaking
const LocationMap = dynamic(() => import("@/components/LocationMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-muted/20 min-h-[350px] rounded-2xl border border-border/50">
      <Loader2 className="h-8 w-8 animate-spin text-amber-500 mb-2" />
      <span className="text-sm text-muted-foreground font-medium">Loading map canvas...</span>
    </div>
  ),
});

// Mock Pujari Interface
export interface Poojari {
  id: number;
  name: string;
  nameEn: string;
  lat: number;
  lng: number;
  availableTimings: string;
  rating: number;
  experience: number;
  phone: string;
  photo: string;
  basePrice: number;
  specialties: string[];
}

// Mock Array situated around Guntur, Andhra Pradesh (Center: 16.3067, 80.4367)
const mockPoojaris: Poojari[] = [
  {
    id: 101,
    name: "శ్రీనివాస శాస్త్రి",
    nameEn: "Sri Srinivasa Sastri",
    lat: 16.3100,
    lng: 80.4400,
    availableTimings: "9:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    rating: 4.8,
    experience: 12,
    phone: "+919876543210",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
    basePrice: 4500,
    specialties: ["గణపతి హోమం", "సత్యనారాయణ వ్రతం", "రుద్రాభిషేకం"]
  },
  {
    id: 102,
    name: "రామమూర్తి శర్మ",
    nameEn: "Sri Rama Murthy Sharma",
    lat: 16.2990,
    lng: 80.4280,
    availableTimings: "8:00 AM - 1:00 PM, 3:30 PM - 7:30 PM",
    rating: 4.9,
    experience: 15,
    phone: "+919876543211",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80",
    basePrice: 5500,
    specialties: ["నవగ్రహ పూజ", "గృహప్రవేశం", "మహా రుద్రాభిషేకం"]
  },
  {
    id: 103,
    name: "సుబ్రహ్మణ్య సిద్ధాంతి",
    nameEn: "Sri Subrahmanya Siddhanti",
    lat: 16.3200,
    lng: 80.4500,
    availableTimings: "10:00 AM - 2:00 PM, 5:00 PM - 9:00 PM",
    rating: 4.7,
    experience: 8,
    phone: "+919876543212",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    basePrice: 3500,
    specialties: ["వివాహ మహోత్సవం", "చండీ హోమం", "ఉపనయనం"]
  },
  {
    id: 104,
    name: "వెంకట రమణాచార్యులు",
    nameEn: "Sri Venkata Ramanadhacharyulu",
    lat: 16.2850,
    lng: 80.4100,
    availableTimings: "7:00 AM - 11:30 AM, 4:00 PM - 8:30 PM",
    rating: 4.95,
    experience: 20,
    phone: "+919876543213",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
    basePrice: 6500,
    specialties: ["సుదర్శన హోమం", "శ్రీసూక్త హోమం", "వాస్తు పూజ"]
  }
];

export default function PoojariSearchFlow({ 
  pujaris, 
  pujaId 
}: { 
  pujaris?: Pujari[]; 
  pujaId?: string | number;
}) {
  const { language } = useLanguage();
  const { toast } = useToast();

  // Location search states
  const [locationQuery, setLocationQuery] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [centerCoords, setCenterCoords] = useState({ lat: 16.3067, lng: 80.4367 }); // Default Guntur

  // Selection states
  const [selectedPoojariId, setSelectedPoojariId] = useState<string | number | null>(null);
  
  // Card Expansion states per Pujari
  const [activeActions, setActiveActions] = useState<Record<string | number, "call" | "chat" | "book" | null>>({});

  // Sync center coords when pujaris load
  useEffect(() => {
    if (pujaris && pujaris.length > 0) {
      setCenterCoords({ lat: pujaris[0].location.lat, lng: pujaris[0].location.lng });
    }
  }, [pujaris]);

  // Map dynamic Pujari objects to Poojari objects
  const activePoojaris = useMemo(() => {
    if (pujaris && pujaris.length > 0) {
      return pujaris.map(p => ({
        id: p.id,
        name: p.name,
        nameEn: p.name,
        lat: p.location.lat,
        lng: p.location.lng,
        availableTimings: p.availableTimings || "Morning Slot, Evening Slot",
        rating: p.rating,
        experience: p.experience,
        phone: p.phone,
        photo: p.photo,
        basePrice: p.basePrice,
        specialties: p.qualifications
      }));
    }
    return mockPoojaris;
  }, [pujaris]);

  // Trigger GPS Geolocation
  const handleGetDeviceLocation = () => {
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Geolocation Unsupported",
        description: "Your browser does not support automatic location services."
      });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCenterCoords({ lat: latitude, lng: longitude });
        setLocationQuery(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        setIsLocating(false);
        toast({
          title: "📍 Location Detected!",
          description: `Coordinates mapped: ${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E.`
        });
      },
      (error) => {
        console.error("GPS fetch failed:", error);
        setIsLocating(false);
        toast({
          variant: "destructive",
          title: "GPS Access Denied",
          description: "Could not fetch your coordinates. Please enter Guntur or pincode manually."
        });
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Location search manual submit
  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationQuery.trim()) return;

    // Simple parser for common locations or mock coords
    const queryLower = locationQuery.toLowerCase();
    if (queryLower.includes("guntur") || queryLower.includes("522")) {
      setCenterCoords({ lat: 16.3067, lng: 80.4367 });
      toast({
        title: "📍 Guntur Region Mapped",
        description: "Displaying qualified poojaris around Guntur metropolitan area."
      });
    } else if (queryLower.includes("vijayawada") || queryLower.includes("520")) {
      setCenterCoords({ lat: 16.5062, lng: 80.6480 });
      toast({
        title: "📍 Vijayawada Region Mapped",
        description: "Displaying qualified poojaris around Vijayawada metropolitan area."
      });
    } else {
      // Mock slight offset from Guntur
      setCenterCoords({ lat: 16.3150, lng: 80.4450 });
      toast({
        title: `📍 Location Searched: ${locationQuery}`,
        description: "Mapped closest regional centers."
      });
    }
  };

  // Toggle card actions
  const toggleAction = (poojariId: string | number, actionType: "call" | "chat" | "book") => {
    setActiveActions(prev => {
      const current = prev[poojariId];
      if (current === actionType) {
        return { ...prev, [poojariId]: null };
      }
      return { ...prev, [poojariId]: actionType };
    });

    if (actionType === "book") {
      toast({
        title: language === "te" ? "📅 పూజారి సంప్రదింపు వివరాలు!" : "📅 Pujari Contact Details!",
        description: language === "te" ? "వివరాలు విస్తరించబద్ధాయి. సమయాల కొరకు పూజారితో మాట్లాడండి." : "Contact details expanded. Discuss timings directly with Pujari."
      });
    }
  };

  const mapPoojarisList = useMemo(() => {
    return activePoojaris.map(p => ({
      id: p.id,
      name: language === "te" ? p.name : p.nameEn,
      lat: p.lat,
      lng: p.lng
    }));
  }, [activePoojaris, language]);

  return (
    <div className="w-full space-y-6">
      
      {/* Step 1: Location Collection Bar */}
      <Card className="p-5">
        <form onSubmit={handleLocationSubmit} className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#c8a261]" />
            <Input
              placeholder={language === "te" ? "మీ నగరం లేదా పిన్ కోడ్ నమోదు చేయండి..." : "Enter your location (City/Pincode)..."}
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              className="pl-10 h-12 bg-background border-border/60 rounded-xl focus-visible:ring-amber-500/30 text-sm"
            />
          </div>
          
          <div className="flex gap-2">
            <Button type="submit" className="h-12 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold">
              {language === "te" ? "శోధించండి" : "Search"}
            </Button>
            
            <Button 
              type="button" 
              onClick={handleGetDeviceLocation} 
              disabled={isLocating}
              variant="outline" 
              className="h-12 gap-2 border-border/60 hover:bg-muted/40 rounded-xl"
            >
              {isLocating ? (
                <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
              ) : (
                <Navigation className="h-4 w-4 text-amber-500" />
              )}
              <span className="text-xs font-semibold">
                {language === "te" ? "నా స్థానం పొందండి" : "Get Location from Device"}
              </span>
            </Button>
          </div>
        </form>
      </Card>

      {/* Step 2: Two Column Map & List Layout */}
      <div className="flex flex-col md:flex-row gap-6 h-[600px] min-h-[500px]">
        
        {/* Left Column: Client Map */}
        <div className="w-full md:w-1/2 h-[350px] md:h-full relative rounded-2xl overflow-hidden border border-border/50 bg-background/5 p-1 shadow-md">
          <LocationMap 
            pujaris={mapPoojarisList}
            centerLat={centerCoords.lat}
            centerLng={centerCoords.lng}
            selectedId={selectedPoojariId}
            onSelect={setSelectedPoojariId}
          />
        </div>

        {/* Right Column: Pujaris Scrollable List */}
        <div className="w-full md:w-1/2 h-[calc(600px-350px)] md:h-full flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-border/40 pb-2 px-1">
            <h3 className="font-headline text-lg font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
              {language === "te" ? "సమీపంలోని పండితులు" : "Available Regional Pujaris"}
            </h3>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2 py-0.5 rounded-full">
              {activePoojaris.length} Verified
            </span>
          </div>

          <ScrollArea className="flex-1 pr-2">
            <div className="flex flex-col gap-4 pb-8">
              {activePoojaris.map((poojari) => {
                const isActive = selectedPoojariId === poojari.id;
                const activeAction = activeActions[poojari.id] || null;

                return (
                  <Card 
                    key={poojari.id}
                    onClick={() => setSelectedPoojariId(poojari.id)}
                    className={`transition-all duration-300 cursor-pointer overflow-hidden ${
                      isActive ? "border-[#FF8C00]/45 bg-white/[0.08] ring-1 ring-amber-500/20" : ""
                    }`}
                  >
                    <div className="p-4 sm:p-5 flex gap-4 items-start">
                      {/* Avatar Photo */}
                      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden border border-border/60 shadow-sm shrink-0 bg-muted">
                        <img 
                          src={poojari.photo} 
                          alt={poojari.nameEn} 
                          className="object-cover w-full h-full"
                        />
                      </div>

                      {/* Info body */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-headline text-base sm:text-lg font-bold truncate text-foreground group-hover:text-primary">
                            {language === "te" ? poojari.name : poojari.nameEn}
                          </h4>
                          <span className="flex items-center gap-1 text-[#c8a261] shrink-0 font-bold text-xs bg-amber-500/10 px-2 py-0.5 rounded-full">
                            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                            {poojari.rating.toFixed(2)}
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                          <span>{poojari.experience} Yrs Exp</span>
                          <span>•</span>
                          <span className="text-[#c8a261] font-semibold">₹{poojari.basePrice.toLocaleString()} Base Price</span>
                        </p>

                        {/* Specialties Tags */}
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {poojari.specialties.slice(0, 3).map((spec, sIdx) => (
                            <span 
                              key={sIdx} 
                              className="text-[9px] font-bold tracking-wide bg-muted px-2 py-0.5 rounded-full text-muted-foreground border border-border/30"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Step 4: Card Action Buttons */}
                    <div className="border-t border-border/20 px-4 py-3 bg-muted/10 flex flex-wrap gap-2 items-center justify-between">
                      
                      <div className="flex gap-2">
                        {/* Call button */}
                        <Button 
                          size="sm" 
                          variant={activeAction === "call" ? "default" : "outline"}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAction(poojari.id, "call");
                          }}
                          className="h-8 text-xs rounded-lg gap-1 border-border/50"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          <span>{language === "te" ? "కాల్ చేయండి" : "Call Now"}</span>
                        </Button>

                        {/* Chat button */}
                        <Button 
                          size="sm"
                          variant={activeAction === "chat" ? "default" : "outline"}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAction(poojari.id, "chat");
                          }}
                          className="h-8 text-xs rounded-lg gap-1 border-border/50 text-[#25d366] hover:text-[#25d366] hover:bg-[#25d366]/5"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>{language === "te" ? "చాట్" : "Chat"}</span>
                        </Button>
                      </div>

                      {/* Book button */}
                      <Button 
                        size="sm" 
                        variant={activeAction === "book" ? "default" : "outline"}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAction(poojari.id, "book");
                        }}
                        className="h-8 text-xs rounded-lg gap-1 border-border/50"
                      >
                        <Calendar className="h-3.5 w-3.5 text-amber-500" />
                        <span>{language === "te" ? "బుక్ చేయండి" : "Book Now"}</span>
                      </Button>
                    </div>

                    {/* Expanded availableTimings section with final action link */}
                    {activeAction && (
                      <div className="border-t border-border/20 p-4 bg-muted/20 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background/50 border border-border/30 rounded-lg p-2.5">
                          <Clock className="h-3.5 w-3.5 text-[#c8a261]" />
                          <div>
                            <span className="font-semibold text-foreground">Available Hours: </span>
                            {poojari.availableTimings}
                          </div>
                        </div>

                        {/* Rendering final action based on trigger */}
                        {activeAction === "call" && (
                          <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 shadow-md">
                            <a href={`tel:${poojari.phone}`}>
                              <Phone className="h-4 w-4 fill-white" />
                              <span>Dial Phone: {poojari.phone}</span>
                            </a>
                          </Button>
                        )}

                        {activeAction === "chat" && (
                          <Button asChild className="w-full bg-[#25d366] hover:bg-[#20ba5a] text-white rounded-xl gap-2 shadow-md">
                            <a 
                              href={`https://wa.me/91${poojari.phone.replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <MessageCircle className="h-4 w-4 fill-white" />
                              <span>Connect on WhatsApp</span>
                            </a>
                          </Button>
                        )}

                        {activeAction === "book" && (
                          <div className="space-y-3">
                            <p className="text-xs sm:text-sm font-semibold text-center text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 py-2.5 px-3 rounded-xl font-sans">
                              {language === "te" 
                                ? "సమయం మరియు పూజా రుసుము గురించి పూజారితో మాట్లాడండి" 
                                : "Discuss the time slots and rates directly with Pujari"}
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                              <Button 
                                asChild
                                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 shadow-md h-10 text-xs sm:text-sm font-bold"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <a href={`tel:${poojari.phone}`}>
                                  <Phone className="h-4 w-4 fill-white" />
                                  <span>{language === "te" ? "కాల్ చేయండి" : "Call Now"}</span>
                                </a>
                              </Button>
                              <Button 
                                asChild
                                className="bg-[#25d366] hover:bg-[#20ba5a] text-white rounded-xl gap-2 shadow-md h-10 text-xs sm:text-sm font-bold"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <a 
                                  href={`https://wa.me/91${poojari.phone.replace(/[^0-9]/g, "")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <MessageCircle className="h-4 w-4 fill-white" />
                                  <span>{language === "te" ? "మెసేజ్ చేయండి" : "Message Now"}</span>
                                </a>
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
