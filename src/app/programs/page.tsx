"use client";

import { PujaListClient } from '@/app/_components/PujaListClient';
import { getPujas } from '@/lib/data';
import { Suspense, useEffect, useState } from 'react';
import type { Puja } from '@/lib/data';
import { useContent } from '@/lib/content-store';
import { useSearchParams } from 'next/navigation';

function ProgramsPageContent() {
  const [pujas, setPujas] = useState<Puja[]>([]);
  const { pujas: editablePujas } = useContent();
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  useEffect(() => {
    async function fetchPujas() {
      const pujasData = await getPujas();
      setPujas(pujasData);
    }
    fetchPujas();
  }, []);

  const title = category === 'LIFE_CYCLE_POOJA' ? 'Life Cycle Poojas' : (category === 'VAIDIKA_POOJA' ? 'Vaidika Poojas' : 'Explore Our Sacred Programs');
  
  const allPujas = editablePujas.length ? editablePujas : pujas;
  const filteredPujas = allPujas.filter(p => {
    if (category) {
      return p.program_type === category;
    }
    // Default if no category is specified (optional behavior)
    return !p.program_type || p.program_type === 'VAIDIKA_POOJA';
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-headline text-4xl text-center mb-2 text-primary">
        {title}
      </h1>
      <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
        Search and select from our comprehensive list of authentic Vedic rituals.
      </p>
      <PujaListClient pujas={filteredPujas} />
    </div>
  );
}

export default function ProgramsPage() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading programs...</div>}>
      <ProgramsPageContent />
    </Suspense>
  );
}

