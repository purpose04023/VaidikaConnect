"use client";

import { useContent } from "@/lib/content-store";
import { Suspense, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ManagedImage } from "@/components/common/ManagedImage";
import Link from "next/link";


function TemplesList() {
  const { temples, regions } = useContent();
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    if (regions.length > 0 && !activeTab) {
      setActiveTab(regions[0].name);
    }
  }, [regions, activeTab]);

  const TempleGrid = ({ regionName }: { regionName: string }) => {
    const list = temples.filter(t => t.state === regionName && t.id !== "temple-vijayawada");
    if (list.length === 0) {
      return <div className="text-center p-8 text-muted-foreground bg-muted/20 rounded-xl border border-border/50">No temples available for this region yet.</div>;
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {list.map(temple => (
          <Card key={temple.id} className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col group border border-border/50 rounded-2xl bg-card">
            <Link href={`/pilgrimage/darshan/${temple.id}`} className="block flex-grow flex flex-col">
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
            </Link>
            <CardFooter className="pt-0 pb-4 px-4">
              <Button asChild className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold shadow-md divine-button h-auto">
                <Link href={`/pilgrimage/darshan/${temple.id}`}>
                  View Details & Book
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
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
