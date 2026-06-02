"use client";

import { useLanguage } from "@/context/language-context";
import { lifeCycleSamskaras, LifeCycleStage, PoojaItem } from "@/lib/data/services";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  Baby, 
  BookOpen, 
  Heart, 
  Sparkles, 
  Flame, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Loader2
} from "lucide-react";

export default function LifeCycleSamskaras() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loadingPoojaId, setLoadingPoojaId] = useState<number | null>(null);

  // Helper to filter poojas by life stage
  const getPoojasByStage = (stage: LifeCycleStage): PoojaItem[] => {
    return lifeCycleSamskaras.filter(pooja => pooja.stage === stage);
  };

  const handleBookPooja = (pooja: PoojaItem) => {
    setLoadingPoojaId(pooja.id);
    // Simulate searching delay for better UX
    setTimeout(() => {
      router.push(`/find-pujari?pujaName=${encodeURIComponent(pooja.nameEn)}&stage=${pooja.stage}`);
    }, 1500);
  };

  const stages: { key: LifeCycleStage; labelTe: string; labelEn: string; icon: any; color: string; descTe: string; descEn: string }[] = [
    {
      key: "prenatal",
      labelTe: "జననానికి ముందు",
      labelEn: "Prenatal Stage",
      icon: Sparkles,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/30",
      descTe: "గర్భస్థ శిశువు మరియు తల్లి ఆరోగ్యం, శ్రేయస్సు కోసం జరిపే పవిత్ర ఆచారాలు.",
      descEn: "Sacred ceremonies performed for the health, intellect, and safety of the unborn child and mother."
    },
    {
      key: "childhood",
      labelTe: "బాల్య దశ",
      labelEn: "Childhood Stage",
      icon: Baby,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/30",
      descTe: "నామకరణము, అన్నప్రాసనము, అక్షరాభ్యాసం లాంటి శిశువు ఎదుగుదల వేడుకలు.",
      descEn: "Naming ceremonies, first solid foods, Mundan, and initiation into school learning."
    },
    {
      key: "youth",
      labelTe: "విద్య & యవ్వనం",
      labelEn: "Youth & Education",
      icon: BookOpen,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
      descTe: "ఆధ్యాత్మిక క్రమశిక్షణ, జంధ్య ధారణ మరియు వేదాధ్యయనం ప్రారంభ సూచికలు.",
      descEn: "Initiation into sacred thread discipline, annual renewal rituals, and graduation ceremonies."
    },
    {
      key: "adulthood",
      labelTe: "గృహస్థాశ్రమం",
      labelEn: "Adulthood & Marriage",
      icon: Heart,
      color: "text-rose-500 bg-rose-500/10 border-rose-500/30",
      descTe: "పవిత్ర వివాహ బంధం మరియు పితృ రుణాలు, దత్తపుత్ర స్వీకరణ క్రతువులు.",
      descEn: "Matrimonial union, welcoming ceremonies, adoption rituals, and maintaining domestic fire offerings."
    },
    {
      key: "general",
      labelTe: "శుభకార్యాలు",
      labelEn: "General & Auspicious",
      icon: Flame,
      color: "text-orange-500 bg-orange-500/10 border-orange-500/30",
      descTe: "కొత్త పనులు ప్రారంభించే ముందు మరియు నిత్య జీవన ప్రశాంతత కోసం చేసే పూజలు.",
      descEn: "Invocations before new business ventures, purifying water rites, and twice-daily fire offerings."
    }
  ];

  const initialStage = searchParams.get('stage') as LifeCycleStage || "prenatal";

  return (
    <div className="w-full py-8 text-left">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="font-headline text-3xl md:text-4xl font-bold gold-gradient-text mb-3">
          {language === "te" ? "జీవిత చక్ర సంస్కారాలు" : "Human Life Cycle Samskaras"}
        </h2>
        <p className="text-muted-foreground text-sm md:text-base">
          {language === "te" 
            ? "మానవుని పుట్టుక నుండి వివాహం వరకు, ఆయురారోగ్యాల కొరకు మన పెద్దలు ఏర్పరచిన షోడశ సంస్కారాల సమగ్ర వేదిక." 
            : "Explore and book ancient Vedic rituals structured across the vital transition phases of the human lifecycle."}
        </p>
      </div>

      <Tabs defaultValue={initialStage} className="w-full">
        {/* Horizontal Timeline Connector Style */}
        <div className="relative mb-12 flex justify-center">
          {/* Background Timeline Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border/40 -translate-y-1/2 hidden md:block max-w-5xl mx-auto z-0" />
          
          <TabsList className="grid grid-cols-2 md:grid-cols-5 h-auto w-full max-w-5xl bg-background/50 border border-primary/20 backdrop-blur-md rounded-xl p-2 relative z-10 gap-2">
            {stages.map((stage) => {
              const Icon = stage.icon;
              return (
                <TabsTrigger 
                  key={stage.key} 
                  value={stage.key}
                  className="flex flex-col md:flex-row items-center gap-2 py-3 rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all duration-300"
                >
                  <div className={`p-1.5 rounded-full border ${stage.color} flex items-center justify-center`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs md:text-sm font-semibold truncate">
                    {language === "te" ? stage.labelTe : stage.labelEn}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Tab Contents */}
        {stages.map((stage) => {
          const poojas = getPoojasByStage(stage.key);

          return (
            <TabsContent key={stage.key} value={stage.key} className="space-y-6 outline-none focus:ring-0 focus:outline-none">
              
              {/* Active Stage Banner Card */}
              <div className="glass-card rounded-xl p-6 mb-8 border border-primary/10 max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className={`p-3 rounded-full border ${stage.color} flex items-center justify-center shrink-0`}>
                  <stage.icon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-headline text-primary">
                    {language === "te" ? stage.labelTe : stage.labelEn}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {language === "te" ? stage.descTe : stage.descEn}
                  </p>
                </div>
              </div>

              {/* Rituals Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {poojas.map((pooja) => (
                  <Card key={pooja.id} className="glass-card border border-primary/10 hover:border-primary/30 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full group relative overflow-hidden">
                    
                    {/* Top highlight bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500/20 via-primary/50 to-amber-500/20" />
                    
                    <CardHeader className="pt-6">
                      <div className="flex justify-between items-start mb-2">
                        <span className="inline-flex items-center gap-1 text-xs text-primary/80 bg-primary/5 border border-primary/20 px-2 py-0.5 rounded-full font-medium">
                          ✦ {language === "te" ? "వైదిక క్రియ" : "Vedic Rite"}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 text-amber-500" />
                          {pooja.duration}
                        </span>
                      </div>
                      <CardTitle className="font-headline text-2xl group-hover:text-primary transition-colors">
                        {language === "te" ? pooja.name : pooja.nameEn}
                      </CardTitle>
                      {language === "te" && (
                        <CardDescription className="text-xs italic text-muted-foreground">
                          {pooja.nameEn}
                        </CardDescription>
                      )}
                    </CardHeader>

                    <CardContent className="flex-grow space-y-4">
                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {language === "te" ? pooja.descriptionTe : pooja.description}
                      </p>
                      
                      {/* Spiritual Significance box */}
                      <div className="text-xs bg-muted/50 border border-border/40 rounded-lg p-3 flex items-start gap-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-foreground block mb-0.5">
                            {language === "te" ? "ఆధ్యాత్మిక ప్రాముఖ్యత:" : "Spiritual Significance:"}
                          </span>
                          <span className="text-muted-foreground">
                            {pooja.significance}
                          </span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-4 border-t border-border/40 mt-auto">
                      <Button 
                        onClick={() => handleBookPooja(pooja)}
                        disabled={loadingPoojaId === pooja.id}
                        className="w-full divine-button group-hover:shadow-lg group-hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                      >
                        {loadingPoojaId === pooja.id ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>{language === "te" ? "దగ్గరలోని పూజారుల కోసం వెతుకుతోంది..." : "Searching poojaris nearby..."}</span>
                          </>
                        ) : (
                          <>
                            <span>{language === "te" ? "ఈ పూజను ఎంచుకోండి" : "Select this program"}</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </>
                        )}
                      </Button>
                    </CardFooter>

                  </Card>
                ))}
              </div>

            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
