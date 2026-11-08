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
      <div className="mx-auto mt-6 grid max-w-[1320px] grid-cols-1 sm:mt-10 md:min-h-[520px] md:grid-cols-[45%_55%]">
        <Reveal className="flex flex-col gap-5 bg-[#18B27F] px-5 py-10 text-white sm:gap-8 sm:px-7 sm:py-14 md:px-20 md:py-20">
          <span className="text-[18px] font-semibold uppercase tracking-[2px] sm:text-[23px]">{product.name}</span>
          <h1 className="pb-10 pt-6 text-[22px] font-light leading-[1.35] sm:pb-16 sm:pt-12 sm:text-[28px] md:pb-20 md:pt-14 md:text-[55px]">
            {product.tagline && <>{product.tagline} </>}
            <span className="block text-[24px] font-bold tracking-[2px] sm:text-[30px] md:text-[45px]">
              {product.taglineBold || product.name}
            </span>
          </h1>
          {catalogHref && (
            <a
              href={catalogHref}
              download
              className="w-fit bg-[#1E2A3B] px-5 py-3.5 text-[11px] font-bold tracking-[1.5px] text-white transition-colors hover:bg-[#24344A] sm:px-6 sm:py-4 sm:text-xs"
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
              className="h-[220px] w-full object-cover sm:h-[340px] md:h-full md:max-h-[750px]"
            />
          ) : (
            <div className="grid h-[220px] w-full place-items-center bg-[#EEF5F2] text-[#9DB5AC] sm:h-[340px] md:h-full">
              <ImageIcon className="h-12 w-12" aria-hidden />
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-[1320px] px-5 sm:px-6">
        {/* INTRO */}
        <section className="pt-10 sm:pt-14">
          <h2 className="mb-5 text-[26px] font-bold text-[#18B27F] sm:text-[32px] md:text-[45px]">
            {product.name}
            {product.badge && (
              <span className="ml-2 align-middle text-base font-semibold text-slate-400 sm:ml-3 sm:text-xl">
                ({product.badge})
              </span>
            )}
          </h2>
          {product.description ? (
            <div className={richTextBody} dangerouslySetInnerHTML={{ __html: product.description }} />
          ) : (
            product.summary && (
              <p className="text-[16px] leading-relaxed tracking-wide text-ink sm:text-[18px]">{product.summary}</p>
            )
          )}
        </section>

        {/* FEATURED CATEGORIES */}
        {product.categories.length > 0 && (
          <section className="pt-12 sm:pt-16">
            <h2 className="mb-5 text-[26px] font-bold text-[#18B27F] sm:text-[32px] md:text-[45px]">Featured Categories</h2>

            <ul className="mb-8 grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2 md:grid-cols-3">
              {product.categories.map((cat, i) => (
                <li key={cat}>
                  <FadeUp
                    delay={Math.min(i, 12) * 40}
                    className="flex items-center gap-2 text-[16px] font-semibold text-[#1C3350] sm:text-[18px]"
                  >
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
              className="inline-block bg-[#1E2A3B] px-5 py-3.5 text-[11px] font-bold tracking-[1.5px] text-white transition-colors hover:bg-[#24344A] sm:px-6 sm:py-4 sm:text-xs"
            >
              VIEW ALL PRODUCTS
            </Link>
          </section>
        )}

        {/* MEDIA */}
        {catalogHref ? (
          <section className="pb-16 pt-14 text-center sm:pb-24 sm:pt-20">
            <h2 className="mb-2 inline-block text-[24px] font-bold text-[#18B27F] sm:text-[32px]">Media</h2>

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
