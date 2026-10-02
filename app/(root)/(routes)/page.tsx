import { ShieldCheck } from "lucide-react";

import aboutFallback from "@/assets/vision_image.png";
import worldVectorImage from "@/assets/world-vector-image.png";

import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/site/Reveal";
import HomeHero from "@/components/site/HomeHero";
import ProductCategoriesGrid from "@/components/ProductGrid";
import HighlightsGrid from "@/components/Highlights";
import UpcomingExhibitions from "@/components/Upcomingexhibitions";

import { getHomeContent } from "@/lib/apis/home-queries";
import { getPublishedProducts } from "@/lib/apis/product-queries";
import type { ProductListItem } from "@/types/product";

// Saving the Home Page or a product in the admin refreshes this page right
// away; this is a fallback refresh interval.
export const revalidate = 60;

async function loadProducts(limit: number): Promise<ProductListItem[]> {
  try {
    return (await getPublishedProducts()).slice(0, limit);
  } catch (err) {
    console.error("[home] products couldn't be loaded", err);
    return [];
  }
}

export default async function Home() {
  const content = await getHomeContent();
  const products = await loadProducts(content.products.limit);
  const { hero, badges, about, highlights, exhibition } = content;

  return (
    <>
      {/* Hero */}
      <section className="relative">
        <HomeHero content={hero} />
        {badges.length > 0 && (
          <div className="border-y border-border bg-primary-soft">
            <div className="container-page grid gap-6 py-6 text-sm font-semibold uppercase tracking-[0.16em] text-ink-soft sm:grid-cols-2 lg:grid-cols-4">
              {badges.map((b, i) => (
                <div key={`${b}-${i}`} className="flex items-center gap-3">
                  <ShieldCheck size={18} className="text-primary" />
                  {b}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Products */}
      <section className="relative pt-32 pb-14">
        <div className="container-page">
          <Reveal className="max-w-2xl mx-auto">
            <p className="eyebrow text-ink text-center">{content.products.eyebrow}</p>
            <h2 className="mt-2 text-6xl text-center font-medium text-primary sm:text-4xl  lg:text-5xl">
              {content.products.heading}
            </h2>
          </Reveal>

          <ProductCategoriesGrid products={products} />

          <div className="mt-10 flex justify-center">
            <Link href="/products" className="btn-base btn-ink bg-primary">
              {content.products.buttonLabel}
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="relative bg-primary">
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            backgroundImage: `url(${worldVectorImage.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        <div className="relative mx-auto max-w-[1320px] px-10 py-16 md:py-14">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-[560px] overflow-hidden rounded-xl bg-gray-100">
              <Image
                src={about.image?.url ?? aboutFallback}
                alt={about.image?.alt || "Motah Surgical instrument manufacturing"}
                fill
                sizes="(max-width: 1024px) 90vw, 490px"
                className="object-cover"
              />
            </div>

            <div className="text-center text-white lg:text-left">
              <div className="flex flex-wrap items-baseline justify-center gap-x-3 lg:justify-start">
                <span className="text-3xl font-light md:text-4xl">{about.prefix}</span>
                <h1 className="text-4xl font-bold uppercase">{about.title}</h1>
              </div>

              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/90 lg:mx-0">{about.body}</p>

              {about.buttonLabel && (
                <Link
                  href={about.buttonHref || "#"}
                  className="mx-auto mt-8 inline-flex w-fit items-center justify-center rounded bg-primary-dark px-6 py-2.5 text-sm font-semibold uppercase tracking-widest text-white transition-colors lg:mx-0"
                >
                  {about.buttonLabel}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="section-pad text-accent-foreground">
        <div className="container-page">
          <Reveal className="max-w-2xl mx-auto pb-5">
            <p className="text-xs font-bold text-center uppercase tracking-[0.24em] text-ink">{highlights.eyebrow}</p>
            <h2 className="mt-4 text-3xl text-center text-primary font-bold sm:text-4xl lg:text-5xl">
              {highlights.heading}
            </h2>
          </Reveal>

          <HighlightsGrid items={highlights.items} />
        </div>
      </section>

      {/* Exhibitions */}
      <section className="pb-10">
        <UpcomingExhibitions content={exhibition} />
      </section>
    </>
  );
}
