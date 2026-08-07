/**
 * Static badge content not covered by the registration/event API.
 * The dynamic parts (name, photo, event title, dates, location) come
 * from the registration response instead of living here.
 *
 * TODO: confirm `apotheoseVenue` if the closing day happens at a different
 * venue than the main event location.
 */
export const BADGE_CONTENT = {
  /** Circular organizer logo drawn in the top-left corner of the badge. */
  logoPath: "/logo.png",
  bibleVerse: "1 SAMUEL 7 : 12",
  theme: "HOSANNA",
  entryNote: "ENTRÉE LIBRE & GRATUITE",
  ctaLine1: "J'Y",
  ctaLine2: "SERAI",
  /** Falls back to the event location when not overridden. */
  apotheoseVenue: null as { name: string; city: string } | null,
  /**
   * Optional very-low-opacity flyer background drawn behind the badge.
   * Drop the file at frontend/public/badge/hero-background.jpg (or .png)
   * and it will be picked up automatically — safely skipped if missing.
   */
  backgroundImagePath: "/badge/hero-background.jpg",
  backgroundImageOpacity: 0.16,
};
