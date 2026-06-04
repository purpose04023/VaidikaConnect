"use client";

import { useContent } from "@/lib/content-store";
import { Suspense, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ManagedImage } from "@/components/common/ManagedImage";
import Link from "next/link";


const TEMPLE_LINKS: Record<string, string> = {
  "kanipakam": "https://srikanipakadevasthanam.org/en-in/home",
  "srikalahasti": "https://www.aptemples.org/en-in/temples/SKHTD/aboutTemple",
  "srisailam": "https://www.srisailadevasthanam.org/en-in/home",
  "mahanandi": "https://www.aptemples.org/en-in/temples/SMESD/aboutTemple",
  "kasapuram": "https://www.aptemples.org/en-in/temples/SNASVD/aboutTemple",
  "vijayawada": "https://kanakadurgamma.org/en-in/home",
  "dwaraka-tirumala": "https://www.aptemples.org/en-in/temples/SVSVD/aboutTemple",
  "dwarakatirumala": "https://www.aptemples.org/en-in/temples/SVSVD/aboutTemple",
  "annavaram": "https://www.aptemples.org/en-in/temples/SVVSSD/aboutTemple",
  "simhachalam": "https://www.aptemples.org/en-in/temples/SVLNSD/aboutTemple",
  "kanakamahalakshma": "https://www.aptemples.org/en-in/temples/SKML/aboutTemple",
  "kanakamahalakshmi": "https://www.aptemples.org/en-in/temples/SKML/aboutTemple",
  "penuganchoprolu": "https://www.aptemples.org/en-in/temples/STADPPL/aboutTemple",
  "penuganchiprolu": "https://www.aptemples.org/en-in/temples/STADPPL/aboutTemple",
  "yadagirigutta": "https://yadagiriguttatemple.telangana.gov.in/fservices/index.php",
  "badrachalam": "https://bhadradritemple.telangana.gov.in/fservices/index.php?sid=1",
  "bhadrachalam": "https://bhadradritemple.telangana.gov.in/fservices/index.php?sid=1",
  "vemulawada": "https://vemulawadatemple.telangana.gov.in/fservices/index.php?sid=6"
};

function getTempleLink(temple: { id: string; name: string; booking_link?: string }) {
  const idLower = (temple.id || "").toLowerCase().replace("temple-", "");
  if (TEMPLE_LINKS[idLower]) {
    return TEMPLE_LINKS[idLower];
  }
  
  const nameLower = (temple.name || "").toLowerCase();
  for (const key of Object.keys(TEMPLE_LINKS)) {
    if (nameLower.includes(key)) {
      return TEMPLE_LINKS[key];
    }
  }
  
  return temple.booking_link || `/pilgrimage/darshan/${temple.id}`;
}

function TemplesList() {
  const { temples, regions } = useContent();
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    if (regions.length > 0 && !activeTab) {
      setActiveTab(regions[0].name);
    }
  }, [regions, activeTab]);

  const TempleGrid = ({ regionName }: { regionName: string }) => {
    const list = temples.filter(t => t.state === regionName);
    if (list.length === 0) {
      return <div className="text-center p-8 text-muted-foreground bg-muted/20 rounded-xl border border-border/50">No temples available for this region yet.</div>;
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {list.map(temple => {
          const externalLink = getTempleLink(temple);
          return (
            <Card key={temple.id} className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col group border border-border/50 rounded-2xl bg-card">
              <a 
                href={externalLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block flex-grow flex flex-col cursor-pointer"
              >
                <CardHeader className="p-0 overflow-hidden">
                  <ManagedImage
                    src={temple.image}
                    alt={temple.name}
                    width={600}
                    height={400}
                    className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </CardHeader>
                <CardContent className="p-4 flex-grow flex flex-col text-left">
                  <CardTitle className="font-headline text-base mb-0 group-hover:text-primary transition-colors duration-200 break-words whitespace-normal leading-snug">
                    {temple.name}
                  </CardTitle>
                </CardContent>
              </a>
              <CardFooter className="pt-0 pb-4 px-4">
                <Button asChild className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold shadow-md divine-button h-auto cursor-pointer">
                  <a href={externalLink} target="_blank" rel="noopener noreferrer">
                    View Details & Book
                  </a>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-headline text-4xl text-center mb-2 text-primary">
        Temple Darshanam Tickets
      </h1>
      <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
        Book your spiritual visit and Special Entry Darshan for the most powerful temples across various regions.
      </p>

      {regions.length > 0 ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="flex flex-wrap h-auto justify-center">
              {regions.map((region) => (
                <TabsTrigger key={region.id} value={region.name} className="text-base py-2 px-6">
                  {region.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {regions.map((region) => (
            <TabsContent key={region.id} value={region.name}>
              <TempleGrid regionName={region.name} />
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="text-center p-8 text-muted-foreground bg-muted/20 rounded-xl border border-border/50 max-w-xl mx-auto">
          No regions configured yet. Please check back later.
        </div>
      )}
    </div>
  );
}

export default function TempleDarshanPage() {
  return (
    <Suspense fallback={<div className="h-40 flex items-center justify-center">Loading temples...</div>}>
      <TemplesList />
    </Suspense>
  );
}
