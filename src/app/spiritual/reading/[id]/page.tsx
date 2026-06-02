import { getDeityById, stotramsData } from "@/lib/data/stotrams";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ManagedImage } from "@/components/common/ManagedImage";

export function generateStaticParams() {
  return stotramsData.map((deity) => ({
    id: deity.id,
  }));
}

export default async function DeityStotramPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deity = getDeityById(id);

  if (!deity) {
    notFound();
  }

  // Format text into stanzas: double breaks imply a new stanza.
  const formatText = (text: string) => {
    return text.split('\n\n').map((stanza, i) => (
      <div key={i} className="mb-8">
        {stanza.split('\n').map((line, j) => (
          <p key={j} className="my-2">{line.trim()}</p>
        ))}
      </div>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
      <Button asChild variant="ghost" className="mb-6 -ml-4 text-muted-foreground hover:text-foreground">
        <Link href="/spiritual/reading">
          <ArrowLeft className="mr-2 h-4 w-4" />
          వెనుకకు (Back)
        </Link>
      </Button>

      <div className="flex flex-col items-center text-center mb-10">
        <div className="h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl mb-6 relative">
          <ManagedImage 
            src={deity.imageUrl}
            alt={deity.nameEn}
            imageHint={deity.imageHint}
            className="object-cover w-full h-full"
          />
        </div>
        <h1 className="font-headline text-3xl md:text-5xl lg:text-6xl font-bold gold-gradient-text mb-4">
          {deity.name}
        </h1>
        <p className="text-muted-foreground text-lg tracking-widest uppercase">{deity.nameEn}</p>
      </div>

      <div className="glass-card p-4 md:p-10 lg:p-16 rounded-3xl border border-primary/20 shadow-2xl bg-background/80 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-5 pointer-events-none mix-blend-overlay rounded-3xl"></div>
        
        <Tabs defaultValue="ashtotharam" className="w-full relative z-10">
          <div className="flex justify-center mb-12 border-b border-border/40 pb-2">
            <TabsList className="bg-transparent h-auto p-0 gap-4 md:gap-10">
              <TabsTrigger 
                value="ashtotharam" 
                className="rounded-full px-6 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold text-lg md:text-xl transition-all duration-300"
              >
                అష్టోత్తర శతనామావళి
              </TabsTrigger>
              <TabsTrigger 
                value="sahasranamam" 
                className="rounded-full px-6 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold text-lg md:text-xl transition-all duration-300"
              >
                సహస్రనామ స్తోత్రం
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="ashtotharam" className="focus:outline-none min-h-[50vh]">
            <div className="prose prose-xl md:prose-2xl max-w-none text-foreground leading-loose text-center font-serif font-medium">
              {formatText(deity.ashtotharam)}
            </div>
          </TabsContent>

          <TabsContent value="sahasranamam" className="focus:outline-none min-h-[50vh]">
            <div className="prose prose-xl md:prose-2xl max-w-none text-foreground leading-loose text-center font-serif font-medium">
              {formatText(deity.sahasranamam)}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
