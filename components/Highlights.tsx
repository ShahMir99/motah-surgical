"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import image1 from "@/assets/1.png";
import image2 from "@/assets/2.png";
import image3 from "@/assets/3.png";
import image4 from "@/assets/4.png";

export interface Highlight {
  label: string;
  heading: string;
  blurb: string;
  image: any;
  href: string;
}

export const highlights: readonly Highlight[] = [
  {
    label: "Building Sovereign Healthcare",
    heading: "Building Sovereign Healthcare",
    blurb:
      "We are committed to building strong national healthcare supply chains by delivering world-class, SFDA-compliant surgical instruments directly inside the Kingdom. Backed by a lifetime guarantee, our localized operations ensure Saudi hospitals maintain uninterrupted access to precision tools for critical care.",
    image: image1,
    href: "/about/mission-vision",
  },
  {
    label: "Micro-Precision Engineering",
    heading: "Micro-Precision Engineering",
    blurb:
      "Master fine-tissue manipulation with our research-backed microsurgical instruments. Specialized for complex micro-vascular procedures, our high-grade tools deliver exceptional balance and ultra-fine tactile control where every millimeter counts.",
    image: image2,
    href: "/products/microsurgery",
  },
  {
    label: "Precision Rhinoplasty Solutions",
    heading: "Precision Rhinoplasty Solutions",
    blurb:
      "Elevate surgical outcomes in nasal procedures with our specialized rhinoplasty instruments. Engineered for exact balance and fine tactile feedback, our tools deliver the control required to achieve refined aesthetic results.",
    image: image3,
    href: "/products/ear-nose-throat-surgery",
  },
  {
    label: "Expanding Global Presence",
    heading: "Expanding Global Presence",
    blurb:
      "Motah Surgical actively projects Saudi manufacturing capability onto the international stage through key regional medical exhibitions. By showcasing our SFDA-compliant instruments across global healthcare platforms, we advance Saudi Vision 2030 and integrate local precision into worldwide surgical supply chains.",
    image: image4,
    href: "/about/company-introduction",
  },
];

export default function HighlightsGrid() {
  return (
    <section className="bg-white py-5">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {highlights.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl"
            >
              <Image
                src={item.image}
                alt={item.heading}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div
                className={`absolute inset-0 flex flex-col items-center justify-center px-8 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                  i % 2 === 0 ? "bg-primary" : "bg-primary-dark"
                }`}
              >
                <h3 className="text-xl font-bold text-white md:text-[27px]">
                  {item.heading}
                </h3>
                <p className="mt-3 max-w-lg text-base leading-relaxed text-white/90">
                  {item.blurb}
                </p>
                <Link
                  href={item.href}
                  className="mt-6 inline-flex w-fit items-center rounded-xl bg-[#1E2A3B] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#24344A]"
                >
                  Explore
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
