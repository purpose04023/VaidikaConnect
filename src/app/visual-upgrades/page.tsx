"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, ShieldCheck, Flame, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VisualUpgradesDemoPage() {
  const [isDemoActive, setIsDemoActive] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground py-20 px-6">
      
      {/* Decorative Orbs for Visual Depth */}
      <div className="orb w-96 h-96 bg-amber-200/40 dark:bg-amber-900/10 top-[-10%] left-[-10%]" />
      <div className="orb w-[500px] h-[500px] bg-orange-200/30 dark:bg-orange-950/10 bottom-[-10%] right-[-10%]" />

      <div className="container mx-auto max-w-5xl space-y-24">
        
        {/* Header Section */}
        <div className="text-center space-y-6">
          <h1 className="font-cinzel text-5xl md:text-7xl font-bold tracking-wide">
            Visual <span className="text-amber-600 dark:text-amber-500">Upgrades</span> Demo
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            This is an interactive Next.js version of the premium UI/UX enhancements. These styles introduce a spiritual, modern, and highly polished feel to VaidikaConnect.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Feature 1: The Cinzel Font & Glassmorphism */}
          <div className="space-y-6 text-left">
            <h2 className="font-cinzel text-3xl font-bold border-b-2 border-amber-500 w-fit pb-2">
              1. Divine Typography & Glass
            </h2>
            <div className="glass-card p-8 rounded-3xl space-y-6">
              <h3 className="font-cinzel text-2xl font-bold text-amber-700 dark:text-amber-500">
                Ancient Elegance
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Using the <strong>Cinzel</strong> serif typeface for headings creates an immediate bridge between ancient Vedic tradition and modern design. Combined with <strong>Glassmorphism</strong>, the UI feels lightweight, airy, and high-end.
              </p>
              <Button 
                onClick={() => setIsDemoActive(prev => !prev)}
                className="divine-button px-6 py-3 rounded-full text-xs font-bold w-full sm:w-auto"
              >
                {isDemoActive ? "Experience Deactivated" : "Experience Divine Glow"}
              </Button>
            </div>
          </div>

          {/* Feature 2: Micro-Interactions & Shimmer */}
          <div className="space-y-6 text-left">
            <h2 className="font-cinzel text-3xl font-bold border-b-2 border-amber-500 w-fit pb-2">
              2. Smooth Interactions
            </h2>
            <div className="space-y-4">
              {/* Shimmer Loading Sample */}
              <div className="glass-card p-6 rounded-3xl space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full shimmer shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 shimmer rounded" />
                    <div className="h-3 w-1/2 shimmer rounded" />
                  </div>
                </div>
                <div className="h-28 w-full shimmer rounded-2xl" />
                <p className="text-center text-[10px] text-muted-foreground italic">
                  Saffron-themed Shimmer Loader (Simulated skeleton state)
                </p>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Hover over the cards to observe the <strong>smooth lift & scale</strong> animations.
              </p>
            </div>
          </div>

        </div>

        {/* Feature 3: Full-Page Application Sample */}
        <div className="text-center space-y-12">
          <h2 className="font-cinzel text-3xl font-bold">Full-Page Application Sample</h2>
          <div className="glass-card p-8 md:p-12 rounded-[2.5rem] max-w-3xl mx-auto space-y-8 text-left relative overflow-hidden">
            
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-amber-500/10 dark:bg-amber-500/20 p-1.5 shadow-lg border border-amber-500/30 flex items-center justify-center">
                <div className="w-full h-full bg-white dark:bg-stone-900 rounded-full flex items-center justify-center text-3xl font-bold text-amber-600 dark:text-amber-500">
                  ॐ
                </div>
              </div>
            </div>

            <h3 className="font-cinzel text-4xl font-bold text-center text-foreground">Terms of Service</h3>
            <p className="text-muted-foreground text-center leading-relaxed text-sm max-w-xl mx-auto">
              Imagine your legal policies and user dashboards wrapped in this premium high-contrast container. It transforms a boring text layout into a brand asset.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="p-5 rounded-2xl bg-muted/30 border text-sm space-y-2">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-500 font-bold">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Divine Clarity</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  High-contrast type layouts optimize readability on all viewport sizes.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-muted/30 border text-sm space-y-2">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-500 font-bold">
                  <Sparkles className="h-4 w-4" />
                  <span>Modern Soul</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Infuses modern web aesthetics (glassmorphism) into spiritual spaces.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground pt-12 border-t">
          Created for VaidikaConnect Premium Visual Enhancement Review
        </div>
      </div>
    </div>
  );
}
