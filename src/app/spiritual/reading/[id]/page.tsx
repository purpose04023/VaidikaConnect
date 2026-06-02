import { getDeityById, stotramsData } from "@/lib/data/stotrams";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Optional: statically generate these routes since the data is static
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

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      <Button asChild variant="ghost" className="mb-6 -ml-4 text-muted-foreground hover:text-foreground">
        <Link href="/spiritual/reading">
          <ArrowLeft className="mr-2 h-4 w-4" />
          వెనుకకు (Back)
        </Link>
      </Button>

      <div className="text-center mb-10">
        <h1 className="font-headline text-3xl md:text-5xl font-bold text-primary mb-3">
          {deity.name}
        </h1>
        <p className="text-muted-foreground">{deity.nameEn}</p>
      </div>

      <div className="glass-card p-4 md:p-8 rounded-2xl border border-primary/10 shadow-lg">
        <Tabs defaultValue="ashtotharam" className="w-full">
          <div className="flex justify-center mb-8 border-b border-border/40">
            <TabsList className="bg-transparent h-auto p-0 gap-6">
              <TabsTrigger 
                value="ashtotharam" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 font-bold text-lg transition-all"
              >
                అష్టోత్తర శతనామావళి
              </TabsTrigger>
              <TabsTrigger 
                value="sahasranamam" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 font-bold text-lg transition-all"
              >
                సహస్రనామ స్తోత్రం
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="ashtotharam" className="focus:outline-none">
            <div className="prose prose-lg md:prose-xl max-w-none text-foreground leading-loose text-center md:text-left font-serif">
              {deity.ashtotharam.split('\n').map((line, index) => (
                <p key={index} className="my-2">{line}</p>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sahasranamam" className="focus:outline-none">
            <div className="prose prose-lg md:prose-xl max-w-none text-foreground leading-loose text-center md:text-left font-serif">
              {deity.sahasranamam.split('\n').map((line, index) => (
                <p key={index} className="my-2">{line}</p>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
