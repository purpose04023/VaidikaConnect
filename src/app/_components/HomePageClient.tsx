"use client";

import type { Puja, Pujari } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { ArrowRight, Search, Users, CheckCircle } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useLanguage } from '@/context/language-context';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const HomePujariMap = dynamic(
  () => import('./HomePujariMap').then(mod => mod.HomePujariMap),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[500px] w-full" />,
  }
);


export function HomePageClient({ pujaris, allPujas }: { pujaris: Pujari[], allPujas: Puja[] }) {
  const { t, language } = useLanguage();

  return (
    <div className="flex flex-col items-center text-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-background to-accent/10 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary">
            {t('home.title')}
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
            {t('home.subtitle')}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/programs">{t('home.hero_cta_explore')} <ArrowRight className="ml-2" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/login">{t('home.hero_cta_login')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-12">{t('home.how_it_works_title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 text-primary mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t('home.how_it_works_step1_title')}</h3>
              <p className="text-muted-foreground">{t('home.how_it_works_step1_desc')}</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 text-primary mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t('home.how_it_works_step2_title')}</h3>
              <p className="text-muted-foreground">{t('home.how_it_works_step2_desc')}</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 text-primary mb-4">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t('home.how_it_works_step3_title')}</h3>
              <p className="text-muted-foreground">{t('home.how_it_works_step3_desc')}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* All Programs Section */}
      <section className="w-full py-16 md:py-24 bg-accent/10">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-12">{t('home.programs_title')}</h2>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {allPujas.map(puja => (
                <CarouselItem key={puja.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1 h-full">
                    <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col text-left h-full">
                      <Image
                          src={puja.image}
                          alt={language === 'te' ? puja.name : puja.name_en}
                          width={600}
                          height={400}
                          className="w-full h-48 object-cover"
                          data-ai-hint={puja.imageHint}
                      />
                      <CardContent className="p-6 flex-grow flex flex-col">
                        <h3 className="font-headline text-2xl mb-2">{language === 'te' ? puja.name : puja.name_en}</h3>
                        <p className="text-muted-foreground mb-4 flex-grow">{language === 'te' ? puja.description_te : puja.description}</p>
                         <Button asChild variant="outline" className="mt-auto">
                            <Link href="/programs">{t('home.programs_cta')} <ArrowRight className="ml-2" /></Link>
                          </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </section>

      {/* Map View Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">{t('home.map_title')}</h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">{t('home.map_desc')}</p>
          <div className="h-[500px] w-full rounded-lg overflow-hidden border shadow-lg">
            <HomePujariMap pujaris={pujaris} />
          </div>
        </div>
      </section>
    </div>
  );
}
