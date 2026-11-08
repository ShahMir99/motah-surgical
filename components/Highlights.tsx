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

              {/*
                There is no hover on a touch screen, so below lg the caption
                is always on, sitting on a gradient scrim that keeps the photo
                visible. From lg up this is the original full-cover panel that
                fades in on hover: `lg:bg-none` drops the gradient and
                `lg:bg-<brand>` paints the same solid colour as before.
              */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-end px-5 pb-6 text-center transition-opacity duration-300 sm:px-8 lg:justify-center lg:bg-none lg:pb-0 lg:opacity-0 lg:group-hover:opacity-100 ${
                  i % 2 === 0
                    ? "bg-gradient-to-t from-primary from-55% via-primary/85 via-80% to-transparent lg:bg-primary"
                    : "bg-gradient-to-t from-primary-dark from-55% via-primary-dark/85 via-80% to-transparent lg:bg-primary-dark"
                }`}
              >
                <h3 className="text-lg font-bold text-white sm:text-xl md:text-[27px]">{item.heading}</h3>
                <p className="mt-2.5 line-clamp-3 max-w-lg text-sm leading-relaxed text-white/90 sm:mt-3 sm:text-base lg:line-clamp-none">
                  {item.blurb}
                </p>
                {item.href && (
                  <Link
                    href={item.href}
                    className="mt-4 inline-flex w-fit items-center rounded-xl bg-[#1E2A3B] px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#24344A] sm:mt-6 sm:px-6 sm:py-3 sm:text-xs sm:tracking-widest"
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
