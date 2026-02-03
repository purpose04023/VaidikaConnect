
import { getPujaris, getPujas } from '@/lib/data';
import { HomePujariMap } from './_components/HomePujariMap';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { ArrowRight, Search, Users, CheckCircle } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export default async function HomePage() {
  const pujaris = await getPujaris();
  const allPujas = await getPujas();

  return (
    <div className="flex flex-col items-center text-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-background to-accent/10 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary">
            Connect with Tradition
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
            Discover and connect with qualified Vaidika Pujaris to perform sacred Vedic rituals and pujas.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/programs">Explore Pujas <ArrowRight className="ml-2" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/login">Login / Sign Up</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 text-primary mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">1. Find Your Puja</h3>
              <p className="text-muted-foreground">Browse our extensive library of Vedic pujas and rituals. Use our search and filters to find the perfect ceremony for your needs.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 text-primary mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. Connect with a Pujari</h3>
              <p className="text-muted-foreground">We connect you with experienced and qualified Vaidika Pujaris who can perform the ceremony for you, either in-person or online.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 text-primary mb-4">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. Experience the Divine</h3>
              <p className="text-muted-foreground">Receive blessings and experience the spiritual benefits of ancient Vedic traditions performed authentically and with devotion.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* All Programs Section */}
      <section className="w-full py-16 md:py-24 bg-accent/10">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-12">Explore Our Programs</h2>
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
                          alt={puja.name_en}
                          width={600}
                          height={400}
                          className="w-full h-48 object-cover"
                          data-ai-hint={puja.imageHint}
                      />
                      <CardContent className="p-6 flex-grow flex flex-col">
                        <h3 className="font-headline text-2xl mb-2">{puja.name_en}</h3>
                        <p className="text-muted-foreground mb-4 flex-grow">{puja.description}</p>
                         <Button asChild variant="outline" className="mt-auto">
                            <Link href="/programs">View Details <ArrowRight className="ml-2" /></Link>
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
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">Pujaris Across the Region</h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">Explore our network of skilled pujaris. The map below shows a selection of our available experts.</p>
          <div className="h-[500px] w-full rounded-lg overflow-hidden border shadow-lg">
            <HomePujariMap pujaris={pujaris} />
          </div>
        </div>
      </section>
    </div>
  );
}
