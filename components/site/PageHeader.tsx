"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/components/site/motion";

/**
 * The smaller sibling of the home page hero — same ink background, same
 * steel-to-brand gradient wash, same eyebrow/H1 rhythm, just shorter.
 * This is what makes "every page feel the same site" rather than each
 * inner page reading like a different template.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-[#0B1119] py-24 lg:py-28">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(11,17,25,1) 0%, rgba(11,17,25,.9) 45%, rgba(18,145,95,.28) 78%, rgba(24,178,127,.16) 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="relative mx-auto max-w-4xl px-6 text-center"
      >
        <motion.span
          variants={fadeUp}
          className="inline-flex items-center gap-2 rounded-full border border-[#18B27F]/40 bg-[#18B27F]/10 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#80D5B9]"
        >
          {eyebrow}
        </motion.span>
        <motion.h1
          variants={fadeUp}
          className="mt-7 font-display text-4xl font-extrabold leading-[1.1] text-white md:text-5xl"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p variants={fadeUp} className="mx-auto mt-5 max-w-2xl text-white/70">
            {description}
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}
