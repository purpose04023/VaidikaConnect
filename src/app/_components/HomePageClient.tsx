"use client";

import type { Puja, Pujari } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Search, Users, CheckCircle } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useLanguage } from '@/context/language-context';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { useContent } from '@/lib/content-store';
import { ManagedImage } from '@/components/common/ManagedImage';
import { Hero } from '@/components/Hero';

const HomePujariMap = dynamic(
  () => import('@/features/pujari/components/HomePujariMap').then(mod => mod.HomePujariMap),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[500px] w-full" />,
  }
);


export function HomePageClient({ pujaris, allPujas }: { pujaris: Pujari[], allPujas: Puja[] }) {
  const { t, language } = useLanguage();
  const content = useContent();
  const displayPujas = content.pujas.length ? content.pujas : allPujas;
  const displayPujaris = content.pujaris.length ? content.pujaris : pujaris;

  const landingTitle = language === 'te'
    ? (content.settings?.landingTitleTe || t('home.title'))
    : (content.settings?.landingTitleEn || t('home.title'));

  const landingSubtitle = language === 'te'
    ? (content.settings?.landingSubtitleTe || t('home.subtitle'))
    : (content.settings?.landingSubtitleEn || t('home.subtitle'));

  return (
    <div className="flex flex-col items-center text-center">
      {/* Hero Section */}
      <Hero title={landingTitle} subtitle={landingSubtitle} />

      {/* How It Works Section */}
      <section className="w-full py-24 md:py-32 bg-transparent relative">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-5xl font-bold mb-16 tracking-tight text-foreground">{t('home.how_it_works_title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-amber-500/10 text-amber-500 mb-6 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('home.how_it_works_step1_title')}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t('home.how_it_works_step1_desc')}</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-amber-500/10 text-amber-500 mb-6 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('home.how_it_works_step2_title')}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t('home.how_it_works_step2_desc')}</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-amber-500/10 text-amber-500 mb-6 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('home.how_it_works_step3_title')}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t('home.how_it_works_step3_desc')}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* All Programs Section */}
      <section className="w-full py-24 md:py-32 bg-secondary/20 border-y border-border relative">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-5xl font-bold mb-16 tracking-tight text-foreground">{t('home.programs_title')}</h2>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {displayPujas.map(puja => (
                <CarouselItem key={puja.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-2 h-full">
                    <Card className="glass-card flex flex-col text-left h-full overflow-hidden border-none bg-transparent">
                      <div className="relative h-48 overflow-hidden rounded-t-2xl">
                        <ManagedImage
                            src={puja.image}
                            alt={language === 'te' ? puja.name : puja.name_en}
                            width={600}
                            height={400}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            data-ai-hint={puja.imageHint}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#120f0e] via-transparent to-transparent opacity-80" />
                      </div>
                      <CardContent className="p-6 flex-grow flex flex-col bg-transparent">
                        <h3 className="font-headline text-2xl font-bold text-foreground mb-3 leading-tight">{language === 'te' ? puja.name : puja.name_en}</h3>
                        <p className="text-sm text-muted-foreground mb-6 flex-grow leading-relaxed line-clamp-3">{language === 'te' ? puja.description_te : puja.description}</p>
                        <Button asChild variant="outline" className="mt-auto border-border hover:bg-secondary/40 hover:text-amber-500 transition-all rounded-xl">
                          <Link href="/programs" className="flex items-center gap-2">
                            {t('home.programs_cta')} <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex border-border hover:bg-secondary/40 hover:text-amber-500" />
            <CarouselNext className="hidden sm:flex border-border hover:bg-secondary/40 hover:text-amber-500" />
          </Carousel>
        </div>
      </section>

"use client";

import type { Puja, Pujari } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Search, Users, CheckCircle, HelpCircle } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useLanguage } from '@/context/language-context';
import { useUser } from '@/hooks/use-auth';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { useContent } from '@/lib/content-store';
import { ManagedImage } from '@/components/common/ManagedImage';
import { Hero } from '@/components/Hero';

const HomePujariMap = dynamic(
  () => import('@/features/pujari/components/HomePujariMap').then(mod => mod.HomePujariMap),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[500px] w-full" />,
  }
);


