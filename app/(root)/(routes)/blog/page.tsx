import { ArrowRight } from "lucide-react";
import sFinishing from "@/assets/service-finishing.jpg";
import sInfra from "@/assets/service-infrastructure.jpg";
import sConstruction from "@/assets/service-construction.jpg";
import sResidential from "@/assets/service-residential.jpg";
import sMep from "@/assets/service-mep.jpg";
import sCommercial from "@/assets/service-commercial.jpg";
import Image from "next/image";


const posts = [
  { title: "Construction Finishing Works in Khobar: Premium Quality, Flawless Handover", img: sFinishing, excerpt: "Finishing is the stage where a building earns its reputation. Floors, ceilings, walls, and joinery define the user experience." },
  { title: "Pre-Engineered Steel Buildings in Egypt and Saudi Arabia: Faster, Stronger, Smarter", img: sInfra, excerpt: "Logistics hubs, manufacturing plants, and warehouses need to come online in months — not years." },
  { title: "EPC Contractors in Egypt and Saudi Arabia: Turnkey Delivery from Concept to Commissioning", img: sConstruction, excerpt: "The Engineering, Procurement, and Construction model removes friction between disparate vendors." },
  { title: "Residential Construction Companies in Riyadh: Build Your Home with Confidence", img: sResidential, excerpt: "Building a home in Riyadh is the largest investment most families will ever make." },
  { title: "HVAC Contractors in Riyadh: Expert Climate Control for Saudi Projects", img: sMep, excerpt: "Riyadh's climate is uncompromising — cooling loads drive a large share of a building's energy bill." },
  { title: "Infrastructure Construction Services: Roads, Utilities, and Urban Backbones", img: sCommercial, excerpt: "Every Vision 2030 city relies on an unseen backbone of infrastructure." },
];

export default function BlogPage() {
  return (
    <div>
      <section className="bg-primary py-24 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Blog Posts</span>
          <h1 className="mt-4 font-display text-5xl font-extrabold md:text-6xl">Keep Updated With The Latest</h1>
        </div>
      </section>
      <section className="bg-background py-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <article key={p.title} className="overflow-hidden rounded-2xl bg-card shadow-sm transition hover:shadow-[var(--shadow-elegant)]">
              <div className="aspect-[16/10] overflow-hidden">
                <Image src={p.img} alt={p.title} width={800} height={500} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="font-display text-lg font-bold leading-snug text-primary">{p.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{p.excerpt}</p>
                <button className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-secondary">
                  Read more <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}