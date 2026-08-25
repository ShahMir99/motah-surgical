"use client";

import { motion } from "framer-motion";
import { UploadCloud, MessageCircle, Mail, MapPin, Clock, ArrowRight } from "lucide-react";

import { fadeUp, stagger, viewportOnce } from "@/components/site/motion";
import { PageHeader } from "@/components/site/PageHeader";

const categories = [
  "Government Tender / NUPCO Requisition",
  "Private Hospital Procurement",
  "Custom Procedure Tray / Set Request",
  "OEM & Contract Manufacturing Partnership",
  "Refurbishment & Re-Passivation Request",
];

// Placeholder — replace with the real WhatsApp Business number, digits only, country code first.
const whatsappNumber = "966500000000";

export default function ContactPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Contact"
        title="Contact Our Procurement Team"
        description="Tell us what you need and how to reach you — a specialist will route your inquiry to the right team."
      />

      {/* SECTION 1 — SMART INQUIRY ROUTING FORM */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-3xl px-6">
          <motion.form
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={stagger}
            className="rounded-2xl border border-[#D9DEE2] bg-white p-6 shadow-sm sm:p-10"
          >
            <motion.div variants={fadeUp} className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-[#0B1119]">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="mt-2 w-full rounded-xl border border-[#D9DEE2] px-4 py-3 text-sm text-[#0B1119] outline-none focus:border-[#18B27F]"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-[#0B1119]">Organization / Hospital</label>
                <input
                  type="text"
                  name="organization"
                  className="mt-2 w-full rounded-xl border border-[#D9DEE2] px-4 py-3 text-sm text-[#0B1119] outline-none focus:border-[#18B27F]"
                  placeholder="Facility or company name"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-[#0B1119]">Email</label>
                <input
                  type="email"
                  name="email"
                  className="mt-2 w-full rounded-xl border border-[#D9DEE2] px-4 py-3 text-sm text-[#0B1119] outline-none focus:border-[#18B27F]"
                  placeholder="you@hospital.sa"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-[#0B1119]">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="mt-2 w-full rounded-xl border border-[#D9DEE2] px-4 py-3 text-sm text-[#0B1119] outline-none focus:border-[#18B27F]"
                  placeholder="+966 5X XXX XXXX"
                />
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-6">
              <label className="text-sm font-semibold text-[#0B1119]">Inquiry Category</label>
              <select
                name="category"
                defaultValue=""
                className="mt-2 w-full rounded-xl border border-[#D9DEE2] bg-white px-4 py-3 text-sm text-[#0B1119] outline-none focus:border-[#18B27F]"
              >
                <option value="" disabled>
                  Select an inquiry type
                </option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-6">
              <label className="text-sm font-semibold text-[#0B1119]">Message</label>
              <textarea
                name="message"
                rows={4}
                className="mt-2 w-full rounded-xl border border-[#D9DEE2] px-4 py-3 text-sm text-[#0B1119] outline-none focus:border-[#18B27F]"
                placeholder="Tell us about your requirement..."
              />
            </motion.div>

            <motion.div variants={fadeUp} className="mt-6">
              <label
                htmlFor="tender-upload"
                className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#D9DEE2] px-6 py-10 text-center transition hover:border-[#18B27F]"
              >
                <UploadCloud className="h-8 w-8 text-[#18B27F]" />
                <span className="text-sm font-semibold text-[#0B1119]">
                  Attach Tender File / Item Requisition
                </span>
                <span className="font-mono text-xs text-[#7C8891]">PDF, Excel, or Word</span>
                <input id="tender-upload" name="tender-upload" type="file" accept=".pdf,.xls,.xlsx,.doc,.docx" className="sr-only" />
              </label>
            </motion.div>

            <motion.button
              variants={fadeUp}
              type="submit"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#18B27F] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#12915F]"
            >
              Submit Institutional Inquiry
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </motion.form>
        </div>
      </section>

      {/* SECTION 2 — WHATSAPP BUSINESS */}
      <section className="bg-[#0B1119] py-20">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-6 text-center"
        >
          <span className="grid h-16 w-16 place-items-center rounded-full bg-[#18B27F]/10 text-[#80D5B9]">
            <MessageCircle className="h-7 w-7" />
          </span>
          <h2 className="font-display text-2xl font-extrabold text-white md:text-3xl">
            Urgent Procurement Support
          </h2>
          <p className="max-w-xl text-white/70">
            Connect directly with a sales specialist in Riyadh for real-time inventory checks
            and urgent hospital orders.
          </p>
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#18B27F] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#12915F]"
          >
            Chat via WhatsApp Business
            <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>
      </section>

      {/* SECTION 3 — FACILITY LOCATION & DIRECT CONTACT */}
      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1fr,1.3fr]">
          <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={fadeUp}>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#18B27F]">
              Facility Location
            </span>
            <h2 className="mt-3 font-display text-2xl font-extrabold text-[#0B1119] md:text-3xl">
              Direct Contact
            </h2>

            <div className="mt-6 space-y-4 text-sm text-[#3B4652]">
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#18B27F]" />
                Riyadh, Kingdom of Saudi Arabia
              </p>
              <a href="mailto:info@motahsurgical.com" className="flex items-start gap-3 hover:text-[#18B27F]">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#18B27F]" />
                info@motahsurgical.com
              </a>
              <p className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[#18B27F]" />
                All institutional inquiries are acknowledged within 24 business hours.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className="overflow-hidden rounded-2xl border border-[#D9DEE2]"
          >
            {/*
              Placeholder query — replace "Riyadh,Saudi+Arabia" with your
              exact facility address once available for a pinpoint marker.
            */}
            <iframe
              src="https://www.google.com/maps?q=Riyadh,Saudi+Arabia&output=embed"
              className="h-[360px] w-full lg:h-full"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Motah Surgical — Riyadh facility location"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
