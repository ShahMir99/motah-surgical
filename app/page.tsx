"use client";

import { ArrowRight, Award, Globe2, ShieldCheck, Sparkles } from "lucide-react";

import heroImg from "@/assets/nurse-smiling.png";
import factoryImg from "@/assets/about-factory.jpg";
import { categories } from "@/lib/catalog";
import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/site/Reveal";
import { Counter } from "@/components/site/Counter";

import { motion } from "framer-motion";

const highlights = [
  {
    icon: Award,
    title: "50 Years in Healthcare",
    body: "Five decades of relentless refinement in surgical instrumentation, from the first forceps to today's micro-engineered systems.",
  },
  {
    icon: Sparkles,
    title: "Laparoscopic Simulators",
    body: "Training platforms that let surgical teams rehearse minimally invasive technique with realistic tissue feedback.",
  },
  {
    icon: ShieldCheck,
    title: "Rhinoplasty Instruments",
    body: "Rasps, osteotomes and elevators built for the control that aesthetic nasal surgery demands.",
  },
  {
    icon: Globe2,
    title: "Global Presence",
    body: "Exhibiting from Düsseldorf to Kuala Lumpur, bringing our catalogue directly to clinicians worldwide.",
  },
];

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
      <section className="section-pad">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Product range</p>
            <h2 className="mt-4  text-3xl font-bold text-ink sm:text-4xl lg:text-5xl">
              Find your specialty
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Ten thousand instruments organised by specialty, each finished,
              tested and traceable to the bench it was made on.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c, i) => (
              <Reveal key={c.slug} delay={i * 70}>
                <Link
                  href="/products"
                  className="group block h-full overflow-hidden border border-border bg-card shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-lift"
                >
                  <div className="overflow-hidden bg-muted">
                    <img
                      src={c.image.src}
                      alt={c.name}
                      loading="lazy"
                      width={800}
                      height={600}
                      className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-7">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                      {c.count}
                    </p>
                    <h3 className="mt-3  text-xl font-bold text-ink transition-colors group-hover:text-primary">
                      {c.name}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {c.blurb}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-ink transition-all group-hover:gap-3 group-hover:text-primary">
                      Explore <ArrowRight size={15} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="mt-14 flex justify-center">
            <Link href="/products" className="btn-base btn-ink bg-primary">
              View all products
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="bg-secondary section-pad">
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
      </section>

      {/* Stats */}
      <section className="section-pad">
        <div className="container-page">
          <Reveal className="max-w-xl">
            <p className="eyebrow">Why Professional</p>
            <h2 className="mt-4 text-3xl font-bold text-ink sm:text-4xl">
              Numbers built over decades
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
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
          <Reveal className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
              Our highlights
            </p>
            <h2 className="mt-4 text-3xl text-ink font-bold sm:text-4xl lg:text-5xl">
              Where our engineering makes the difference
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-10 overflow-hidden  sm:grid-cols-2">
            {highlights.map((h, i) => (
              <Reveal key={h.title} delay={i * 80}>
                <article className="group h-full bg-accent p-14 transition-colors duration-500 hover:bg-primary lg:p-12">
                  <h.icon
                    size={28}
                    className="text-primary transition-colors group-hover:text-primary-foreground"
                  />
                  <h3 className="mt-6  text-xl font-bold">
                    {h.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-accent-foreground/65 transition-colors group-hover:text-accent-foreground/85">
                    {h.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad">
        <div className="container-page">
          <Reveal>
            <div className="border border-border bg-primary-soft px-8 py-14 text-center lg:px-20 lg:py-20">
              <p className="eyebrow">Upcoming exhibitions</p>
              <h2 className="mx-auto mt-4 max-w-3xl  text-3xl font-bold text-ink sm:text-4xl">
                Meet us at Expomed Eurasia, Medica and Arab Health
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
                Book a stand appointment with our export team, or request the
                full catalogue and a quotation tailored to your theatre
                requirements.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link href="/contact" className="btn-base btn-primary">
                  Contact our team
                </Link>
                <Link href="/products" className="btn-base btn-outline">
                  Download catalogue
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
