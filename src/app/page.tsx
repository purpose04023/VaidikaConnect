"use client";

import { PujaListClient } from './_components/PujaListClient';
import { getPujas } from '@/lib/data';
import { Suspense, useEffect, useState } from 'react';
import type { Puja } from '@/lib/data';
import { useLanguage } from '@/context/language-context';

export default function Home() {
  const [pujas, setPujas] = useState<Puja[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    async function fetchPujas() {
      const pujasData = await getPujas();
      setPujas(pujasData);
    }
    fetchPujas();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="font-headline text-4xl text-center mb-2 text-primary">
        {t('home.title')}
      </h2>
      <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
        {t('home.subtitle')}
      </p>
      <Suspense fallback={<div className="text-center">Loading programs...</div>}>
        <PujaListClient pujas={pujas} />
      </Suspense>
    </div>
  );
}
