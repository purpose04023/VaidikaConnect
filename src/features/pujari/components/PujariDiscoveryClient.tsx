"use client";

import type { Pujari } from "@/lib/data";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from "lucide-react";
import PoojariSearchFlow from "./PoojariSearchFlow";

export function PujariDiscoveryClient({
  pujaris,
  recommendation,
  pujaId,
}: {
  pujaris: Pujari[];
  recommendation: string;
  pujaId?: string | number;
}) {
  return (
    <div className="space-y-8">
      {/* AI Recommendation Card */}
      <Card className="bg-gradient-to-br from-primary/20 to-accent/20 border-primary">
        <CardHeader className="flex flex-row items-center gap-4">
          <Sparkles className="w-8 h-8 text-primary" />
          <CardTitle className="font-headline text-2xl text-primary font-bold">AI Recommendation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/80 leading-relaxed text-sm md:text-base">{recommendation}</p>
        </CardContent>
      </Card>

      {/* GPS-powered regional poojari search flow component */}
      <PoojariSearchFlow pujaris={pujaris} pujaId={pujaId} />
    </div>
  );
}
