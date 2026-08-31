"use client";

import { ArrowRight, Award, Globe2, ShieldCheck, Sparkles } from "lucide-react";

import heroImg from "@/assets/nurse-smiling.png";
import factoryImg from "@/assets/about-factory.jpg";
import { categories } from "@/lib/catalog";

import logo from "@/assets/logo.png";

// About Section
import SurgeonImage from "@/assets/anesthetist-surgery-doctor-about-section.png";
import worldVectorImage from "../assets/world-vector-image.png";

import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/site/Reveal";
import { Counter } from "@/components/site/Counter";

import { motion } from "framer-motion";
import ProductCategoriesGrid from "@/components/ProductGrid";
import HighlightsGrid from "@/components/Highlights";
import UpcomingExhibitions from "@/components/Upcomingexhibitions";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="relative h-[78vh] min-h-[560px] w-full overflow-hidden">
          <Image
            src={heroImg}
            alt="Surgical team operating under theatre lights"
            width={1920}
            height={1280}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center px-28">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full max-w-[470px] p-10 flex flex-col gap-8 bg-primary"
            >
              <span className="text-white font-medium text-xl">
                What drives us
              </span>

              <h2 className="text-white font-normal text-[35px] md:text-[36px] leading-[1.3]">
                We manufacture the precision instruments surgeons rely on around
                the world.
              </h2>

              <a
                href="#"
                className="w-fit rounded-full bg-white text-[#18B27F] font-semibold text-sm px-6 py-3.5 hover:bg-white/90 transition-colors"
              >
                Learn more about Motah Surgical
              </a>
            </motion.div>
          </div>
        </div>
        <div className="border-y border-border bg-primary-soft">
          <div className="container-page grid gap-6 py-6 text-sm font-semibold uppercase tracking-[0.16em] text-ink-soft sm:grid-cols-2 lg:grid-cols-4">
            {[
              "ISO 13485 certified",
              "CE marked",
              "EU-MDR compliant",
              "FDA registered",
            ].map((b) => (
              <div key={b} className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-primary" />
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="relative pt-32 pb-14">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <p className="eyebrow text-ink">Product range</p>
            <h2 className="mt-4 text-6xl font-medium text-primary sm:text-4xl  lg:text-5xl">
              What are you looking for ?
            </h2>
          </Reveal>

          <ProductCategoriesGrid />

          <div className="mt-14 flex justify-center">
            <Link href="/products" className="btn-base btn-ink bg-primary">
              View all products
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      {/* <section className="bg-secondary section-pad">
        <div className="container-page grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <Image
                src={factoryImg}
                alt="Technician inspecting surgical instruments in the manufacturing facility"
                loading="lazy"
                width={1200}
                height={912}
                className="w-full object-cover shadow-lift"
              />
              <div className="absolute -bottom-8 -right-4 hidden bg-primary px-9 py-7 text-primary-foreground shadow-lift sm:block">
                <div className=" text-4xl font-bold">50+</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-[0.2em] opacity-85">
                  Years of performance
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p className="eyebrow">About</p>
            <h2 className="mt-4 rule-accent  text-3xl font-bold leading-tight text-ink sm:text-4xl">
              A half-century of precision manufacturing
            </h2>
            <p className="mt-8 text-base leading-relaxed text-ink-soft">
              We have spent five decades doing one thing well: manufacturing
              surgical instruments that behave predictably in the surgeon's
              hand. Today our work reaches theatres in more than fifty countries
              through hospitals, distributors and OEM partners.
            </p>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              A catalogue of more than 10,000 patterns is only useful if every
              one of them is repeatable. In-house forging, CNC micro-machining
              and instrument-level inspection are what keep the thousandth unit
              identical to the first.
            </p>
            <Link href="/about" className="btn-base btn-primary mt-9">
              Read more <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section> */}

      <section className="relative">
        {/* Colored panel starts lower than the section so the image can overlap above it */}
        <div
          className="absolute inset-x-0 top-20 bottom-0 overflow-hidden bg-primary md:top-24"
          style={{
            backgroundImage: `url(${worldVectorImage.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        <div className="relative mx-auto max-w-[1320px] px-10 ">
          <div className="grid items-center lg:grid-cols-[45%_55%]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative aspect-[9/10] w-full max-w-[490px] rounded-xl overflow-hidden bg-gray-100"
            >
              <Image
                src={SurgeonImage}
                alt="Motah Surgical instrument manufacturing"
                fill
                sizes="(max-width: 1024px) 90vw, 490px"
                className="object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
              className="py-16 text-white lg:py-24"
            >
              <div className="flex flex-wrap items-baseline gap-x-3 mt-10">
                <span className="text-3xl font-light md:text-4xl">About</span>
                <h1 className="uppercase text-4xl font-bold">Motah Surgical</h1>
              </div>

              <p className="mt-6 max-w-xl text-lg whitespace-[20px] leading-relaxed text-white/90">
                A leading surgical instrument
                manufacturer, has made significant contributions to the
                healthcare industry for over 50 years. Operating in 50+
                countries, we have earned a reputation for quality and
                innovation. Our extensive range of over 10,000 precision
                surgical instruments reflects our commitment to customer
                satisfaction and professionalism. By embracing advanced
                technology and promoting innovation, we empower healthcare
                professionals to make a positive impact on patient lives and
                shape the future of medicine.
              </p>

              <Link
                href="/company-introduction"
                className="mt-8 inline-flex bg-primary-dark w-fit items-center rounded px-6 py-2.5 text-sm font-semibold uppercase tracking-widest text-white transition-colors"
              >
                Read more
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-pad">
        <div className="container-page">
          <Reveal className="max-w-xl">
            <p className="eyebrow text-ink">Why Professional</p>
            <h2 className="mt-4 text-3xl font-bold text-primary sm:text-4xl">
              Numbers built over decades
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-4 px-20">
            <Counter value={50} label="Years in business" />
            <Counter value={50} suffix="+" label="Countries served" />
            <Counter value={10000} suffix="+" label="Instrument types" />
            <Counter value={800} suffix="+" label="Employees" />
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="section-pad text-accent-foreground">
        <div className="container-page">
          <Reveal className="max-w-2xl pb-5">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-ink">
              Our highlights
            </p>
            <h2 className="mt-4 text-3xl text-primary font-bold sm:text-4xl lg:text-5xl">
              Where our engineering makes the difference
            </h2>
          </Reveal>

          <HighlightsGrid />
          
        </div>
      </section>

      {/* CTA */}
      <section className="pb-10">
        <UpcomingExhibitions />
      </section>
    </>
  );
}
