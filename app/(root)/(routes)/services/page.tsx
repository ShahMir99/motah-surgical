import { ArrowRight } from "lucide-react";

import sConstruction from "@/assets/service-construction.jpg";
import sCommercial from "@/assets/service-commercial.jpg";
import sResidential from "@/assets/service-residential.jpg";

import EConstruction from "@/assets/electrical-contracting.png";
import UNetwork from "@/assets/underground-network.png";
import overheadLine from "@/assets/overhead-line.png";

import sInfra from "@/assets/service-infrastructure.jpg";
import sMep from "@/assets/service-mep.jpg";
import sFinishing from "@/assets/service-finishing.jpg";
import Image from "next/image";
import Link from "next/link";

const services = [
  {
    title: "Electrical Contracting",
    img: EConstruction,
    desc: "Comprehensive LV/MV installations, power distribution systems, transformers, switchgear, industrial electrical works, and street lighting solutions.",
  },
  {
    title: "Underground Network Solutions",
    img: UNetwork,
    desc: "Professional underground cable installation, trenching, cable laying, jointing, distribution network extensions, and fault rectification services.",
  },
  {
    title: "Overhead Line Works",
    img: overheadLine,
    desc: "Construction, maintenance, rehabilitation, and emergency restoration of overhead electrical distribution networks across Egypt and Saudi Arabia.",
  },
  // {
  //   title: "Infrastructure",
  //   img: sInfra,
  //   desc: "Roads, utilities, and pre-engineered steel structures that power Vision 2030.",
  // },
  // {
  //   title: "MEP Contracting",
  //   img: sMep,
  //   desc: "Integrated mechanical, electrical, plumbing, and fire safety systems.",
  // },
  // {
  //   title: "Finishing & Decoration",
  //   img: sFinishing,
  //   desc: "Premium finishes and decorative works that add elegance and identity.",
  // },
];

export default function ServicesPage() {
  return (
    <div>
      <section className="bg-primary py-24 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
            Our Services
          </span>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-extrabold md:text-6xl">
            Comprehensive contracting & engineering solutions
          </h1>
          <p className="mt-5 max-w-2xl text-primary-foreground/80">
            End-to-end services covering every stage of your project — from
            concept to commissioning.
          </p>
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <article
              key={s.title}
              className="group overflow-hidden rounded-2xl bg-card shadow-sm transition hover:shadow-[var(--shadow-elegant)]"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <Image
                  src={s.img}
                  alt={s.title}
                  width={800}
                  height={600}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-primary">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                <Link
                  href="/contact"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-secondary"
                >
                  Discuss your project <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
