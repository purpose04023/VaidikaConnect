"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

// Consent banner for Vercel Analytics (third-party tracker).
// Vercel Analytics sends anonymised event data to vercel.com servers (USA).
// Under DPDP Act 2023 §7(a), processing based on consent requires a prior,
// informed, and explicit opt-in.
//
// LAWYER-REVIEW-REQUIRED: confirm whether Vercel Analytics (no cookies, aggregate)
// requires consent under final DPDP Rules, or qualifies as "legitimate interest".
// If consent is required, the <Analytics /> component in layout.tsx must be
// conditionally rendered based on this banner's result.

const CONSENT_KEY = "vc_analytics_consent";

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "granted");
    setVisible(false);
    // Caller (layout) watches "vc_analytics_consent" to enable Analytics component
    window.dispatchEvent(new Event("consentUpdated"));
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, "denied");
    setVisible(false);
    window.dispatchEvent(new Event("consentUpdated"));
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cookie and analytics consent"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 bg-card border border-border shadow-xl rounded-2xl p-5 space-y-3"
    >
      <button
        onClick={decline}
        aria-label="Close consent banner"
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>

      <h3 className="font-semibold text-foreground text-sm">We value your privacy</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">
        VaidikaConnect uses{" "}
        <strong>Vercel Analytics</strong> (anonymous, cookie-free) to understand how the
        platform is used and improve your experience. No personal identifiers are collected.
        You can opt out at any time.{" "}
        <a href="/privacy#analytics" className="text-primary underline">
          Learn more
        </a>
        .
      </p>

      <div className="flex gap-2 pt-1">
        <button
          onClick={accept}
          className="flex-1 text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white rounded-lg py-2 transition-colors"
        >
          Accept
        </button>
        <button
          onClick={decline}
          className="flex-1 text-xs font-medium bg-muted hover:bg-muted/80 text-foreground rounded-lg py-2 transition-colors"
        >
          Decline
        </button>
      </div>
    </div>
  );
}

/** Hook to read current consent from localStorage (SSR-safe) */
export function useAnalyticsConsent(): boolean {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    function update() {
      setGranted(localStorage.getItem(CONSENT_KEY) === "granted");
    }
    update();
    window.addEventListener("consentUpdated", update);
    return () => window.removeEventListener("consentUpdated", update);
  }, []);

  return granted;
}
