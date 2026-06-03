"use client";

import { useContent } from "@/lib/content-store";
import { useLanguage } from "@/context/language-context";
import { useParams, useRouter } from "next/navigation";
import React, { useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ManagedImage } from "@/components/common/ManagedImage";
import { defaultPujas } from "@/lib/data";
import { 
  ArrowLeft, 
  Calendar, 
  Check, 
  BookOpen, 
  FileText, 
  Download, 
  ChevronRight, 
  Clock, 
  Sparkles,
  ListTodo
} from "lucide-react";

export default function ProgramDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { language, t } = useLanguage();
  const { pujas: dbPujas } = useContent();

  const slug = params.slug as string;

  const categoryMap: Record<string, string> = {
    'deeksha-pujas': 'Deeksha Pujas',
    'dosha-parihara-pujas': 'Dosha Parihara Pujas',
    'homams': 'Homams',
    'kalyanams': 'Kalyanams',
    'nomulu': 'Nomulu',
    'pujas': 'Pujas',
    'vratas': 'Vratas'
  };

  const isCategorySlug = categoryMap[slug];

  React.useEffect(() => {
    if (isCategorySlug) {
      router.replace(`/programs?category=VAIDIKA_POOJA&subcategory=${encodeURIComponent(categoryMap[slug])}`);
    }
  }, [isCategorySlug, slug, router]);

  // Fallback to defaultPujas if dbPujas is empty (ensures details work even if db is empty)
  const pujas = useMemo(() => {
    return dbPujas.length ? dbPujas : defaultPujas;
  }, [dbPujas]);

  // Resolve Puja by slugified name_en or numerical id
  const puja = useMemo(() => {
    return (
      pujas.find((p) => p.name_en.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug) ||
      pujas.find((p) => p.id.toString() === slug)
    );
  }, [pujas, slug]);

  if (isCategorySlug) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 divine-bg">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading category...</p>
        </div>
      </div>
    );
  }

  if (!puja) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 divine-bg">
        <div className="text-center max-w-md">
          <h1 className="font-headline text-3xl text-primary mb-4">🙏 Program Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The sacred ceremony you are looking for is not listed or has been modified.
          </p>
          <Button asChild className="divine-button">
            <Link href="/programs">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Programs
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const title = language === "te" ? puja.name : puja.name_en;
  const description = language === "te" ? puja.description_te : puja.description;
  const mainCategory = language === "te" ? puja.category : puja.category_en;

  return (
    <div className="min-h-screen pb-20 bg-background text-foreground">
      {/* Back button header */}
      <div className="container mx-auto px-4 pt-6">
        <Button 
          variant="ghost" 
          onClick={() => router.back()} 
          className="hover:bg-primary/10 text-muted-foreground hover:text-primary gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{language === "te" ? "వెనుకకు" : "Back"}</span>
        </Button>
      </div>

      {/* Hero Banner Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="glass-card border border-border/50 rounded-3xl overflow-hidden shadow-xl grid md:grid-cols-[1fr_400px] gap-8 p-6 md:p-8 divine-bg relative">
          <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
            <span className="absolute top-4 left-[2%] text-primary/3 text-[180px] font-serif leading-none">ॐ</span>
            <span className="absolute bottom-0 right-[2%] text-primary/3 text-[140px] font-serif leading-none">ॐ</span>
          </div>

          <div className="flex flex-col justify-center space-y-6 relative z-10 text-left">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/25 font-semibold text-xs py-1 px-3 rounded-full">
                {mainCategory}
              </Badge>
              {(puja.categories || []).map((cat) => (
                <Badge key={cat} variant="secondary" className="font-semibold text-xs py-1 px-3 rounded-full">
                  {cat}
                </Badge>
              ))}
            </div>

            <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold gold-gradient-text break-words whitespace-normal leading-relaxed">
              {title}
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed break-words whitespace-normal leading-relaxed">
              {description}
            </p>

            <div className="flex flex-wrap gap-6 pt-4 border-t border-border/20 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-5 w-5 text-primary" />
                <span>Available Daily Slots</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Sparkles className="h-5 w-5 text-primary" />
                <span>Authorized Vedic Priests</span>
              </div>
            </div>
          </div>

          <div className="h-64 md:h-full min-h-[250px] w-full rounded-2xl overflow-hidden border border-primary/20 shadow-md relative group bg-muted">
            <ManagedImage 
              src={puja.image} 
              alt={puja.name_en} 
              width={800} 
              height={500}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              data-ai-hint={puja.imageHint}
            />
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          
          {/* Left Column: Samagri & Slokas & PDF Embed */}
          <div className="space-y-8 text-left">
            
            {/* 1. Required Items (Samagri) Section */}
            <Card className="border border-border/50 rounded-2xl bg-card/45 backdrop-blur-md shadow-sm overflow-hidden">
              <CardHeader className="border-b border-border/20 p-5 bg-muted/10">
                <CardTitle className="font-headline text-xl text-primary font-bold flex items-center gap-2">
                  <ListTodo className="h-5 w-5 text-primary" />
                  <span>{language === "te" ? "పూజా సామాగ్రి (Samagri)" : "Pooja Samagri (Compulsory Items)"}</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6">
                {puja.required_items && puja.required_items.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-3.5">
                    {puja.required_items.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center gap-3 p-3 rounded-xl border border-border/40 hover:bg-muted/40 transition-colors"
                      >
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-sm font-medium leading-relaxed break-words whitespace-normal">{item}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="italic text-sm">
                      {language === "te" 
                        ? "ఈ పూజ కొరకు సామాగ్రి జాబితా త్వరలోనే జోడించబడుతుంది." 
                        : "Standard puja samagri list will be provided by your assigned priest."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 2. Sacred Chants (Slokas & Stotrams) Section */}
            <Card className="border border-border/50 rounded-2xl bg-card/45 backdrop-blur-md shadow-sm overflow-hidden">
              <CardHeader className="border-b border-border/20 p-5 bg-muted/10">
                <CardTitle className="font-headline text-xl text-primary font-bold flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span>{language === "te" ? "దేవతా స్తోత్రములు & పారాయణలు" : "Sacred Chants & Readings"}</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6">
                {puja.sloka_tags && puja.sloka_tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2.5">
                    {puja.sloka_tags.map((sloka, idx) => {
                      // Extract the slug from relative path like /readings/ganapati-prarthana -> ganapati-prarthana
                      const slokaSlug = sloka.link.split("/").pop() || "unknown";
                      return (
                        <Link key={idx} href={`/readings/${slokaSlug}`}>
                          <Button 
                            variant="outline" 
                            className="bg-background border-border/60 hover:border-amber-500/40 hover:bg-amber-500/10 text-xs py-4 px-4 rounded-xl gap-2 font-bold transition-all shadow-sm shrink-0"
                          >
                            <FileText className="h-3.5 w-3.5 text-primary" />
                            <span>{sloka.name}</span>
                            <ChevronRight className="h-3 w-3 text-muted-foreground" />
                          </Button>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="italic text-sm">
                      {language === "te" 
                        ? "ఈ పూజ కొరకు అనుబంధ స్తోత్రములు త్వరలోనే జోడించబడతాయి." 
                        : "No specific sloka attachments are currently mapped to this program."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 3. Pooja Vidhanam (PDF Viewer) Section */}
            {puja.pdf_url && (
              <Card className="border border-border/50 rounded-2xl bg-card/45 backdrop-blur-md shadow-sm overflow-hidden">
                <CardHeader className="border-b border-border/20 p-5 bg-muted/10 flex flex-row items-center justify-between">
                  <CardTitle className="font-headline text-xl text-primary font-bold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span>{language === "te" ? "పూజా విధానము గ్రంథం (PDF)" : "Pooja Vidhanam Guide (PDF)"}</span>
                  </CardTitle>
                  
                  <Button asChild size="sm" variant="outline" className="border-border/60 rounded-xl">
                    <a href={puja.pdf_url} target="_blank" rel="noopener noreferrer" download>
                      <Download className="mr-1 h-3.5 w-3.5" />
                      <span>{language === "te" ? "డౌన్లోడ్" : "Download"}</span>
                    </a>
                  </Button>
                </CardHeader>
                
                <CardContent className="p-5">
                  <div className="w-full aspect-[4/3] min-h-[350px] sm:min-h-[450px] rounded-xl overflow-hidden border border-border/60 shadow-inner bg-muted relative">
                    <iframe 
                      src={`${puja.pdf_url}#toolbar=0`} 
                      className="w-full h-full border-0 rounded-xl"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

          </div>

          {/* Right Column: Sticky Pricing & Booking Card */}
          <div className="space-y-6">
            <Card className="border border-border/50 rounded-3xl bg-card/60 backdrop-blur-md shadow-lg overflow-hidden sticky top-6 text-left">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white relative">
                <div className="pointer-events-none absolute inset-0 overflow-hidden select-none opacity-20">
                  <span className="absolute bottom-[-20px] right-[-10px] text-[120px] font-serif leading-none">ॐ</span>
                </div>
                <div className="relative z-10">
                  <p className="text-xs uppercase tracking-widest font-bold text-amber-100 flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-100 fill-amber-100" />
                    <span>VaidikaConnect Authorized</span>
                  </p>
                  <h3 className="font-headline text-2xl font-bold">{language === "te" ? "పూజా బుకింగ్" : "Ritual Ceremony"}</h3>
                </div>
              </div>

              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Estimated Base Price</p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-headline text-3xl font-extrabold text-foreground">₹6,500</span>
                    <span className="text-xs text-muted-foreground">/ Ceremony</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    * Final Dakshina and Samagri costs may vary slightly based on priest selection.
                  </p>
                </div>

                <div className="border-t border-border/20 pt-5 space-y-4 text-sm font-medium">
                  <div className="flex items-center justify-between text-muted-foreground border-b border-border/10 pb-3">
                    <span>Duration</span>
                    <span className="text-foreground">2.5 - 3.5 Hours</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground border-b border-border/10 pb-3">
                    <span>Priest Placement</span>
                    <span className="text-foreground">Regional Guntur</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground pb-1">
                    <span>Verification status</span>
                    <span className="text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded font-bold text-xs uppercase">Verified</span>
                  </div>
                </div>

                <Button 
                  asChild
                  size="lg" 
                  className="w-full divine-button py-6 rounded-xl font-bold shadow-md text-base"
                >
                  <Link href={`/find-pujari?puja=${puja.id}`}>
                    <Calendar className="mr-2 h-5 w-5" />
                    <span>{language === "te" ? "వైదిక పండితుని ఎంచుకోండి" : "Select Priest & Book"}</span>
                  </Link>
                </Button>

                <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
                  By clicking select, you will be taken to our location discovery map to choose a qualified Poojari in Guntur.
                </p>
              </CardContent>
            </Card>
          </div>

        </div>
      </section>
    </div>
  );
}
