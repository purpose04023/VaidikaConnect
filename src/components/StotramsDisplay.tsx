"use client";

import { useState } from "react";
import Link from "next/link";
import { stotramsData, getDeitiesByGender, Deity } from "@/lib/data/stotrams";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import { Flower, Moon, Sparkles } from "lucide-react";
import { ManagedImage } from "./common/ManagedImage";
import { CategoryBrowser } from "./spiritual/CategoryBrowser";

export default function StotramsDisplay() {
  const { language } = useLanguage();
  const maleDeities = getDeitiesByGender('male');
  const femaleDeities = getDeitiesByGender('female');

  return (
    <div className="w-full">
      <div className="text-center mb-10 md:mb-16">
        <h1 className="font-headline text-3xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-4 md:mb-6">
          {language === 'te' ? 'అష్టోత్తరాలు & సహస్రనామాలు' : 'Ashtotharam & Sahasranamam'}
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
          {language === 'te' 
            ? 'సమస్త దేవతల పవిత్ర అష్టోత్తర శతనామావళి మరియు సహస్రనామ స్తోత్రాల పఠనం.'
            : 'Read the sacred 108 and 1000 names of Hindu Deities.'}
        </p>
      </div>

      <Tabs defaultValue="male" className="w-full">
        <div className="flex justify-center mb-12">
          <TabsList className="bg-muted p-1 h-auto rounded-full">
            <TabsTrigger 
              value="male" 
              className="rounded-full px-6 py-3 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-300 flex items-center gap-2"
            >
              <Moon className="h-4 w-4" />
              <span className="font-semibold text-sm md:text-base">
                {language === 'te' ? 'పురుష మూర్తులు' : 'Male Deities'}
              </span>
            </TabsTrigger>
            <TabsTrigger 
              value="female" 
              className="rounded-full px-6 py-3 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-300 flex items-center gap-2"
            >
              <Flower className="h-4 w-4 text-rose-500" />
              <span className="font-semibold text-sm md:text-base">
                {language === 'te' ? 'స్త్రీ మూర్తులు' : 'Female Goddesses'}
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="male" className="focus:outline-none">
          <DeityGrid deities={maleDeities} language={language} />
        </TabsContent>

        <TabsContent value="female" className="focus:outline-none">
          <DeityGrid deities={femaleDeities} language={language} />
        </TabsContent>
      </Tabs>

      <div className="mt-20 lg:mt-32">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-headline text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {language === 'te' ? 'సంపూర్ణ స్తోత్ర గ్రంథాలయం' : 'Comprehensive Stotram Library'}
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            {language === 'te' 
              ? 'విజ్ఞానం.ఆర్గ్ సౌజన్యంతో వేలాది స్తోత్రాలు, మంత్రాలు, మరియు ఉపనిషత్తుల సేకరణ.'
              : 'Explore thousands of sacred texts, mantras, and upanishads, courtesy of Vignanam.org.'}
          </p>
        </div>
        <CategoryBrowser />
      </div>
    </div>
  );
}

function DeityGrid({ deities, language }: { deities: Deity[], language: string }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
      {deities.map((deity) => (
        <Link href={`/spiritual/reading/${deity.id}`} key={deity.id}>
          <Card className="bg-card hover:-translate-y-1 hover:shadow-lg transition-all duration-300 h-full flex flex-col items-center justify-center text-center p-6 border border-border group relative overflow-hidden cursor-pointer rounded-2xl">
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Flower className="h-4 w-4 text-muted-foreground" />
            </div>
            
            <CardHeader className="p-0 mb-4 z-10 w-full flex flex-col items-center">
              <div className="h-24 w-24 md:h-32 md:w-32 lg:h-40 lg:w-40 rounded-full overflow-hidden border border-border shadow-sm relative group-hover:scale-105 transition-transform duration-300 bg-muted">
                <ManagedImage 
                  src={deity.imageUrl || "https://placehold.co/400x400/png"} 
                  alt={deity.nameEn}
                  data-ai-hint={deity.imageHint}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardTitle className="font-headline text-lg md:text-xl lg:text-2xl mt-4 group-hover:text-primary transition-colors">
                {language === 'te' ? deity.name : deity.nameEn}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 z-10 mt-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {language === 'te' ? 'పఠించండి' : 'Read Now'}
              </span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
