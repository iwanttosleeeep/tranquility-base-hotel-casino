const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

function localCalendarDay(date: Date): number {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Return the guest's current numbered hotel night in the browser's local
 * timezone. The registration date is NIGHT 001 and the counter advances at
 * local midnight, independently of sign-out or room occupancy.
 */
export function guestNight(checkedInAt: Date, now: Date): number {
  const elapsedCalendarDays = Math.floor(
    (localCalendarDay(now) - localCalendarDay(checkedInAt)) / MILLISECONDS_PER_DAY,
  );

  return Math.max(1, elapsedCalendarDays + 1);
}

export function formatGuestNight(night: number): string {
  return `NIGHT ${night.toString().padStart(3, "0")}`;
}
