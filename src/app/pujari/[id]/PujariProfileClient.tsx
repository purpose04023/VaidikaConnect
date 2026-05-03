"use client";

import Link from "next/link";
import type { Puja, Pujari } from "@/lib/data";
import { useContent } from "@/lib/content-store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BadgeCheck, Briefcase, Calendar, Languages, MessageCircle, Phone, Star } from "lucide-react";
import { ManagedImage } from "@/components/common/ManagedImage";

export function PujariProfileClient({
  initialPujari,
  initialPujas,
}: {
  initialPujari: Pujari;
  initialPujas: Puja[];
}) {
  const { pujaris, pujas } = useContent();
  const pujari = pujaris.find(item => item.id === initialPujari.id) ?? initialPujari;
  const allPujas = pujas.length ? pujas : initialPujas;
  const pujasOffered = allPujas.filter(puja => pujari.pujas.includes(puja.id));

  return (
    <div className="bg-card">
      <div className="container mx-auto px-4 py-8">
        <Card className="overflow-hidden shadow-xl">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-1 p-6 flex flex-col items-center text-center bg-background/50">
                <div className="relative w-48 h-48 mb-4">
                  <ManagedImage
                    src={pujari.photo}
                    alt={pujari.name}
                    fill
                    className="rounded-full object-cover border-4 border-primary shadow-lg"
                    data-ai-hint={pujari.photoHint}
                    priority
                  />
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <h1 className="font-headline text-3xl text-primary">{pujari.name}</h1>
                  {pujari.verified && (
                    <Badge className="gap-1 bg-primary/15 text-primary hover:bg-primary/15">
                      <BadgeCheck className="h-4 w-4" />
                      Verified
                    </Badge>
                  )}
                </div>
                {pujari.verified && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Personally verified by {pujari.verifiedBy || "VaidikaConnect"}
                  </p>
                )}
                <div className="flex items-center gap-2 text-lg text-muted-foreground mt-2">
                  <div className="flex items-center gap-1 text-accent">
                    <Star className="w-5 h-5 fill-current" />
                    <span>{pujari.rating.toFixed(1)}</span>
                  </div>
                  <span>({pujari.reviewCount} reviews)</span>
                </div>
                <div className="mt-4 space-y-2 text-left">
                  <div className="flex items-start gap-3"><Calendar className="w-5 h-5 mt-1 text-primary shrink-0" /><span>{pujari.experience} years of experience</span></div>
                  <div className="flex items-start gap-3"><Languages className="w-5 h-5 mt-1 text-primary shrink-0" /><span>Speaks: {pujari.languages.join(", ")}</span></div>
                  <div className="flex items-start gap-3"><Briefcase className="w-5 h-5 mt-1 text-primary shrink-0" /><span>Base Price: Rs. {pujari.basePrice.toLocaleString()}</span></div>
                </div>
                <div className="mt-6 w-full space-y-2">
                  <Button asChild size="lg" className="w-full"><Link href={`tel:${pujari.phone}`}><Phone className="mr-2 h-5 w-5" />Call Now</Link></Button>
                  <Button variant="secondary" size="lg" className="w-full" disabled><MessageCircle className="mr-2 h-5 w-5" />Chat (Coming Soon)</Button>
                </div>
              </div>
              <div className="md:col-span-2 p-6">
                <Tabs defaultValue="details">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="gallery">Gallery</TabsTrigger>
                    <TabsTrigger value="pujas">Pujas</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>
                  <TabsContent value="details" className="mt-6">
                    <h3 className="font-headline text-xl mb-4">About {pujari.name}</h3>
                    <p className="text-muted-foreground mb-6">{pujari.description}</p>
                    <h3 className="font-headline text-xl mb-4">Vedic Qualifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {pujari.qualifications.map((qualification, index) => (
                        <Badge key={index} variant="outline" className="text-lg py-1 px-3">{qualification}</Badge>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="gallery" className="mt-6">
                    {pujari.gallery.length ? (
                      <Carousel className="w-full">
                        <CarouselContent>
                          {pujari.gallery.map((img, index) => (
                            <CarouselItem key={index}>
                              <div className="p-1">
                                <Card className="overflow-hidden">
                                  <CardContent className="flex aspect-video items-center justify-center p-0">
                                    <ManagedImage src={img.url} alt={`Gallery image ${index + 1}`} width={800} height={600} className="object-cover w-full h-full" data-ai-hint={img.hint} />
                                  </CardContent>
                                </Card>
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                      </Carousel>
                    ) : (
                      <p className="text-muted-foreground">Gallery will be updated soon.</p>
                    )}
                  </TabsContent>
                  <TabsContent value="pujas" className="mt-6">
                    <div className="space-y-4">
                      {pujasOffered.map(puja => (
                        <Card key={puja.id} className="bg-background/50">
                          <CardContent className="p-4">
                            <h4 className="font-headline text-lg">{puja.name_en}</h4>
                            <p className="text-sm text-muted-foreground">{puja.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="reviews" className="mt-6">
                    <div className="space-y-6">
                      {pujari.reviews.map((review, index) => (
                        <div key={index} className="flex gap-4">
                          <Avatar>
                            <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{review.name}</p>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, starIndex) => (
                                  <Star key={starIndex} className={`w-4 h-4 ${starIndex < review.rating ? "text-accent fill-accent" : "text-muted-foreground"}`} />
                                ))}
                              </div>
                            </div>
                            <p className="text-muted-foreground italic">&quot;{review.comment}&quot;</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
