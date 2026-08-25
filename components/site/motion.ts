"use client";

import type { Variants } from "framer-motion";

/**
 * Shared Framer Motion variants. Every page imports these rather than
 * redefining its own — that's what makes the motion read as one
 * coherent system across five pages instead of five pages that just
 * happen to share a color.
 */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

export const sealVariant: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export const viewportOnce = { once: true, amount: 0.25 } as const;
