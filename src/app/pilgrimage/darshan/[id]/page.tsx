"use client";

import { useContent } from "@/lib/content-store";
import { Suspense, useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { ManagedImage } from "@/components/common/ManagedImage";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Ticket } from "lucide-react";
import type { Temple } from "@/lib/data";

function TempleDetailContent() {
  const params = useParams();
  const id = params.id as string;
  const { temples } = useContent();
  const [temple, setTemple] = useState<Temple | null>(null);

  useEffect(() => {
    if (temples && temples.length > 0) {
      const found = temples.find(t => t.id === id);
      if (found) {
        setTemple(found);
      } else {
        // Just setting null will trigger the fallback check
        setTemple(null);
      }
    }
  }, [temples, id]);

  if (!temples || temples.length === 0) {
    return <div className="h-40 flex items-center justify-center">Loading temple details...</div>;
  }

  if (!temple) {
    return notFound();
  }

  return (
    <div className="min-h-screen pb-24 relative">
      {/* Banner Section */}
      <div className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden">
        <ManagedImage
          src={temple.banner_image || temple.image}
          alt={temple.name}
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <h1 className="font-headline text-3xl md:text-5xl lg:text-6xl text-white mb-4 drop-shadow-lg">
              {temple.name}
            </h1>
            <div className="flex items-center text-white/90 gap-2 text-lg md:text-xl drop-shadow-md">
              <MapPin className="h-5 w-5" />
              <span>{temple.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-12">
        {/* History / Description */}
        <section>
          <h2 className="font-headline text-3xl text-primary mb-6 flex items-center gap-3">
            <span className="w-8 h-1 bg-primary rounded-full"></span>
            History & Significance
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {temple.description}
          </div>
        </section>

        {/* Contact Details */}
        <section className="bg-muted/30 border border-border/50 rounded-2xl p-8">
          <h2 className="font-headline text-2xl text-primary mb-4 flex items-center gap-2">
            <Phone className="h-6 w-6" />
            Contact Information
          </h2>
          <div className="whitespace-pre-wrap text-muted-foreground text-lg">
            {temple.contact || "No contact information provided."}
          </div>
        </section>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-xl border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50">
        <div className="container mx-auto max-w-4xl flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <p className="font-semibold text-lg">{temple.name}</p>
            <p className="text-sm text-muted-foreground">Official Darshan & Seva Booking</p>
          </div>
          <Button asChild size="lg" className="w-full sm:w-auto text-lg h-14 px-8 font-bold divine-button shadow-xl">
            <a href={temple.booking_link} target="_blank" rel="noopener noreferrer">
              <Ticket className="mr-2 h-5 w-5" />
              Book Tickets Official
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function TempleDetailPage() {
  return (
    <Suspense fallback={<div className="h-40 flex items-center justify-center">Loading...</div>}>
      <TempleDetailContent />
    </Suspense>
  );
}
