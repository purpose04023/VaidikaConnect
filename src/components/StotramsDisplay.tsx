"use client";

import { useState } from "react";
import Link from "next/link";
import { stotramsData, getDeitiesByGender, Deity } from "@/lib/data/stotrams";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import { Flower, Moon, Sparkles } from "lucide-react";
import { ManagedImage } from "./common/ManagedImage";

export default function StotramsDisplay() {
  const { language } = useLanguage();
  const maleDeities = getDeitiesByGender('male');
  const femaleDeities = getDeitiesByGender('female');

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <h1 className="font-headline text-3xl md:text-5xl font-bold gold-gradient-text mb-4">
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
          <TabsList className="bg-background border border-primary/20 backdrop-blur-md p-1 h-auto rounded-full">
            <TabsTrigger 
              value="male" 
              className="rounded-full px-6 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-300 flex items-center gap-2"
            >
              <Moon className="h-4 w-4" />
              <span className="font-semibold text-sm md:text-base">
                {language === 'te' ? 'పురుష మూర్తులు' : 'Male Deities'}
              </span>
            </TabsTrigger>
            <TabsTrigger 
              value="female" 
              className="rounded-full px-6 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-300 flex items-center gap-2"
            >
              <Flower2 className="h-4 w-4 text-rose-500" />
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
    </div>
  );
}

function DeityGrid({ deities, language }: { deities: Deity[], language: string }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {deities.map((deity) => (
        <Link href={`/spiritual/reading/${deity.id}`} key={deity.id}>
          <Card className="glass-card hover:-translate-y-1 transition-all duration-300 h-full flex flex-col items-center justify-center text-center p-6 border border-primary/10 hover:border-primary/30 group relative overflow-hidden cursor-pointer">
            <div className="absolute top-2 right-2 p-2 bg-background/50 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
              <Flower className="h-5 w-5 text-primary" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <CardHeader className="p-0 mb-4 z-10 w-full flex flex-col items-center">
              <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-primary/20 shadow-lg relative group-hover:scale-105 transition-transform duration-300">
                <ManagedImage 
                  src={deity.imageUrl || "https://placehold.co/200x200/png"} 
                  alt={deity.nameEn}
                  data-ai-hint={deity.imageHint}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardTitle className="font-headline text-xl md:text-2xl group-hover:text-primary transition-colors">
                {language === 'te' ? deity.name : deity.nameEn}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 z-10">
              <span className="text-xs font-medium text-muted-foreground bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                {language === 'te' ? 'పఠించండి' : 'Read Now'}
              </span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
