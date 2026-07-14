"use client";

/**
 * Crisis hard-router hook — VaidikaConnect
 *
 * Returns whether we're within 2 hours of a Muhurtham.
 * If yes, the UI should bypass all normal flows and show the emergency contact.
 */

import { useEffect, useState } from "react";

const CRISIS_WINDOW_MS = 2 * 60 * 60 * 1000; // 2 hours
export const CRISIS_PHONE = "+91 98765 43210";
export const CRISIS_WHATSAPP = "https://wa.me/919876543210";

export function useCrisisMode(muhurthamISO: string | null): boolean {
  const [isCrisis, setIsCrisis] = useState(false);

  useEffect(() => {
    if (!muhurthamISO) return;
    const check = () => {
      const diff = new Date(muhurthamISO).getTime() - Date.now();
      setIsCrisis(diff > 0 && diff <= CRISIS_WINDOW_MS);
    };
    check();
    const id = setInterval(check, 60_000); // re-check every minute
    return () => clearInterval(id);
  }, [muhurthamISO]);

  return isCrisis;
}
