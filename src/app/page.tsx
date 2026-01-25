import { PujaListClient } from './_components/PujaListClient';
import { getPujas } from '@/lib/data';
import { Suspense } from 'react';

export default async function Home() {
  const pujas = await getPujas();
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="font-headline text-4xl text-center mb-2 text-primary">
        Connect with Tradition
      </h2>
      <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
        Discover and connect with qualified Vaidika Pujaris to perform sacred Vedic rituals and pujas, preserving our ancient traditions for generations to come.
      </p>
      <Suspense fallback={<div className="text-center">Loading programs...</div>}>
        <PujaListClient pujas={pujas} />
      </Suspense>
    </div>
  );
}
