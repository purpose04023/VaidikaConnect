export const REMINDER_OFFSETS_DAYS = [14, 7, 3] as const;

export interface ReminderCandidate {
  daysRemaining: number;
  scheduledFor: Date;
  dedupeKey: string;
}

export function getReminderCandidates(
  ceremonyAt: string | Date,
  bookingId: string,
): ReminderCandidate[] {
  const ceremony = ceremonyAt instanceof Date ? ceremonyAt : new Date(ceremonyAt);
  if (Number.isNaN(ceremony.getTime()) || !bookingId.trim()) return [];
  return REMINDER_OFFSETS_DAYS.map((daysRemaining) => ({
    daysRemaining,
    scheduledFor: new Date(ceremony.getTime() - daysRemaining * 86_400_000),
    dedupeKey: `${bookingId}:${daysRemaining}`,
  }));
}

export function shouldSendReminder(daysRemaining: number): boolean {
  return (REMINDER_OFFSETS_DAYS as readonly number[]).includes(daysRemaining);
}

export function scheduleNotification(
  bookingId: string,
  ceremonyAt: string | Date,
  phone: string,
  pujaName: string,
  daysRemaining: number,
) {
  if (!bookingId.trim() || !phone.trim() || !pujaName.trim()) throw new Error("Missing notification details");
  if (!shouldSendReminder(daysRemaining)) return null;
  const ceremony = ceremonyAt instanceof Date ? ceremonyAt : new Date(ceremonyAt);
  if (Number.isNaN(ceremony.getTime())) throw new Error("Invalid ceremony date");
  return {
    bookingId,
    phone,
    pujaName,
    daysRemaining,
    scheduledFor: new Date(ceremony.getTime() - daysRemaining * 86_400_000),
    dedupeKey: `${bookingId}:${daysRemaining}`,
    message: `Namaskaram! Your ${pujaName} is scheduled soon. ${daysRemaining} days remaining.`,
  };
}
