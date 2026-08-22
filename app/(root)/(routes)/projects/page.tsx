import p1 from "@/assets/project-1.png";
import p2 from "@/assets/project-2.png";
import p3 from "@/assets/project-3.png";
import p4 from "@/assets/project-4.png";
import p5 from "@/assets/project-5.png";

import sCommercial from "@/assets/service-commercial.jpg";
import sResidential from "@/assets/service-residential.jpg";
import Image from "next/image";


const projects = [
  { title: "New Administrative Capital (NAC)", location: "Cairo, Egypt", img: p1 },
  { title: "Cairo Metro Expansion", location: "Cairo, Egypt", img: p2 },
  { title: "Benban Solar Park", location: "Aswan, Egypt", img: p3 },
  { title: "Ain Sokhna Industrial Zone", location: "Suez Governorate, Egypt", img: p4 },
  { title: "High-Speed Rail Project", location: "Egypt", img: p5 },
];

export default function ProjectsPage() {
  return (
    <div>
      <section className="bg-primary py-24 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Our Landmark Projects</span>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-extrabold md:text-6xl">Shaping the Future, One Project at a Time</h1>
          <p className="mt-5 max-w-2xl text-primary-foreground/80">
            From residential communities to industrial facilities and infrastructure — projects that drive Egypt and Saudi Arabia&apos;s progress.
          </p>
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <article key={p.title} className="group relative overflow-hidden rounded-2xl">
              <Image src={p.img} alt={p.title} width={800} height={600} loading="lazy" className="aspect-[4/5] h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-primary-foreground">
                <div className="text-xs font-semibold uppercase tracking-widest text-secondary">{p.location}</div>
                <h3 className="mt-1 font-display text-xl font-bold">{p.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}