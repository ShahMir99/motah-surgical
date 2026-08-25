"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Award, BadgeCheck, FileText, ArrowRight, Wrench } from "lucide-react";
import Link from "next/link";

import { fadeUp, stagger, viewportOnce } from "@/components/site/motion";
import { PageHeader } from "@/components/site/PageHeader";
import { DownloadCard } from "@/components/site/DownloadCard";
import { FaqAccordion, type FaqItem } from "@/components/site/FaqAccordion";

const regulatoryDocs = [
  { icon: ShieldCheck, title: "SFDA Medical Device Establishment License", href: "/documents/sfda-license.pdf", fileLabel: "Download SFDA Certificate (PDF)" },
  { icon: Award, title: "ISO 13485:2016 Quality Management Certificate", href: "/documents/iso-13485-certificate.pdf", fileLabel: "Download ISO Certificate (PDF)" },
  { icon: BadgeCheck, title: "Saudi-DI / UDI Compliance Statement", href: "/documents/udi-compliance-statement.pdf", fileLabel: "Download UDI Statement (PDF)" },
  { icon: FileText, title: "Full Master Product Catalog", href: "/documents/master-product-catalog.pdf", fileLabel: "Download Master Catalog (PDF)" },
];

const faqs: FaqItem[] = [
  {
    q: "What are your minimum order quantities (MOQs)?",
    a: "Flexible ordering terms are available for single-unit replacements as well as full hospital tender contracts.",
  },
  {
    q: "What are your dispatch and lead times?",
    a: "Rapid 24–48-hour dispatch within Riyadh and expedited shipping across all KSA provinces.",
  },
  {
    q: "What warranty coverage is included?",
    a: "Comprehensive multi-year material and manufacturing defect warranty on all reusable stainless-steel instruments.",
  },
  {
    q: "Do you offer custom marking services?",
    a: "In-house laser marking is available for asset control, inventory tracking, and department coding.",
  },
];

export default function ResourcesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Resources & Support"
        title="Regulatory Certificates & Document Portal"
      />

      {/* SECTION 1 — SFDA & REGULATORY COMPLIANCE */}
      <section id="regulatory" className="scroll-mt-24 bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {regulatoryDocs.map((d) => (
              <DownloadCard key={d.title} icon={d.icon} title={d.title} href={d.href} fileLabel={d.fileLabel} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 — LOCAL CONTENT (LCGPA) */}
      <section id="lcgpa" className="scroll-mt-24 bg-[#F4F6F7] py-24">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mx-auto max-w-4xl px-6"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#18B27F]">
            Local Content (LCGPA)
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-[#0B1119] md:text-4xl">
            Maximizing Saudi Local Value Addition
          </h2>
          <p className="mt-5 leading-8 text-[#3B4652]">
            Motah Surgical actively contributes to Kingdom-wide local content targets, offering
            government procurement officers and private hospital networks strategic advantages
            under LCGPA purchasing guidelines.
          </p>
        </motion.div>
      </section>

      {/* SECTION 3 — RE-PASSIVATION & MAINTENANCE SERVICES */}
      <section id="repassivation" className="scroll-mt-24 bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={stagger}
            className="grid items-center gap-10 lg:grid-cols-[auto,1fr]"
          >
            <motion.span
              variants={fadeUp}
              className="grid h-20 w-20 place-items-center rounded-full border-2 border-[#18B27F] bg-[#EDF9F5] text-[#18B27F]"
            >
              <Wrench className="h-8 w-8" />
            </motion.span>
            <motion.div variants={fadeUp}>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#18B27F]">
                Maintenance Services
              </span>
              <h2 className="mt-3 font-display text-3xl font-extrabold text-[#0B1119] md:text-4xl">
                Local Instrument Refurbishment & Maintenance
              </h2>
              <p className="mt-5 leading-8 text-[#3B4652]">
                Extend the operational lifespan of your hospital inventory. We offer dedicated
                in-Kingdom refurbishment, precision realignment, re-sharpening, and automated
                re-passivation services to restore surgical stock to pristine SFDA-compliant
                condition.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#18B27F] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#12915F]"
              >
                Request Refurbishment Service
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4 — ORDERING FAQS & LOGISTICS */}
      <section id="faqs" className="scroll-mt-24 bg-[#F4F6F7] py-24">
        <div className="mx-auto max-w-3xl px-6">
          <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={fadeUp}>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#18B27F]">
              FAQs & Logistics
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-[#0B1119] md:text-4xl">
              Procurement Information & FAQs
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className="mt-10"
          >
            <FaqAccordion items={faqs} />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
