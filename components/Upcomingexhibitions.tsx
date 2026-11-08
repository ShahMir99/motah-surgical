"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import exibation from "@/assets/exhibation.jpeg";
import type { HomeContent } from "@/types/home";

export default function UpcomingExhibitions({ content }: { content: HomeContent["exhibition"] }) {
  return (
    <section className="bg-white py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-14">
        <div className="grid items-center gap-8 lg:grid-cols-[40%_60%] lg:gap-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:pl-8"
          >
            <h2 className="text-3xl font-light leading-tight text-primary sm:text-4xl md:text-5xl">
              <span className="block">{content.titleTop}</span>
              <span className="block">{content.titleBottom}</span>
            </h2>
            <p className="mt-4 max-w-[380px] text-base font-semibold uppercase tracking-wide text-gray-900 sm:mt-5 sm:text-lg md:text-xl">
              {content.text}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
            className="relative aspect-[6/3] w-full overflow-hidden rounded-2xl bg-gray-100"
          >
            <Image
              src={content.image?.url ?? exibation}
              alt={content.image?.alt || "Motah Surgical at an upcoming exhibition"}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
