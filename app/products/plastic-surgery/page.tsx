'use client';

import { motion } from 'framer-motion';
import gsImage from "@/assets/plastic-surgery.jpg"
import Image from 'next/image';

const PRIMARY = '#18B27F';
const PRIMARY_DARK = '#129468';

const categories = [
  'Accessories',
  'Infiltrators',
  'Aspirators & Harvesters',
  'Specialty Cannulas',
  'Micro Injectors',
  'Curved Injectors',
  'Single Use Cannulas',
  'Cannula Handles',
  'Liposuction Cannula Sets',
];

export default function LiposuctionCategoryPage() {
  return (
    <main className="bg-white text-[#4A5560]">
      {/* HERO */}
      <div className="grid grid-cols-1 md:grid-cols-[45%_55%] max-w-[1320px] mx-auto mt-10 min-h-[520px]">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="bg-[#18B27F] text-white flex flex-col justify-center gap-8 px-7 py-14 md:px-12 md:py-14"
        >
          <span className="text-[13px] font-bold tracking-[2px]">Plastic Surgery</span>
          <h1 className="font-light text-[28px] md:text-[42px] leading-[1.25]">
            Products for Transforming Lives
          </h1>
          <button className="w-fit bg-[#1E2A3B] hover:bg-[#24344A] transition-colors text-white text-xs font-bold tracking-[1.5px] px-6 py-4">
            DOWNLOAD CATALOGUE
          </button>
        </motion.div>

        <div className="order-first md:order-last flex items-center justify-end overflow-hidden min-h-[320px]">
          <Image src={gsImage} alt='gernal surgery image' width={620} height={600} />
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-6">
        {/* INTRO */}
        <section className="pt-14">
          <h2 className="text-[#18B27F] font-bold text-[30px] mb-5">Liposuction</h2>
          <p className="max-w-[1100px] text-base leading-relaxed">
            Liposuction demands a surgeon&apos;s steady hand and instruments built to match that
            precision. Every cannula, injector, and handle in our range is engineered for
            controlled aspiration, smooth contouring, and consistent results across procedures. We
            manufacture with the balance every surgical team needs — strong enough to perform
            reliably, refined enough for the most delicate body-sculpting work. From single-use
            cannulas to full liposuction sets, our tools are made to support safe, efficient, and
            repeatable outcomes.
          </p>
        </section>

        {/* FEATURED CATEGORIES */}
        <section className="pt-16">
          <h2 className="text-[#18B27F] font-bold text-[30px] mb-5">Featured Categories</h2>

          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-3.5 mb-8">
            {categories.map((cat, i) => (
              <motion.li
                key={cat}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex items-center gap-2.5 font-bold text-[#1C3350] text-[15px]"
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
          <h2 className="text-[#18B27F] font-bold text-[32px] inline-block mb-2">Media</h2>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-[230px] mx-auto mt-8 border border-[#E7E9EB] shadow-[0_4px_14px_rgba(0,0,0,0.06)] text-left"
          >
            <MediaThumbnail />
            <p className="font-bold text-sm text-[#222] px-3.5 pt-3 pb-4">
              Liposuction PDF Catalogue Request
            </p>
          </motion.div>
        </section>
      </div>
    </main>
  );
}

/** Original stand-in graphic (generic instrument shapes) — replace with real product SVG art */
function HeroIllustration() {
  return (
    <svg viewBox="0 0 600 600" className="w-full h-full max-h-[600px]">
      <rect width="600" height="600" fill="#F4F5F6" />
      <g stroke="#8A8F94" strokeWidth={3} strokeLinecap="round">
        <line x1="120" y1="500" x2="330" y2="90" />
        <line x1="180" y1="520" x2="400" y2="80" />
        <line x1="260" y1="540" x2="470" y2="140" />
        <line x1="90" y1="430" x2="230" y2="150" />
      </g>
      <circle cx="330" cy="90" r="14" fill={PRIMARY_DARK} />
      <rect x="380" y="60" width="22" height="46" rx="6" fill="#1E2A3B" transform="rotate(-25 391 83)" />
      <rect x="150" y="470" width="26" height="60" rx="8" fill="#C7963B" transform="rotate(20 163 500)" />
      <rect x="450" y="120" width="24" height="40" rx="6" fill="#B5442E" transform="rotate(-15 462 140)" />
      <circle cx="230" cy="150" r="10" fill="#5A6470" />
      <rect x="60" y="400" width="30" height="50" rx="10" fill="#9AA0A6" transform="rotate(30 75 425)" />
    </svg>
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
      <rect x="75" y="115" width="12" height="26" rx="4" fill="#C7963B" transform="rotate(20 81 128)" />
      <rect x="215" y="45" width="11" height="20" rx="4" fill="#B5442E" transform="rotate(-15 220 55)" />
      <text x="20" y="205" fontFamily="Poppins, sans-serif" fontWeight={700} fontSize={15} fill={PRIMARY}>
        Liposuction Cannula
      </text>
      <text x="20" y="225" fontFamily="Inter, sans-serif" fontSize={9} fill="#666">
        Liposuction-Kanülen
      </text>
      <text x="20" y="238" fontFamily="Inter, sans-serif" fontSize={9} fill="#666">
        Canule de liposuction
      </text>
      <text x="20" y="251" fontFamily="Inter, sans-serif" fontSize={9} fill="#666">
        Cánula de liposucción
      </text>
    </svg>
  );
}