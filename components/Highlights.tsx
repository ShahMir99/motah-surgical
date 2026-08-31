"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import Years50Healthcare from "@/assets/50YearsHealthcare.png";
import liproscopySimulation1 from "@/assets/liproscopySimulation-1.png";
import rhinoplasty from "@/assets/rhinoplasty.png";
import globalPresence from "@/assets/globalPresence.png";

interface Highlight {
  label: string;
  heading: string;
  blurb: string;
  image: any;
}

const highlights: Highlight[] = [
  {
    label: "50 Years in Healthcare",
    heading: "50 Years in Healthcare",
    blurb:
      "For 50 extraordinary years, Professional Hospital has relentlessly pursued excellence in the healthcare field, revolutionizing surgical instruments and saving lives worldwide. Join us as we embark on the next chapter of innovation and success.",
    image: Years50Healthcare,
  },
  {
    label: "Laparoscopic Simulators",
    heading: "Laparoscopic Simulators",
    blurb:
      "Unleash your surgical prowess with Professional Hospital's revolutionary laparoscopic trainers. Master the art of minimally invasive surgery, and elevate your expertise to new heights with our state-of-the-art training solutions.",
    image: liproscopySimulation1,
  },
  {
    label: "Rhinoplasty Instruments",
    heading: "Rhinoplasty Instruments",
    blurb:
      "Achieve aesthetic perfection in rhinoplasty procedures with Professional Hospital's advanced rhinoplasty instruments. Experience precision, control, and superior outcomes, enhancing your ability to sculpt the ideal nasal contours with confidence.",
    image: rhinoplasty,
  },
  {
    label: "Global Presence",
    heading: "Global Presence",
    blurb:
      "Professional exhibited at the prestigious South East Asia healthcare exhibition in Kuala Lumpur, as we extend our global outreach, showcasing our innovative surgical solutions to healthcare professionals across the region.",
    image: globalPresence,
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
                  href="/products"
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
