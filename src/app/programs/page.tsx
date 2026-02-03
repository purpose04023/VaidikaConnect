"use client";

import { PujaListClient } from '@/app/_components/PujaListClient';
import { getPujas } from '@/lib/data';
import { Suspense, useEffect, useState } from 'react';
import type { Puja } from '@/lib/data';

export default function ProgramsPage() {
  const [pujas, setPujas] = useState<Puja[]>([]);

  useEffect(() => {
    async function fetchPujas() {
      const pujasData = await getPujas();
      setPujas(pujasData);
    }
    fetchPujas();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-headline text-4xl text-center mb-2 text-primary">
        Explore Our Sacred Programs
      </h1>
      <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
        Search and select from our comprehensive list of authentic Vedic rituals.
      </p>
      <Suspense fallback={<div className="text-center">Loading programs...</div>}>
        <PujaListClient pujas={pujas} />
      </Suspense>
    </div>
  );
}
