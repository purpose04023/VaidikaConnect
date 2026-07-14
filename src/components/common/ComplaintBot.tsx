"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";

export function ComplaintBot() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isPermanentlyClosed, setIsPermanentlyClosed] = useState(false);

  useEffect(() => {
    const closed = localStorage.getItem("complaint_bot_closed");
    if (closed === "true") {
      setIsPermanentlyClosed(true);
    }
  }, []);

  const handlePermanentClose = () => {
    localStorage.setItem("complaint_bot_closed", "true");
    setIsPermanentlyClosed(true);
    setIsOpen(false);
  };

  if (isPermanentlyClosed) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 glass-card border-amber-500/30 p-6 shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-foreground text-lg">Support & Feedback</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            {language === 'te' 
              ? "మీకు ఏవైనా ఫిర్యాదులు లేదా సందేహాలు ఉంటే, దయచేసి మాకు తెలియజేయండి. మేము మీకు సహాయం చేయడానికి ఇక్కడ ఉన్నాము." 
              : "If you have any complaints or doubts, please let us know. We are here to help you!"}
          </p>
          <div className="flex flex-col gap-3">
            <Button asChild className="divine-button w-full rounded-xl py-6 font-bold">
              <a href="/contact" onClick={() => setIsOpen(false)}>Send Message</a>
            </Button>
            <button 
              onClick={handlePermanentClose}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors text-center underline underline-offset-4"
            >
              Close Permanently
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="h-16 w-16 rounded-full divine-button shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 relative group"
      >
        <MessageCircle className="h-8 w-8 text-black" />
        
        {/* Tooltip / Hint */}
        {!isOpen && (
          <div className="absolute right-full mr-4 whitespace-nowrap bg-card text-foreground text-xs font-medium px-3 py-2 rounded-lg border border-border shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {language === 'te' 
              ? "ఏవైనా ఫిర్యాదులు లేదా సందేహాలు ఉంటే ఇక్కడ క్లిక్ చేయండి!!" 
              : "If any complaints or doubts, click here!!"}
          </div>
        )}
      </button>
    </div>
  );
}
