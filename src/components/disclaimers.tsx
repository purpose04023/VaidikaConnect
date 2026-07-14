"use client";

import { Flame, ShieldAlert } from "lucide-react";

/**
 * Legal disclaimer cards.
 * FireHazardDisclaimer — mandatory for all Homam bookings.
 * NoMetaphysicalDisclaimer — mandatory on all booking confirmation screens.
 */

export function FireHazardDisclaimer() {
  return (
    <div className="rounded-xl border border-orange-400 bg-orange-50 dark:bg-orange-950/20 px-4 py-3 flex gap-3 text-sm">
      <Flame className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-orange-700 dark:text-orange-400">Fire Hazard Notice</p>
        <p className="text-orange-700 dark:text-orange-300 mt-0.5">
          Homam rituals involve open fire. You must ensure the venue is fire-safe, well-ventilated,
          and equipped with a fire extinguisher. VaidikaConnect and the officiating Purohit are not
          liable for any fire-related damage or injury arising from the ceremony.
        </p>
      </div>
    </div>
  );
}

export function NoMetaphysicalDisclaimer() {
  return (
    <div className="rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/30 px-4 py-3 flex gap-3 text-sm">
      <ShieldAlert className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />
      <p className="text-slate-600 dark:text-slate-400">
        <strong>Disclaimer:</strong> VaidikaConnect facilitates access to qualified Vedic Purohits
        for ceremonial services. We do not guarantee, represent, or warrant any specific spiritual,
        metaphysical, astrological, or material outcomes as a result of any ritual performed through
        this platform.
      </p>
    </div>
  );
}
