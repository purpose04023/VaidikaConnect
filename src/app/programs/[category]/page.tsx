"use client";

import { PujaListClient } from '@/app/_components/PujaListClient';
import { getPujas } from '@/lib/data';
import { Suspense, useEffect, useState } from 'react';
import type { Puja } from '@/lib/data';
import { useContent } from '@/lib/content-store';
import { useParams, notFound } from 'next/navigation';
import React from 'react';

const categoryMap: Record<string, string> = {
  'deeksha-pujas': 'Deeksha Pujas',
  'dosha-parihara-pujas': 'Dosha Parihara Pujas',
  'homams': 'Homams',
  'kalyanams': 'Kalyanams',
  'nomulu': 'Nomulu',
  'pujas': 'Pujas',
  'vratas': 'Vratas'
};

const titleMap: Record<string, { en: string; te: string }> = {
  'deeksha-pujas': { en: 'Deeksha Pujas', te: 'దీక్ష పూజలు' },
  'dosha-parihara-pujas': { en: 'Dosha Parihara Pujas', te: 'దోష పరిహార పూజలు' },
  'homams': { en: 'Homams', te: 'హోమాలు' },
  'kalyanams': { en: 'Kalyanams', te: 'కళ్యాణములు' },
  'nomulu': { en: 'Nomulu', te: 'నోములు' },
  'pujas': { en: 'Pujas', te: 'పూజలు' },
  'vratas': { en: 'Vratas', te: 'వ్రతాలు' }
};

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  
  if (!categoryMap[categorySlug]) {
    return notFound();
  }

  const [pujas, setPujas] = useState<Puja[]>([]);
  const { pujas: editablePujas } = useContent();

  useEffect(() => {
    async function fetchPujas() {
      const pujasData = await getPujas();
      setPujas(pujasData);
    }
    fetchPujas();
  }, []);

  const targetCategoryEn = categoryMap[categorySlug];
  const allPujas = editablePujas.length ? editablePujas : pujas;
  const filteredPujas = allPujas.filter(p => p.category_en === targetCategoryEn);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-headline text-4xl text-center mb-2 text-primary">
        {titleMap[categorySlug].en}
      </h1>
      <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
        Explore our authentic {titleMap[categorySlug].en}.
      </p>
      <Suspense fallback={<div className="text-center">Loading programs...</div>}>
        <PujaListClient pujas={filteredPujas} />
      </Suspense>
    </div>
  );
}
