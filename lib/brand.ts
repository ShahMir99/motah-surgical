/**
 * Motah Surgical — brand tokens
 * ---------------------------------------------------------------
 * Palette, derived from your brand color #18B27F:
 *   brand        #18B27F   primary — buttons, links, active states,
 *                          the steel→brand "passivation" accent
 *   brand.dark   #12915F   hover / pressed states
 *   brand.light  #80D5B9   accent text/icons on dark (ink) sections
 *   brand.tint   #EDF9F5   light fills — badge backgrounds, washes
 *   ink          #0B1119   dark section background, headings on dark
 *   steel.700    #3B4652   secondary body text
 *   steel.500    #7C8891   muted labels, icons, borders on dark
 *   steel.200    #D9DEE2   hairline borders on light backgrounds
 *   steel.50     #F4F6F7   page background
 *
 * Tailwind's arbitrary-value syntax (text-[#18B27F]) needs a literal
 * string at build time, so these exact hexes are also hardcoded into
 * className strings throughout every component — this file exists for
 * the places JS needs the raw value instead (SVG gradient stops, inline
 * styles). If you ever change the brand color, update it here AND
 * find/replace the hex across components — the two can't stay in sync
 * automatically without a Tailwind config plugin.
 * ---------------------------------------------------------------
 */

export const brand = {
  DEFAULT: "#18B27F",
  dark: "#12915F",
  light: "#80D5B9",
  tint: "#EDF9F5",
} as const;

export const ink = "#0B1119";

export const steel = {
  700: "#3B4652",
  500: "#7C8891",
  200: "#D9DEE2",
  50: "#F4F6F7",
} as const;
