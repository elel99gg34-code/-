/* Shorthands shared by every family module, so the instrument tables stay
 * readable at a glance. */

/** ADSR in seconds; `s` is a 0..1 level, not a time. */
export const env = (a, d, s, r) => ({ a, d, s, r });

/** Classic 808-style hat: six inharmonic square partials. */
export const HAT_PARTIALS = [1, 1.342, 1.7183, 2.0473, 2.6415, 3.1213];

/** Eight partials, stretched further apart — the cymbal wash. */
export const CYM_PARTIALS = [1, 1.411, 1.8372, 2.4131, 2.9631, 3.7412, 4.4419, 5.7133];

/** A tighter, brighter set for splashes and small metal. */
export const BELL_PARTIALS = [1, 2.756, 5.404, 8.933, 13.34, 18.64];

/** Struck-bar partials (marimba / vibraphone family). */
export const BAR_PARTIALS = [1, 3.93, 10.9, 20.4];
