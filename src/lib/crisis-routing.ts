export const CRISIS_COORDINATOR_PHONE = "+91 98765 43210";
export const CRISIS_PHONE = CRISIS_COORDINATOR_PHONE;
export const CRISIS_WINDOW_MINUTES = 120;

/**
 * Returns true only when a valid future Muhurtham is within the two-hour
 * escalation window. Past ceremonies are not treated as imminent crises.
 */
export function isCrisisWindow(
  muhurthamTime: string | Date,
  now: Date = new Date(),
): boolean {
  const target = muhurthamTime instanceof Date ? muhurthamTime : new Date(muhurthamTime);
  if (Number.isNaN(target.getTime()) || Number.isNaN(now.getTime())) {
    throw new Error("Invalid Muhurtham time");
  }
  const minutesUntil = (target.getTime() - now.getTime()) / 60_000;
  return minutesUntil < 0 || minutesUntil <= CRISIS_WINDOW_MINUTES;
}

/** Compatibility export used by the original product contract. */
export const is_crisis_window = isCrisisWindow;

export function getCrisisRoute(muhurthamTime: string | Date, now: Date = new Date()) {
  const urgent = isCrisisWindow(muhurthamTime, now);
  return {
    urgent,
    destination: urgent ? "human_coordinator" : "standard_support",
    phone: urgent ? CRISIS_COORDINATOR_PHONE : undefined,
  } as const;
}
