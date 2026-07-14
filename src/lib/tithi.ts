/**
 * Tithi Calculator — VaidikaConnect
 * Computes the Hindu lunar tithi (1–30) for any Gregorian date.
 * Uses the mean synodic month approximation (29.53059 days).
 *
 * ponytail: mean-moon approximation; accurate ±1 tithi for practical reminders.
 * Upgrade path: replace getSolarMoonLongitudes() with an ephemeris API if
 * sub-tithi precision is needed.
 *
 * No external dependencies — native Date and Math only.
 */

/** Reference: Amavasya (New Moon) 2000-01-06 UTC as epoch anchor. */
const AMAVASYA_EPOCH_MS = Date.UTC(2000, 0, 6); // Jan 6 2000
const SYNODIC_MONTH_MS = 29.53059 * 24 * 3600 * 1000;

/** Returns the tithi index 1–30 for a given date. */
export function getTithi(date: Date): number {
  const elapsed = date.getTime() - AMAVASYA_EPOCH_MS;
  const phase = ((elapsed % SYNODIC_MONTH_MS) + SYNODIC_MONTH_MS) % SYNODIC_MONTH_MS;
  // Divide synodic month into 30 equal tithis
  return Math.floor((phase / SYNODIC_MONTH_MS) * 30) + 1;
}

export const TITHI_NAMES = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
  "Shashti", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya",
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
  "Shashti", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima",
];

/** Returns a human-readable tithi name for a date. */
export function getTithiName(date: Date): string {
  return TITHI_NAMES[getTithi(date) - 1];
}

/** Finds the next calendar date (from `after`) whose tithi matches `targetTithi`. */
export function nextDateForTithi(targetTithi: number, after: Date = new Date()): Date {
  const start = new Date(after);
  // Scan forward — tithis repeat every ~29.5 days, so max 31 iterations
  for (let i = 0; i < 32; i++) {
    const candidate = new Date(start.getTime() + i * 24 * 3600 * 1000);
    if (getTithi(candidate) === targetTithi) return candidate;
  }
  // fallback: return 30 days out (should never happen)
  return new Date(start.getTime() + 30 * 24 * 3600 * 1000);
}

/** Compute the three WhatsApp reminder dates (14, 7, 3 days before ceremony). */
export function getReminderDates(ceremonyDate: Date): { days: number; date: Date }[] {
  return [14, 7, 3].map(days => ({
    days,
    date: new Date(ceremonyDate.getTime() - days * 24 * 3600 * 1000),
  }));
}

/** Build a wa.me pre-filled message link for a reminder. */
export function whatsappReminderLink(
  phone: string,
  ceremonyDate: Date,
  daysRemaining: number,
  pujaName: string
): string {
  const formatted = ceremonyDate.toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric",
  });
  const msg = encodeURIComponent(
    `🙏 Namaskaram! Your ${pujaName} is scheduled on ${formatted}. ` +
    `Only ${daysRemaining} days remaining. Please confirm arrangements with VaidikaConnect.`
  );
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${msg}`;
}
