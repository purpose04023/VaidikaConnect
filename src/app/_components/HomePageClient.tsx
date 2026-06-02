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

const HomePujariMap = dynamic(
  () => import('./HomePujariMap').then(mod => mod.HomePujariMap),
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
      <section className="w-full divine-bg py-20 md:py-32 relative overflow-hidden">
        {/* Background Om watermarks */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
          <span className="absolute top-4 left-[5%] text-primary/5 text-[200px] font-serif leading-none">ॐ</span>
          <span className="absolute bottom-0 right-[5%] text-primary/5 text-[160px] font-serif leading-none">ॐ</span>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-sm font-medium mb-6">
            ✦ Trusted by 500+ families across Andhra Pradesh
          </div>
          <h1 className="font-headline text-4xl md:text-6xl font-bold gold-gradient-text break-words whitespace-normal leading-relaxed">
            {landingTitle}
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground break-words whitespace-normal leading-relaxed">
            {landingSubtitle}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="divine-button px-8 py-6 text-base h-auto">
              <Link href="/explore">{t('home.hero_cta_explore')} <ArrowRight className="ml-2" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary/40 hover:bg-primary/10 px-8 py-6 text-base h-auto">
              <Link href="/login">{t('home.hero_cta_login')}</Link>
            </Button>
          </div>
          {/* Quick stats */}
          <div className="mt-14 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { num: "68+", label: "Sacred Programs" },
              { num: "500+", label: "Happy Families" },
              { num: "30+", label: "Expert Pujaris" },
            ].map((stat) => (
              <div key={stat.label} className="glass-card rounded-xl py-4 px-3">
                <p className="font-headline text-2xl font-bold text-primary">{stat.num}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-24 md:py-32 bg-transparent relative">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-5xl font-bold mb-16 tracking-tight text-foreground">{t('home.how_it_works_title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-amber-500/10 text-amber-500 mb-6 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('home.how_it_works_step1_title')}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t('home.how_it_works_step1_desc')}</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-amber-500/10 text-amber-500 mb-6 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('home.how_it_works_step2_title')}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t('home.how_it_works_step2_desc')}</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
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
      <section className="w-full py-24 md:py-32 bg-white/[0.01] border-y border-white/5 relative">
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
                    <Card className="glass-card hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 flex flex-col text-left h-full overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md">
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
                        <Button asChild variant="outline" className="mt-auto border-white/10 hover:bg-white/10 hover:text-amber-400 transition-all rounded-xl">
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
            <CarouselPrevious className="hidden sm:flex border-white/10 hover:bg-white/5 hover:text-amber-400" />
            <CarouselNext className="hidden sm:flex border-white/10 hover:bg-white/5 hover:text-amber-400" />
          </Carousel>
        </div>
      </section>

      {/* Map View Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">{t('home.map_title')}</h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">{t('home.map_desc')}</p>
          <div className="h-[500px] w-full rounded-lg overflow-hidden border shadow-lg">
            <HomePujariMap pujaris={displayPujaris} />
          </div>
        </div>
      </section>
    </div>
  );
}
