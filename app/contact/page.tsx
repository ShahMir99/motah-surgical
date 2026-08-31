"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";

const PRIMARY = "#18B27F";
const PRIMARY_DARK = "#129468";
const GRADIENT = `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_DARK} 100%)`;

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div>
      {/* <section className="py-24 text-white" style={{ background: PRIMARY }}>
        <div className="mx-auto max-w-7xl px-6">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white">Contact Us</span>
          <h1 className="mt-4 font-display text-5xl font-extrabold md:text-6xl">
            Let&apos;s Talk About Your Surgical Instrument Needs
          </h1>
          <p className="mt-5 max-w-2xl text-white/80">
            Whether you need custom instruments, bulk export orders, or ongoing manufacturing
            support, our team at Motah Surgical is ready to help.
          </p>
        </div>
      </section> */}

      {/* Hero / Introduction banner */}
      <section className="relative">
        <img
          src="https://placehold.co/1600x520/16303d/16303d?text=+"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-primary-dark" />

        <div className="relative mx-auto flex max-w-5xl flex-col lg:h-[360px] lg:flex-row">
          <div className="relative flex text-center w-full h-[440px] flex-col justify-center bg-[#02ac75] px-8 py-14 lg:shrink-0 lg:px-16 lg:py-0">
            <p className="mb-5 text-lg font-medium tracking-[0.4em] text-white">
              CONTACT US
            </p>
            <h1 className="font-serif max-w-xl mx-auto text-7xl font-semibold text-white lg:text-5xl">
              Let's Build Something Great Together
            </h1>
            <p className="mt-6 text-2xl font-light leading-snug text-white lg:text-3xl">
              Let&apos;s Talk About Your
              <br />
              Surgical Instrument Needs
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-24 pt-44">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-2">
            {[
              {
                icon: MapPin,
                title: "Head Office",
                value: "5208 Al Amir Bandar Ibn Abdul Aziz, Al Khalij, Riyadh 13224",
              },
              {
                icon: Mail,
                title: "Email",
                value: "info@motah-surgical.com",
              },
              {
                icon: Phone,
                title: "Phone",
                value: "(+966) 56 439 1056",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-5"
              >
                <div
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-xl"
                  style={{ background: GRADIENT }}
                >
                  <c.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                    {c.title}
                  </div>
                  <div className="mt-1 font-semibold text-gray-900">
                    {c.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="rounded-3xl bg-white p-8 shadow-[0_25px_60px_-20px_rgba(24,178,127,0.35)] lg:col-span-3"
          >
            <h2
              className="font-display text-2xl font-bold"
              style={{ color: PRIMARY }}
            >
              Send us a message
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Name" name="name" />
              <Field label="Email" name="email" type="email" />
              <Field label="Phone" name="phone" />
              <Field label="Subject" name="subject" />
            </div>
            <div className="mt-4">
              <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                Message
              </label>
              <textarea
                required
                rows={5}
                name="message"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#18B27F]"
              />
            </div>
            <button
              className="mt-6 inline-flex rounded-full px-8 py-3.5 text-sm font-semibold text-white"
              style={{ background: GRADIENT }}
            >
              {sent ? "Message Sent ✓" : "Send Message"}
            </button>
          </form>
        </div>

        {/* Map Section */}
        <div className="w-full h-[70vh] overflow-hidden pt-20">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d1225414.8709407137!2d45.89737256073068!3d24.749391598559473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1s5208%20Al%20Amir%20Bandar%20Ibn%20Abdul%20Aziz%2C%20Al%20Khalij%2C%20Riyadh%2013224!5e0!3m2!1sen!2s!4v1788169006144!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Company Location"
          ></iframe>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
}: {
  label: string;
  name: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">
        {label}
      </label>
      <input
        required
        type={type}
        name={name}
        className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#18B27F]"
      />
    </div>
  );
}
