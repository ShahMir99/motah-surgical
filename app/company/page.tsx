"use client";

import { motion } from "framer-motion";
import { ClipboardCheck, Droplets, ScanLine, FlaskConical, PackageCheck, ShieldCheck, Award, ArrowRight } from "lucide-react";
import Link from "next/link";

import { fadeUp, stagger, viewportOnce } from "@/components/site/motion";
import { PageHeader } from "@/components/site/PageHeader";
import { ProcessFlow } from "@/components/site/ProcessFlow";
import { ComplianceBadge } from "@/components/site/ComplianceBadge";

const zones = [
  {
    step: "01",
    icon: ClipboardCheck,
    title: "Receiving, Inspection & Assembly",
    desc: "Incoming raw forgings undergo batch logging, material cert verification, dimensional checks, and hardness testing, then jaw alignment, pinning, riveting, and functional hand calibration in the same prep area.",
  },
  {
    step: "02",
    icon: Droplets,
    title: "Ultrasonic Cleaning & Degreasing",
    desc: "Dedicated multi-stage ultrasonic washing using specialized detergent (no caustic soda), followed by primary rinsing and high-purity DI water cascade rinsing to eliminate post-polishing residues.",
  },
  {
    step: "03",
    icon: ScanLine,
    title: "Direct Laser Marking",
    desc: "High-precision fiber laser etching of part IDs, lot numbers, department names, and logos directly on cleaned surfaces before passivation.",
  },
  {
    step: "04",
    icon: FlaskConical,
    title: "Chemical Passivation",
    desc: "ASTM A967-compliant acid treatment followed by primary rinsing, high-purity DI water final rinsing (<20 ppm TDS), and thermal drying to establish a durable chromium-oxide anti-corrosion barrier.",
  },
  {
    step: "05",
    icon: PackageCheck,
    title: "Final Inspection, Packaging & Dispatch",
    desc: "100% optical microscope checks, surface cleanliness verification, jaw alignment testing, and ASTM-compliant passivation validation, then polybag sealing, lot labeling, and master shipper packing.",
  },
];

export default function CompanyPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Company"
        title="Advancing Surgical Healthcare in Saudi Arabia"
        description="Motah Surgical is a premier provider of general, gynecological, orthopedic, and specialized surgical instrumentation, partnering directly with healthcare institutions, Ministry of Health networks, and surgical facilities across the Middle East."
      />

      {/* SECTION 1 — ABOUT */}
      <section className="bg-white py-24">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mx-auto max-w-4xl px-6"
        >
          <p className="text-lg leading-8 text-[#3B4652]">
            Motah Surgical is a premier provider of general, gynecological, orthopedic, and
            specialized surgical instrumentation. Designed and finished to meet the exacting
            demands of modern operating rooms, our products balance tactile control, material
            longevity, and clinical accuracy. We partner directly with healthcare institutions,
            Ministry of Health networks, and surgical facilities across the Middle East.
          </p>
        </motion.div>
      </section>

      {/* SECTION 2 — VISION 2030 ALIGNMENT */}
      <section className="bg-[#F4F6F7] py-24">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mx-auto max-w-4xl px-6"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#18B27F]">
            Vision 2030
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-[#0B1119] md:text-4xl">
            Supporting Saudi Arabia&apos;s Healthcare Independence
          </h2>
          <p className="mt-5 leading-8 text-[#3B4652]">
            In alignment with the Kingdom&apos;s National Industrial Development and Logistics
            Program (NIDLP), Motah Surgical invests in local post-processing, automated
            passivation, laser marking, and final quality assurance facilities in Riyadh. By
            performing critical value-addition steps domestically, we strengthen healthcare
            supply chain resilience, support LCGPA targets, and accelerate product delivery to
            hospitals nationwide.
          </p>
        </motion.div>
      </section>

      {/* SECTION 3 — LOCAL MANUFACTURING & FACILITY OPERATIONS */}
      <section className="relative overflow-hidden bg-[#0B1119] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={fadeUp} className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#80D5B9]">
              Facility Operations
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-white md:text-4xl">
              Local Manufacturing & Facility Operations
            </h2>
            <p className="mt-5 text-white/70">
              Motah Surgical operates a state-of-the-art medical device finishing and processing
              facility in Saudi Arabia, engineered to meet ISO 13485 standards and Saudi Food and
              Drug Authority (SFDA) regulations. Our streamlined 5-zone plant layout ensures
              seamless workflow efficiency, strict contamination control, and full traceability
              for every surgical instrument.
            </p>
            <p className="mt-6 font-display text-sm font-bold uppercase tracking-[0.2em] text-white">
              Our 5-Zone Controlled Facility Layout
            </p>
          </motion.div>

          <ProcessFlow steps={zones} />
        </div>
      </section>

      {/* SECTION 4 — QUALITY & CERTIFICATIONS */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={fadeUp} className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#18B27F]">
              Quality & Certifications
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-[#0B1119] md:text-4xl">
              Uncompromising Standards & Total Traceability
            </h2>
            <p className="mt-5 leading-8 text-[#3B4652]">
              Quality assurance is integrated into every step of our operational flow. Operating
              under ISO 13485:2016 parameters and SFDA regulations, Motah Surgical maintains full
              batch traceability from raw material stainless steel mill certificates down to the
              individual surgical tray delivered to the operating theatre.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={stagger}
            className="mt-12 grid gap-8 sm:grid-cols-2 lg:max-w-2xl"
          >
            <ComplianceBadge
              icon={ShieldCheck}
              tag="SFDA Licensed"
              desc="Fully registered medical device establishment compliant with KSA regulatory frameworks."
            />
            <ComplianceBadge
              icon={Award}
              tag="ISO 13485:2016"
              desc="Quality Management System standard specific to medical device manufacturing."
            />
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#F4F6F7] py-20">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 text-center"
        >
          <h2 className="font-display text-2xl font-extrabold text-[#0B1119] md:text-3xl">
            Explore what our Riyadh facility produces
          </h2>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full bg-[#18B27F] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#12915F]"
          >
            View Full Products Page & 13 Catalogs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
