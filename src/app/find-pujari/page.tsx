import { Suspense } from "react";
import { getLivePujaris, getLivePujaById } from "@/lib/server-data";
import { PujariDiscoveryClient } from "@/features/pujari/components/PujariDiscoveryClient";

export default async function FindPujariPage({
  searchParams,
}: {
  searchParams: Promise<{ puja?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const pujaId = resolvedSearchParams.puja || undefined;

  if (pujaId === undefined) {
    return <div className="text-center py-10">Please select a puja first.</div>;
  }

  const allPujaris = await getLivePujaris();
  const puja = await getLivePujaById(pujaId);

  const eligiblePujaris = allPujaris.filter(pujari => pujari.pujas.includes(pujaId));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-headline text-3xl text-center mb-2">
        Available Pujaris for {puja?.name}
      </h1>
      <p className="text-center text-muted-foreground mb-8">
        Click a marker or card to learn more.
      </p>
      <Suspense fallback={<div className="text-center">Loading Pujaris...</div>}>
        <PujariDiscoveryClient 
          pujaris={eligiblePujaris} 
          pujaId={pujaId}
        />
      </Suspense>
    </div>
  );
}