export function HomePageClient({ pujaris, allPujas }: { pujaris: Pujari[], allPujas: Puja[] }) {
  const { t, language } = useLanguage();
  const { user, isUserLoading } = useUser();
  const content = useContent();
  const displayPujas = content.pujas.length ? content.pujas : allPujas;
  const displayPujaris = content.pujaris.length ? content.pujaris : pujaris;

  const landingTitle = language === 'te'
    ? (content.settings?.landingTitleTe || t('home.title'))
    : (content.settings?.landingTitleEn || t('home.title'));

  const landingSubtitle = language === 'te'
    ? (content.settings?.landingSubtitleTe || t('home.subtitle'))
    : (content.settings?.landingSubtitleEn || t('home.subtitle'));

  return (
    <div className="flex flex-col items-center text-center">
      {/* Hero Section */}
      <Hero title={landingTitle} subtitle={landingSubtitle} />

      {/* How It Works Section */}
      <section className="w-full py-24 md:py-32 bg-transparent relative">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-5xl font-bold mb-16 tracking-tight text-foreground">{t('home.how_it_works_title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-amber-500/10 text-amber-500 mb-6 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('home.how_it_works_step1_title')}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t('home.how_it_works_step1_desc')}</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-amber-500/10 text-amber-500 mb-6 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('home.how_it_works_step2_title')}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t('home.how_it_works_step2_desc')}</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-amber-500/10 text-amber-500 mb-6 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('home.how_it_works_step3_title')}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t('home.how_it_works_step3_desc')}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* All Programs Section */}
      <section className="w-full py-24 md:py-32 bg-secondary/20 border-y border-border relative">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-5xl font-bold mb-16 tracking-tight text-foreground">{t('home.programs_title')}</h2>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {displayPujas.map(puja => (
                <CarouselItem key={puja.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-2 h-full">
                    <Card className="glass-card flex flex-col text-left h-full overflow-hidden border-none bg-transparent">
                      <div className="relative h-48 overflow-hidden rounded-t-2xl">
                        <ManagedImage
                            src={puja.image}
                            alt={language === 'te' ? puja.name : puja.name_en}
                            width={600}
                            height={400}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            data-ai-hint={puja.imageHint}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#120f0e] via-transparent to-transparent opacity-80" />
                      </div>
                      <CardContent className="p-6 flex-grow flex flex-col bg-transparent">
                        <h3 className="font-headline text-2xl font-bold text-foreground mb-3 leading-tight">{language === 'te' ? puja.name : puja.name_en}</h3>
                        <p className="text-sm text-muted-foreground mb-6 flex-grow leading-relaxed line-clamp-3">{language === 'te' ? puja.description_te : puja.description}</p>
                        <Button asChild variant="outline" className="mt-auto border-border hover:bg-secondary/40 hover:text-amber-500 transition-all rounded-xl">
                          <Link href="/programs" className="flex items-center gap-2">
                            {t('home.programs_cta')} <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex border-border hover:bg-secondary/40 hover:text-amber-500" />
            <CarouselNext className="hidden sm:flex border-border hover:bg-secondary/40 hover:text-amber-500" />
          </Carousel>
        </div>
      </section>

      {/* Map View Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">{t('home.map_title')}</h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">{t('home.map_desc')}</p>
          <div className="relative h-[500px] w-full rounded-lg overflow-hidden border shadow-lg">
            <HomePujariMap pujaris={displayPujaris} />
            {!user && !isUserLoading && (
              <div className="absolute inset-0 bg-background/60 backdrop-blur-md z-10 flex flex-col items-center justify-center text-center p-6">
                <HelpCircle className="h-12 w-12 text-amber-500 mb-4 animate-bounce" />
                <h3 className="text-2xl font-bold text-foreground mb-2">Map Access Restricted</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                  Please login to your account to view our qualified Pujari network on the map.
                </p>
                <Button asChild className="divine-button rounded-full px-8 py-6 text-lg font-bold shadow-xl">
                  <Link href="/login">Login to View Map</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
    </div>
  );
}
