export const FIRE_HAZARD_WAIVER =
  "For Homams and ceremonies involving fire, the devotee is responsible for a safe, ventilated setup, adult supervision, and compliance with local fire and building rules.";

export const METAPHYSICAL_OUTCOME_WAIVER =
  "VaidikaConnect facilitates access to ritual services but does not guarantee metaphysical, medical, financial, relationship, or other personal outcomes.";

export const FIRE_WAIVER_TEXT = FIRE_HAZARD_WAIVER;
export const METAPHYSICAL_WAIVER_TEXT = METAPHYSICAL_OUTCOME_WAIVER;

export const WAIVER_VERSION = "2026-10-01";

export const REQUIRED_WAIVERS = [
  { id: "fire_hazard", text: FIRE_HAZARD_WAIVER },
  { id: "metaphysical_outcomes", text: METAPHYSICAL_OUTCOME_WAIVER },
] as const;

export function allRequiredWaiversAccepted(acceptedIds: readonly string[]): boolean {
  const accepted = new Set(acceptedIds);
  return REQUIRED_WAIVERS.every((waiver) => accepted.has(waiver.id));
}

export function validateWaiverAcceptance(fireAccepted: boolean, metaphysicalAccepted: boolean): boolean {
  if (typeof fireAccepted !== "boolean" || typeof metaphysicalAccepted !== "boolean") {
    throw new Error("Both required waiver acceptances must be provided");
  }
  return fireAccepted && metaphysicalAccepted;
}

export function validateWaiverText(text: string): boolean {
  return text === FIRE_HAZARD_WAIVER || text === METAPHYSICAL_OUTCOME_WAIVER;
}
