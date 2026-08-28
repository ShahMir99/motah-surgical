"use client";

import { motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";

import laryngoscopy from "@/assets/products_home/Laryngoscopy.jpg";
import liposuction from "@/assets/products_home/Liposuction.jpg";
import microSurgery from "@/assets/products_home/Micro-Surgery.jpg";
import generalSurgery from "@/assets/products_home/gernal-surgery.png";
import gynaecology from "@/assets/products_home/Gynaecology.jpg";
import eyeSurgery from "@/assets/products_home/Eye-Surgery.jpg";
import entSurgery from "@/assets/products_home/ENT-Surgery.jpg";
import dentistry from "@/assets/products_home/Dentistry.jpg";
import cardioVascular from "@/assets/products_home/Cardio-Vascular.jpg";
import arthroscopy from "@/assets/products_home/Arthoscopy.jpg"; 
 

const LABEL_COLOR = "#1C3350";

interface Category {
  label: string;
  image: StaticImageData;
}
 
const categories: Category[] = [
  { label: "Arthroscopy (New)", image: arthroscopy },
  { label: "Cardiovascular Surgery", image: cardioVascular },
  { label: "Dental Surgery", image: dentistry },
  { label: "Ear, Nose & Throat Surgery", image: entSurgery },
  { label: "Eye Instruments", image: eyeSurgery },
  { label: "General Surgery", image: generalSurgery },
  { label: "Gynaecology", image: gynaecology },
  { label: "Laryngoscopes", image: laryngoscopy },
  { label: "Liposuction", image: liposuction },
  { label: "Microsurgery", image: microSurgery },
];

export default function ProductCategoriesGrid() {
  return (
    <section className="bg-white pt-16">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat, i) => (
            <motion.a
              key={cat.label}
              href="#"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="group block overflow-hidden rounded-2xl  border border-gray-100 bg-white shadow-lg transition-shadow duration-300 hover:shadow-lg"
            >
              <div className="relative aspect-[4/2] w-full overflow-hidden ">
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105 p-2"
                />
              </div>
              <div className=" px-4 py-4 text-center">
                <span
                  className="text-[16px] font-bold uppercase tracking-wide"
                  style={{ color: LABEL_COLOR }}
                >
                  {cat.label}
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}