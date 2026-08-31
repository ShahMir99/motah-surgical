"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import exibation from "@/assets/exhibation.jpeg"

export default function UpcomingExhibitions() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1320px] px-14">
        <div className="grid items-center lg:grid-cols-[40%_60%]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="pl-16"
          >
            <h2 className="text-5xl font-light leading-tight text-primary md:text-5xl">
              <span className="block">Upcoming</span>
              <span className="block">Exhibitions</span>
            </h2>
            <p className="mt-5 text-xl max-w-[300px] font-semibold uppercase tracking-wide text-gray-900">
              Global Health Exhibition, Riyadh (Malham), Oct 26–29, 2026
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
              src={exibation}
              alt="Motah Surgical at an upcoming exhibition"
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