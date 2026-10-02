"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import heroImg from "@/assets/hero-section.jpeg";
import type { HomeContent } from "@/types/home";

export default function HomeHero({ content }: { content: HomeContent["hero"] }) {
  return (
    <div className="relative h-[85vh] min-h-[560px] w-full overflow-hidden">
      <Image
        src={content.image?.url ?? heroImg}
        alt={content.image?.alt || "Surgical team operating under theatre lights"}
        width={1920}
        height={1280}
        priority
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 flex items-center px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex w-full max-w-[460px] flex-col gap-3 bg-primary p-10"
        >
          {content.eyebrow && <span className="text-xl font-medium text-white">{content.eyebrow}</span>}

          <h2 className="text-[35px] font-normal leading-[1.3] text-white md:text-[39px]">{content.heading}</h2>

          {content.buttonLabel && (
            <Link
              href={content.buttonHref || "#"}
              className="mt-6 w-fit rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#18B27F] transition-colors hover:bg-white/90"
            >
              {content.buttonLabel}
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  );
}
