"use client";

import { motion } from "framer-motion";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import image1 from "@/assets/1.png";
import image2 from "@/assets/2.png";
import image3 from "@/assets/3.png";
import image4 from "@/assets/4.png";
import type { HomeHighlight } from "@/types/home";

// Used for a card until an image is uploaded for it.
const FALLBACK_IMAGES: StaticImageData[] = [image1, image2, image3, image4];

export default function HighlightsGrid({ items }: { items: HomeHighlight[] }) {
  return (
    <section className="bg-white py-5">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.08 }}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl"
            >
              <Image
                src={item.image?.url ?? FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]}
                alt={item.image?.alt || item.heading}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div
                className={`absolute inset-0 flex flex-col items-center justify-center px-8 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                  i % 2 === 0 ? "bg-primary" : "bg-primary-dark"
                }`}
              >
                <h3 className="text-xl font-bold text-white md:text-[27px]">{item.heading}</h3>
                <p className="mt-3 max-w-lg text-base leading-relaxed text-white/90">{item.blurb}</p>
                {item.href && (
                  <Link
                    href={item.href}
                    className="mt-6 inline-flex w-fit items-center rounded-xl bg-[#1E2A3B] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#24344A]"
                  >
                    Explore
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
