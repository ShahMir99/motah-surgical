"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import heroImg from "@/assets/hero-section.jpeg";
import type { HomeContent } from "@/types/home";

export default function HomeHero({ content }: { content: HomeContent["hero"] }) {
  return (
    <div className="relative h-[72vh] min-h-[430px] w-full overflow-hidden sm:h-[78vh] sm:min-h-[500px] lg:h-[85vh] lg:min-h-[560px]">
      <Image
        src={content.image?.url ?? heroImg}
        alt={content.image?.alt || "Surgical team operating under theatre lights"}
        width={1920}
        height={1280}
        priority
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 flex items-center px-5 sm:px-10 md:px-14 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex w-full max-w-[460px] flex-col gap-3 bg-primary p-6 sm:p-8 lg:p-10"
        >
          {content.eyebrow && (
            <span className="text-base font-medium text-white sm:text-lg lg:text-xl">{content.eyebrow}</span>
          )}

          <h2 className="text-[25px] font-normal leading-[1.3] text-white sm:text-[31px] md:text-[39px]">
            {content.heading}
          </h2>

          {content.buttonLabel && (
            <Link
              href={content.buttonHref || "#"}
              className="mt-5 w-fit rounded-full bg-white px-5 py-3 text-[13px] font-semibold text-[#18B27F] transition-colors hover:bg-white/90 sm:mt-6 sm:px-6 sm:py-3.5 sm:text-sm"
            >
              {content.buttonLabel}
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  );
}
