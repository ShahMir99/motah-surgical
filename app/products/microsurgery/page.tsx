"use client";

import { motion } from "framer-motion";
import gsImage from "@/assets/products_home/Micro-Surgery.jpg";
import Image from "next/image";

const PRIMARY = "#18B27F";
const PRIMARY_DARK = "#129468";

const categories = [
  "Artery & Dissecting Forceps",
  "Micro Scissors",
  "Mallets",
  "Clamps and Hemostats",
  "Retractors",
  "Scissors",
  "Bandage Scissors",
  "Sponge Forceps",
  "Needle Holders",
  "Forceps and Graspers",
  "Retractor Systems",
  "Speculums",
  "Dressing and Tissue Forceps",
  "Diagnostic Instruments by Professional",
  "Plaster Cast Instruments",
  "Probes and Suction Instruments",
  "Scalpels and Surgical Knives",
  "Suturing Instruments",
];

export default function PlasticSurgeoryPage() {
  return (
    <main className="bg-white text-[#4A5560]">
      {/* HERO */}
      <div className="grid grid-cols-1 md:grid-cols-[45%_55%] max-w-[1320px] mx-auto mt-10 min-h-[520px]">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-[#18B27F] text-white flex flex-col gap-8 px-7 py-14 md:px-20 md:py-20"
        >
          <span className="text-[23px] font-semibold uppercase tracking-[2px]">
            Microsurgery
          </span>
          <h1 className="font-light text-[28px] md:text-[55px] leading-[1.35] pt-14 pb-20">
            Precision tools for micro-level
            <span className="block text-[45px] font-bold tracking-[2px]">
              precision
            </span>
          </h1>
          <button className="w-fit bg-[#1E2A3B] hover:bg-[#24344A] transition-colors  text-white text-xs font-bold tracking-[1.5px] px-6 py-4">
            DOWNLOAD CATALOGUE
          </button>
        </motion.div>

        <div className="order-first md:order-last flex items-center justify-end overflow-hidden h-[750px]">
          <Image
            src={gsImage}
            alt="gernal surgery image"
            width={620}
            height={600}
          />
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-6">
        {/* INTRO */}
        <section className="pt-14">
          <h2 className="text-[#18B27F] font-bold text-[45px] mb-5">
            Microsurgery
          </h2>
          <p className="text-ink text-[18px] leading-relaxed tracking-wide">
            We understand that in microsurgery, even the smallest movement
            matters. That’s why our instruments are engineered for the highest
            level of sensitivity and control, ensuring that every movement you
            make is translated accurately at the microscopic scale.
          </p>
        </section>

        {/* FEATURED CATEGORIES */}
        <section className="pt-16">
          <h2 className="text-[#18B27F] font-bold text-[45px] mb-5">
            Featured Categories
          </h2>

          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-3 mb-8">
            {categories.map((cat, i) => (
              <motion.li
                key={cat}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex items-center gap-2 font-semibold text-[#1C3350] text-[18px]"
              >
                <span
                  aria-hidden
                  className="w-0 h-0 border-y-[5px] border-y-transparent border-l-[7px] border-l-[#18B27F] shrink-0"
                />
                <a href="#" className="hover:text-[#129468] transition-colors">
                  {cat}
                </a>
              </motion.li>
            ))}
          </ul>

          <button className="bg-[#1E2A3B] hover:bg-[#24344A] transition-colors text-white text-xs font-bold tracking-[1.5px] px-6 py-4">
            VIEW ALL PRODUCTS
          </button>
        </section>

        {/* MEDIA */}
        <section className="pt-20 pb-24 text-center">
          <h2 className="text-[#18B27F] font-bold text-[32px] inline-block mb-2">
            Media
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-[230px] mx-auto mt-8 border border-[#E7E9EB] shadow-[0_4px_14px_rgba(0,0,0,0.06)] text-left"
          >
            <MediaThumbnail />
            <p className="font-bold text-sm text-[#222] px-3.5 pt-3 pb-4">
              General Surgery Catalogue
            </p>
          </motion.div>
        </section>
      </div>
    </main>
  );
}

function MediaThumbnail() {
  return (
    <svg viewBox="0 0 300 340" className="w-full h-auto block">
      <rect width="300" height="340" fill="#fff" />
      <rect width="300" height="150" fill={PRIMARY} />
      <rect y="150" width="300" height="30" fill="#A9E2CC" />
      <g stroke="#8A8F94" strokeWidth={2} strokeLinecap="round">
        <line x1="60" y1="130" x2="150" y2="30" />
        <line x1="90" y1="140" x2="190" y2="25" />
        <line x1="140" y1="150" x2="230" y2="55" />
      </g>
      <circle cx="150" cy="30" r="6" fill={PRIMARY_DARK} />
      <rect
        x="75"
        y="115"
        width="12"
        height="26"
        rx="4"
        fill="#C7963B"
        transform="rotate(20 81 128)"
      />
      <rect
        x="215"
        y="45"
        width="11"
        height="20"
        rx="4"
        fill="#B5442E"
        transform="rotate(-15 220 55)"
      />
      <text
        x="20"
        y="205"
        fontFamily="Poppins, sans-serif"
        fontWeight={700}
        fontSize={15}
        fill={PRIMARY}
      >
        Catalog
      </text>
      <text
        x="20"
        y="225"
        fontFamily="Inter, sans-serif"
        fontSize={9}
        fill="#666"
      >
        Catalog type
      </text>
      <text
        x="20"
        y="238"
        fontFamily="Inter, sans-serif"
        fontSize={9}
        fill="#666"
      >
        Canule de liposuction
      </text>
      <text
        x="20"
        y="251"
        fontFamily="Inter, sans-serif"
        fontSize={9}
        fill="#666"
      >
        Cánula de liposucción
      </text>
    </svg>
  );
}
