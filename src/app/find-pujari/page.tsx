import { Suspense } from "react";
import { getPujaris, getPujaById } from "@/lib/data";
import { recommendPujari } from "@/ai/flows/pujari-recommendation";
import { PujariDiscoveryClient } from "./_components/PujariDiscoveryClient";

export default async function FindPujariPage({
  searchParams,
}: {
  searchParams: Promise<{ puja?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const pujaId = resolvedSearchParams.puja ? parseInt(resolvedSearchParams.puja) : undefined;

  if (pujaId === undefined) {
    return <div className="text-center py-10">Please select a puja first.</div>;
  }

  const allPujaris = await getPujaris();
  const puja = await getPujaById(pujaId);

  const eligiblePujaris = allPujaris.filter(pujari => pujari.pujas.includes(pujaId));

  const recommendationInput = {
    userPreferences: `User is looking for a pujari for ${puja?.name || 'a puja'}. Key considerations are experience and high ratings.`,
    similarUserProfiles: 'Similar users often value pujaris who are fluent in English and have experience with family-oriented ceremonies. They also prefer transparent pricing.'
  };

  let recommendation = "Browse the available verified pujaris below and choose the profile that best fits your ceremony needs.";

  try {
    const recommendationResult = await recommendPujari(recommendationInput);
    recommendation = recommendationResult.pujariRecommendations;
  } catch (error) {
    console.warn("Pujari recommendation unavailable, using fallback copy.", error);
  }

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
          recommendation={recommendation}
          pujaId={pujaId}
        />
      </Suspense>
    </div>
  );
}
