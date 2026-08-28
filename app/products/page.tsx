"use client";

import React from "react";
import { Download } from "lucide-react";
import { StaticImageData } from "next/image";

import laryngoscopy from "@/assets/products_home/Laryngoscopy.jpg";
import liposuction from "@/assets/products_home/Liposuction.jpg";
import microSurgery from "@/assets/products_home/Micro-Surgery.jpg";
import generalSurgery from "@/assets/products_home/gernal-surgery.png";
import Gynaecology from "@/assets/products_home/Gynaecology.jpg";
import eyeSurgery from "@/assets/products_home/Eye-Surgery.jpg";
import entSurgery from "@/assets/products_home/ENT-Surgery.jpg";
import dentistry from "@/assets/products_home/Dentistry.jpg";
import cardioVascular from "@/assets/products_home/Cardio-Vascular.jpg";
import arthroscopy from "@/assets/products_home/Arthoscopy.jpg"; 
import Orthopedics from "@/assets/products_home/arthopedic.jpg"; 
import neurosurgery from "@/assets/products_home/neurosurgery.jpg"; 

interface ProductCategory {
  name: string;
  badge?: string;
  description: string;
  image: StaticImageData;
}

const productCategories: ProductCategory[] = [
  {
    name: "General Surgery",
    description:
      "We understand the critical role that precision and reliability play in surgical procedures, which is why we offer a wide range of general surgery instruments built to the highest standard.",
    image: generalSurgery,
  },
  {
    name: "Ear, Nose & Throat Surgery",
    description:
      "Professional Hospital offers a comprehensive range of high-quality ENT instruments for ear, nose, and throat procedures. Our precision-crafted instruments are trusted by surgeons worldwide.",
    image: entSurgery,
  },
  {
    name: "Orthopedics",
    description:
      "Discover a wide array of orthopedic instruments, including bone saws, drills, reamers, retractors, forceps, and more. Each instrument is ergonomically designed for surgeon comfort and control.",
    image: Orthopedics,
  },
  {
    name: "Arthroscopy",
    badge: "New",
    description:
      "Professional Arthroscopy Instruments are specifically designed for minimally invasive joint procedures. These instruments offer precise control, visibility, and access during complex procedures.",
    image: arthroscopy,
  },
  {
    name: "Neurosurgery",
    badge: "New",
    description:
      "Unlocking precision and potential: Professional's neurosurgery instruments are meticulously designed to empower surgeons with the tools they need to perform delicate procedures with confidence.",
    image: neurosurgery,
  },
  {
    name: "Gynaecology",
    description:
      "Our gynecology instruments category encompasses a wide range of specialized tools tailored to the unique needs of gynecological procedures, from routine exams to complex surgeries.",
    image: Gynaecology,
  },
  {
    name: "Eye Instruments",
    description:
      "Our eye instruments are engineered with a keen focus on the intricate and delicate nature of eye procedures. Each instrument is crafted for exceptional precision and control.",
    image: eyeSurgery,
  },
  {
    name: "Microsurgery",
    description:
      "We understand that in microsurgery, even the smallest movement matters. That's why our instruments are engineered for the highest level of precision and reliability.",
    image: microSurgery,
  },
];

function Hero() {
  return (
    <section className="relative">
      <img
        src="https://placehold.co/1600x520/16303d/16303d?text=+"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-primary-dark" />

      <div className="relative mx-auto flex max-w-6xl flex-col lg:h-[360px] lg:flex-row">
        <div className="relative flex w-full h-[440px] flex-col justify-center bg-[#02ac75] px-8 py-14 lg:w-[510px] lg:shrink-0 lg:px-16 lg:py-0">
          <p className="mb-4 text-xl font-bold tracking-[0.3em] text-white">
            PRODUCTS
          </p>
          <h1 className="text-3xl font-light leading-tight text-white lg:text-[2.8rem]">
            Precision <br className="hidden lg:block" />
            Instruments for{" "}
            <span className="font-bold">Optimal Surgical Performance</span>
          </h1>
          <button
            type="button"
            className="mt-8 w-fit rounded-xl bg-primary-dark px-6 py-3 text-base font-semibold tracking-wider text-white transition-colors hover:bg-[#0F2A38]"
          >
            DOWNLOAD CATALOGUE
          </button>
        </div>

        <div className="flex items-center px-8 py-10 lg:px-16 lg:py-0">
          <p className="w-full text-lg leading-relaxed text-white/90">
            Experience surgical excellence with our precision instruments. Our
            innovative craftsmanship and commitment to quality redefine
            surgical performance. From scalpels to forceps, scissors to
            speculums, our meticulously crafted tools offer unmatched
            precision and reliability. Elevate your surgical outcomes with
            instruments designed for excellence.
          </p>
        </div>
      </div>
    </section>
  );
}

function ProductRow({
  category,
  imageOnLeft,
}: {
  category: ProductCategory;
  imageOnLeft: boolean;
}) {
  return (
    <div
      className={`mx-auto flex max-w-7xl flex-col items-center gap-10 px-6 py-14 lg:gap-20 lg:px-10 lg:py-20 ${
        imageOnLeft ? "lg:flex-row-reverse" : "lg:flex-row"
      }`}
    >
      <div className="w-full lg:w-1/2">
        <h3 className="mb-5 text-4xl font-bold text-[#02ac75] lg:text-4xl">
          {category.name}
          {category.badge && (
            <span className="ml-2 text-xl font-semibold text-slate-400">
              ({category.badge})
            </span>
          )}
        </h3>
        <p className="mb-7 max-w-lg text-lg font-normal leading-relaxed text-slate-700 line-clamp-2">
          {category.description}
        </p>
        <button
          type="button"
          className="rounded-full bg-primary-dark px-7 py-3.5 text-xs font-bold tracking-wide text-white transition-colors hover:bg-[#0F2A38]"
        >
          VIEW PRODUCTS
        </button>
      </div>

      <div className="w-full lg:w-1/2">
        <div className="flex">
          <div className="flex flex-col">
            <div className="w-[20px] h-[88%] bg-primary"/>
            <div className="w-[20px] h-[12%] bg-primary-dark"/>
          </div>
          <img
            src={category.image.src}
            alt={category.name}
            className="h-96 w-full object-cover object-top lg:h-[370px]"
          />
        </div>
      </div>
    </div>
  );
}

function ProductsSection() {
  return (
    <section className="bg-white pt-32">
      <div className="mx-auto max-w-7xl px-6 pt-16 text-center lg:px-10">
        <h2 className="text-3xl font-light text-[#02ac75] lg:text-4xl">
          All Products
        </h2>
      </div>
      <div className="mt-6 divide-y divide-slate-100">
        {productCategories.map((category, index) => (
          <ProductRow
            key={category.name}
            category={category}
            imageOnLeft={index % 2 === 1}
          />
        ))}
      </div>
    </section>
  );
}

function CtaBanner() {
  return (
    <section className="bg-primary-dark border-b border-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row lg:px-10">
        <p className="text-sm font-bold tracking-wide text-white">
          WANT TO KNOW MORE ABOUT PROFESSIONAL?
        </p>
        <button
          type="button"
          className="flex items-center gap-2 rounded bg-[#02ac75] px-5 py-2.5 text-xs font-bold tracking-wide text-white transition-colors hover:bg-[#029764]"
        >
          <Download className="h-4 w-4" /> DOWNLOAD CATALOGUE
        </button>
      </div>
    </section>
  );
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <ProductsSection />
      <CtaBanner />
    </div>
  );
}