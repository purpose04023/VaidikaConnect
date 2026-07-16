"use client";

import type { Pujari } from "@/lib/data";
import React from 'react';
import PoojariSearchFlow from "./PoojariSearchFlow";

export function PujariDiscoveryClient({
  pujaris,
  pujaId,
}: {
  pujaris: Pujari[];
  recommendation?: string;
  pujaId?: string | number;
}) {
  return (
    <div className="space-y-8">
      {/* GPS-powered regional poojari search flow component */}
      <PoojariSearchFlow pujaris={pujaris} pujaId={pujaId} />
    </div>
  );
}
