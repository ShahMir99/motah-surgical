import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, ImageIcon } from "lucide-react";

import Reveal from "@/components/Reveal";
import { Reveal as FadeUp } from "@/components/site/Reveal";
import { getPublishedProduct } from "@/lib/apis/product-queries";
import { richTextBody } from "@/lib/rich-text";

export const revalidate = 60;

type PageProps = { params: Promise<{ slug: string }> };

const getProduct = cache((slug: string) => getPublishedProduct(decodeURIComponent(slug)));

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product not found" };

  const title = product.seo?.metaTitle || `${product.name} Instruments | Motah Surgical`;
  const description = product.seo?.metaDescription || product.summary || undefined;
  const image = product.image?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image, alt: product.image?.alt || product.name }] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const catalogHref = product.catalog ? `/api/products/${product.slug}/catalog` : null;
  const catalogTitle = product.catalog?.title || `${product.name} Catalogue`;

  return (
    <div className="bg-white text-[#4A5560]">
      {/* HERO */}
      <div className="mx-auto mt-10 grid min-h-[520px] max-w-[1320px] grid-cols-1 md:grid-cols-[45%_55%]">
        <Reveal className="flex flex-col gap-8 bg-[#18B27F] px-7 py-14 text-white md:px-20 md:py-20">
          <span className="text-[23px] font-semibold uppercase tracking-[2px]">{product.name}</span>
          <h1 className="pb-20 pt-14 text-[28px] font-light leading-[1.35] md:text-[55px]">
            {product.tagline && <>{product.tagline} </>}
            <span className="block text-[34px] font-bold tracking-[2px] md:text-[45px]">{product.taglineBold || product.name}</span>
          </h1>
          {catalogHref && (
            <a
              href={catalogHref}
              download
              className="w-fit bg-[#1E2A3B] px-6 py-4 text-xs font-bold tracking-[1.5px] text-white transition-colors hover:bg-[#24344A]"
            >
              DOWNLOAD CATALOGUE
            </a>
          )}
        </Reveal>

        <div className="order-first flex items-center justify-end overflow-hidden md:order-last md:pl-10">
          {product.image?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image.url}
              alt={product.image.alt || product.name}
              className="h-[340px] w-full object-cover md:h-full md:max-h-[750px]"
            />
          ) : (
            <div className="grid h-[340px] w-full place-items-center bg-[#EEF5F2] text-[#9DB5AC] md:h-full">
              <ImageIcon className="h-12 w-12" aria-hidden />
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-[1320px] px-6">
        {/* INTRO */}
        <section className="pt-14">
          <h2 className="mb-5 text-[36px] font-bold text-[#18B27F] md:text-[45px]">
            {product.name}
            {product.badge && <span className="ml-3 align-middle text-xl font-semibold text-slate-400">({product.badge})</span>}
          </h2>
          {product.description ? (
            <div className={richTextBody} dangerouslySetInnerHTML={{ __html: product.description }} />
          ) : (
            product.summary && <p className="text-[18px] leading-relaxed tracking-wide text-ink">{product.summary}</p>
          )}
        </section>

        {/* FEATURED CATEGORIES */}
        {product.categories.length > 0 && (
          <section className="pt-16">
            <h2 className="mb-5 text-[36px] font-bold text-[#18B27F] md:text-[45px]">Featured Categories</h2>

            <ul className="mb-8 grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2 md:grid-cols-3">
              {product.categories.map((cat, i) => (
                <li key={cat}>
                  <FadeUp delay={Math.min(i, 12) * 40} className="flex items-center gap-2 text-[18px] font-semibold text-[#1C3350]">
                    <span
                      aria-hidden
                      className="h-0 w-0 shrink-0 border-y-[5px] border-l-[7px] border-y-transparent border-l-[#18B27F]"
                    />
                    {cat}
                  </FadeUp>
                </li>
              ))}
            </ul>

            <Link
              href="/products"
              className="inline-block bg-[#1E2A3B] px-6 py-4 text-xs font-bold tracking-[1.5px] text-white transition-colors hover:bg-[#24344A]"
            >
              VIEW ALL PRODUCTS
            </Link>
          </section>
        )}

        {/* MEDIA */}
        {catalogHref ? (
          <section className="pb-24 pt-20 text-center">
            <h2 className="mb-2 inline-block text-[32px] font-bold text-[#18B27F]">Media</h2>

            <FadeUp className="mx-auto mt-8 w-[230px]">
              <a
                href={catalogHref}
                download
                className="group block border border-[#E7E9EB] text-left shadow-[0_4px_14px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_10px_28px_rgba(0,0,0,0.12)]"
              >
                <MediaThumbnail />
                <div className="flex items-start justify-between gap-2 px-3.5 pb-4 pt-3">
                  <p className="text-sm font-bold text-[#222]">{catalogTitle}</p>
                  <Download className="mt-0.5 h-4 w-4 shrink-0 text-[#18B27F] transition-transform group-hover:translate-y-0.5" aria-hidden />
                </div>
              </a>
            </FadeUp>
          </section>
        ) : (
          <div className="pb-24" />
        )}
      </div>
    </div>
  );
}

const PRIMARY = "#18B27F";
const PRIMARY_DARK = "#129468";

function MediaThumbnail() {
  return (
    <svg viewBox="0 0 300 340" className="block h-auto w-full" aria-hidden>
      <rect width="300" height="340" fill="#fff" />
      <rect width="300" height="150" fill={PRIMARY} />
      <rect y="150" width="300" height="30" fill="#A9E2CC" />
      <g stroke="#8A8F94" strokeWidth={2} strokeLinecap="round">
        <line x1="60" y1="130" x2="150" y2="30" />
        <line x1="90" y1="140" x2="190" y2="25" />
        <line x1="140" y1="150" x2="230" y2="55" />
      </g>
      <circle cx="150" cy="30" r="6" fill={PRIMARY_DARK} />
      <rect x="75" y="115" width="12" height="26" rx="4" fill="#C7963B" transform="rotate(20 81 128)" />
      <rect x="215" y="45" width="11" height="20" rx="4" fill="#B5442E" transform="rotate(-15 220 55)" />
      <text x="20" y="205" fontFamily="Poppins, sans-serif" fontWeight={700} fontSize={15} fill={PRIMARY}>
        Catalog
      </text>
      <text x="20" y="225" fontFamily="Inter, sans-serif" fontSize={9} fill="#666">
        PDF download
      </text>
    </svg>
  );
}
