"use client";

import { Phone, MessageCircle, AlertOctagon } from "lucide-react";
import { CRISIS_PHONE, CRISIS_WHATSAPP } from "@/hooks/useCrisisMode";

/**
 * CrisisBanner — shown when booking is within 2h of Muhurtham.
 * Hard-routes user to a human operator. No chatbot, no form.
 */
export function CrisisBanner() {
  return (
    <div className="rounded-2xl border-2 border-red-500 bg-red-50 dark:bg-red-950/30 p-5 flex flex-col gap-4 shadow-lg">
      <div className="flex items-center gap-3">
        <AlertOctagon className="h-7 w-7 text-red-600 shrink-0" />
        <div>
          <p className="font-bold text-red-700 dark:text-red-400 text-lg leading-tight">
            Muhurtham Alert — Urgent Assistance Required
          </p>
          <p className="text-sm text-red-600 dark:text-red-300 mt-0.5">
            Your ceremony is within 2 hours. Please contact our coordinator directly.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <a
          href={`tel:${CRISIS_PHONE}`}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm transition-colors"
        >
          <Phone className="h-4 w-4" />
          Call {CRISIS_PHONE}
        </a>
        <a
          href={CRISIS_WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp Coordinator
        </a>
      </div>
    </div>
  );
}
