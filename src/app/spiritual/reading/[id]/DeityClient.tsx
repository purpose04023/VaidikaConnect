"use client";

import React, { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ManagedImage } from "@/components/common/ManagedImage";
import { useContent } from "@/lib/content-store";
import { LiveEditor } from "@/components/common/LiveEditor";
import { useUser } from "@/firebase";
import { isAdminEmail } from "@/lib/admin";
import type { Deity } from "@/lib/data/stotrams";

export function DeityClient({ id, initialDeity }: { id: string; initialDeity: Deity }) {
  const { deities, saveDeity } = useContent();
  const { user } = useUser();
  const isAdmin = isAdminEmail(user?.email);

  // Use live data if available, otherwise fallback to static initial data
  const deity = useMemo(() => {
    return deities.find((d) => d.id === id) || initialDeity;
  }, [deities, id, initialDeity]);

  if (!deity) {
    return <div className="text-center py-20">Deity not found</div>;
  }

  // Format text into premium blocks: double breaks imply a new stanza.
  const renderBlocks = (text: string) => {
    return text.split('\n\n').map((stanza, i) => (
      <div 
        key={i} 
        className="mb-6 p-6 md:p-8 rounded-2xl bg-white/5 dark:bg-black/20 border border-primary/10 shadow-lg backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-white/10 dark:hover:bg-black/30"
      >
        {stanza.split('\n').map((line, j) => (
          <p key={j} className="my-2 text-xl md:text-2xl font-telugu text-foreground/90 font-medium tracking-wide">
            {line.trim()}
          </p>
        ))}
      </div>
    ));
  };

  const handleSaveAshtotharam = async (newValue: string) => {
    await saveDeity({ ...deity, ashtotharam: newValue });
  };

  const handleSaveSahasranamam = async (newValue: string) => {
    await saveDeity({ ...deity, sahasranamam: newValue });
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
      <Button asChild variant="ghost" className="mb-6 -ml-4 text-muted-foreground hover:text-foreground">
        <Link href="/spiritual/reading">
          <ArrowLeft className="mr-2 h-4 w-4" />
          వెనుకకు (Back)
        </Link>
      </Button>

      <div className="flex flex-col items-center text-center mb-10">
        <div className="h-40 w-40 md:h-56 md:w-56 rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl mb-6 relative group">
          <ManagedImage 
            src={deity.imageUrl || "https://placehold.co/400x400/png"}
            alt={deity.nameEn}
            data-ai-hint={deity.imageHint}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
          />
        </div>
        <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold gold-gradient-text mb-4">
          {deity.name}
        </h1>
        <p className="text-muted-foreground text-xl md:text-2xl tracking-widest uppercase">{deity.nameEn}</p>
      </div>

      <div className="glass-card p-4 md:p-10 lg:p-16 rounded-[2.5rem] border border-primary/20 shadow-2xl bg-background/80 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-5 pointer-events-none mix-blend-overlay"></div>
        
        <Tabs defaultValue="ashtotharam" className="w-full relative z-10">
          <div className="flex justify-center mb-12 border-b border-border/40 pb-2 overflow-x-auto">
            <TabsList className="bg-transparent h-auto p-0 flex flex-wrap gap-4 md:gap-10 justify-center">
              <TabsTrigger 
                value="ashtotharam" 
                className="rounded-full px-6 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold text-lg md:text-2xl transition-all duration-300"
              >
                అష్టోత్తర శతనామావళి
              </TabsTrigger>
              <TabsTrigger 
                value="sahasranamam" 
                className="rounded-full px-6 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold text-lg md:text-2xl transition-all duration-300"
              >
                సహస్రనామ స్తోత్రం
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="ashtotharam" className="focus:outline-none min-h-[50vh]">
            <LiveEditor
              value={deity.ashtotharam}
              onSave={handleSaveAshtotharam}
              isAdmin={isAdmin}
              renderContent={renderBlocks}
            />
          </TabsContent>

          <TabsContent value="sahasranamam" className="focus:outline-none min-h-[50vh]">
            <LiveEditor
              value={deity.sahasranamam}
              onSave={handleSaveSahasranamam}
              isAdmin={isAdmin}
              renderContent={renderBlocks}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
