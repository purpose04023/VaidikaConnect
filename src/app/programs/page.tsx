"use client";

import { PujaListClient } from '@/features/pooja/components/PujaListClient';
import { getPujas } from '@/lib/data';
import { Suspense, useEffect, useState } from 'react';
import type { Puja } from '@/lib/data';
import { useContent } from '@/lib/content-store';
import { useSearchParams } from 'next/navigation';
import { CustomPoojaForm } from '@/features/pooja/components/custom-pooja-form';

function ProgramsPageContent() {
  const [pujas, setPujas] = useState<Puja[]>([]);
  const { pujas: editablePujas } = useContent();
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const stage = searchParams.get('stage');

  useEffect(() => {
    async function fetchPujas() {
      const pujasData = await getPujas();
      setPujas(pujasData);
    }
    fetchPujas();
  }, []);

  const title = category === 'LIFE_CYCLE_POOJA' || category === 'Life Cycle Poojas' 
    ? 'Life Cycle Poojas' 
    : (category === 'VAIDIKA_POOJA' || category === 'Vaidika Poojas' ? 'Vaidika Poojas' : 'Explore Our Sacred Programs');
  
  const allPujas = editablePujas.length ? editablePujas : pujas;
  const filteredPujas = allPujas.filter(p => {
    const categoriesToCheck: string[] = [];
    
    // Support category mapping
    if (category) {
      if (category === 'VAIDIKA_POOJA' || category === 'Vaidika Poojas') {
        categoriesToCheck.push('Vaidika Poojas');
      } else if (category === 'LIFE_CYCLE_POOJA' || category === 'Life Cycle Poojas') {
        categoriesToCheck.push('Life Cycle Poojas');
      }
    }
    
    // Support stage mapping
    if (stage) {
      const stageLower = stage.toLowerCase();
      if (stageLower === 'prenatal') categoriesToCheck.push('Prenatal');
      else if (stageLower === 'childhood') categoriesToCheck.push('Childhood');
      else if (stageLower === 'youth' || stageLower === 'youth and education') categoriesToCheck.push('Youth and Education');
      else if (stageLower === 'adulthood') categoriesToCheck.push('Adulthood');
      else if (stageLower === 'general' || stageLower === 'general or auspicious') categoriesToCheck.push('General or Auspicious');
    }

    if (categoriesToCheck.length === 0) {
      // Default to Vaidika Poojas if no filters are specified
      if (p.categories && p.categories.length > 0) {
        return p.categories.includes('Vaidika Poojas');
      }
      return !p.program_type || p.program_type === 'VAIDIKA_POOJA';
    }

    // If categories array is populated, check it
    if (p.categories && p.categories.length > 0) {
      return categoriesToCheck.every(cat => p.categories?.includes(cat));
    }

    // Otherwise, fall back to checking legacy program_type / category_en (for default data)
    return categoriesToCheck.every(cat => {
      if (cat === 'Vaidika Poojas') {
        return !p.program_type || p.program_type === 'VAIDIKA_POOJA';
      }
      if (cat === 'Life Cycle Poojas') {
        return p.program_type === 'LIFE_CYCLE_POOJA';
      }
      // For stages, check category_en
      let normalizedCat = cat;
      if (cat === 'Youth and Education') normalizedCat = 'Youth & Education';
      if (cat === 'General or Auspicious') normalizedCat = 'General / Auspicious';
      return p.category_en === normalizedCat;
    });
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-16">
      <div>
        <h1 className="font-headline text-4xl text-center mb-2 text-primary">
          {title}
        </h1>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Search and select from our comprehensive list of authentic Vedic rituals.
        </p>
        <PujaListClient pujas={filteredPujas} />
      </div>

      <div id="custom-pooja-form-section" className="border-t border-border/40 pt-16 text-center scroll-mt-24">
        <h2 className="font-headline text-3xl mb-3 text-primary">Can't find your Pooja?</h2>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto text-base">
          Describe it below — any regional name, any language. We'll match you with the right pandit.
        </p>
        <CustomPoojaForm />
      </div>
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

