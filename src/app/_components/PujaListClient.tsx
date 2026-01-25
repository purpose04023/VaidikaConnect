"use client";

import type { Puja } from "@/lib/data";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function PujaListClient({ pujas }: { pujas: Puja[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPuja, setSelectedPuja] = useState<Puja | null>(null);
  const [participants, setParticipants] = useState("5");
  const router = useRouter();

  const filteredPujas = pujas.filter(puja =>
    puja.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    puja.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFindPujaris = () => {
    if (selectedPuja) {
      router.push(`/find-pujari?puja=${selectedPuja.id}&participants=${participants}`);
    }
  };

  return (
    <div>
      <div className="relative mb-8 max-w-xl mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by puja name, festival, or keyword..."
          className="pl-10 h-12 text-lg rounded-full shadow-inner bg-card"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPujas.map(puja => (
          <Card key={puja.id} className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col">
            <CardHeader className="p-0">
              <Image
                src={puja.image}
                alt={puja.name}
                width={600}
                height={400}
                className="w-full h-48 object-cover"
                data-ai-hint={puja.imageHint}
              />
            </CardHeader>
            <CardContent className="p-6 flex-grow">
              <CardTitle className="font-headline text-2xl mb-2">{puja.name}</CardTitle>
              <p className="text-muted-foreground">{puja.description}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => setSelectedPuja(puja)}>
                Select Program
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedPuja} onOpenChange={() => setSelectedPuja(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">Confirm Details for {selectedPuja?.name}</DialogTitle>
            <DialogDescription>
              Please specify the number of participants to find eligible Pujaris.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="participants" className="text-right">
                Participants
              </Label>
              <Input
                id="participants"
                type="number"
                value={participants}
                onChange={e => setParticipants(e.target.value)}
                className="col-span-3"
                min="1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedPuja(null)}>Cancel</Button>
            <Button onClick={handleFindPujaris}>Find Pujaris</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
