"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div>
      <section className="bg-primary py-24 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Contact Us</span>
          <h1 className="mt-4 font-display text-5xl font-extrabold md:text-6xl">Let&apos;s Build Something Great Together</h1>
          <p className="mt-5 max-w-2xl text-primary-foreground/80">
            Whether you&apos;re planning a residential, commercial, industrial, or infrastructure project, our team is ready to bring your vision to life.
          </p>
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-2">
            {[
              { icon: MapPin, title: "Head Office", value: "Egypt and Saudi Arabia, Madinah Munawwarah, King Khalid Road, Waqran District" },
              { icon: Mail, title: "Email", value: "info@nscc-group.com" },
              { icon: Phone, title: "Phone", value: " (+966) 54 108 44505" },
            ].map((c) => (
              <div key={c.title} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-secondary">
                  <c.icon className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{c.title}</div>
                  <div className="mt-1 font-semibold text-foreground">{c.value}</div>
                </div>
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            className="rounded-3xl bg-card p-8 shadow-[var(--shadow-elegant)] lg:col-span-3"
          >
            <h2 className="font-display text-2xl font-bold text-primary">Send us a message</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Name" name="name" />
              <Field label="Email" name="email" type="email" />
              <Field label="Phone" name="phone" />
              <Field label="Subject" name="subject" />
            </div>
            <div className="mt-4">
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Message</label>
              <textarea required rows={5} name="message" className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent" />
            </div>
            <button className="mt-6 inline-flex rounded-full px-8 py-3.5 text-sm font-semibold bg-secondary text-white">
              {sent ? "Message Sent ✓" : "Send Message"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</label>
      <input required type={type} name={name} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent" />
    </div>
  );
}