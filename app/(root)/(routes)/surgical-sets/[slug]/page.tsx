import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, ChevronRight, ImageIcon } from "lucide-react";

import { SurgicalSetCard } from "@/components/site/SurgicalSetCard";
import { SurgicalSetTabs } from "@/components/site/SurgicalSetTabs";
import {
  getPublishedSurgicalSet,
  getRelatedSurgicalSets,
} from "@/lib/apis/surgical-set-queries";
import type { SurgicalSetDTO } from "@/types/surgical-set";

export const revalidate = 60;

type PageProps = { params: Promise<{ slug: string }> };

const getSet = cache((slug: string) => getPublishedSurgicalSet(decodeURIComponent(slug)));

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const set = await getSet(slug);
  if (!set) return { title: "Surgical set not found" };

  const title = set.seo?.metaTitle || `${set.name} | Motah Surgical`;
  const description = set.seo?.metaDescription || set.summary || undefined;
  const image = set.image?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image, alt: set.image?.alt || set.name }] : undefined,
    },
  };
}


/** One row of the SKU / Category / Type / Size list. */
function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 py-2">
      <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8A9A95]">{label}</dt>
      <dd className="text-sm font-medium text-[#1E2A33]">{children}</dd>
    </div>
  );
}

export default async function SurgicalSetDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const set = await getSet(slug);
  if (!set) notFound();

  const related = await getRelatedSurgicalSets(set).catch((err) => {
    console.error("[surgical-sets] related sets couldn't be loaded", err);
    return [];
  });

  return (
    <div className="bg-white text-[#4A5560]">

      <div className="mx-auto max-w-[1320px] px-6">
        {/* OVERVIEW */}
        <section className="grid grid-cols-1 gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16 lg:py-16">
          {/* self-start so the frame hugs the photo instead of stretching to the text column. */}
          <div className="overflow-hidden rounded-lg border-2 border-[#E3EAE7] bg-white shadow-[0_1px_2px_rgba(16,38,31,0.05)] lg:sticky lg:top-28 lg:self-start">
            {set.image?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={set.image.url}
                alt={set.image.alt || set.name}
                className="max-h-[620px] w-full rounded object-cover"
              />
            ) : (
              <div className="grid aspect-[4/3] w-full place-items-center rounded bg-[#F2F7F5] text-[#9DB5AC]">
                <ImageIcon className="h-12 w-12" aria-hidden />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h1 className="text-[30px] font-bold leading-[1.2] text-[#18B27F] md:text-[42px]">{set.name}</h1>

            {set.summary && (
              <p className="mt-6 text-[16px] leading-[1.8] text-[#4A5560] md:text-[17px]">{set.summary}</p>
            )}

            {set.features.length > 0 && (
              <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
                {set.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#18B27F]" aria-hidden />
                    <span className="text-[15px] font-medium text-[#1E2A33]">{feature}</span>
                  </li>
                ))}
              </ul>
            )}

            <dl className="mt-8 divide-y divide-[#EDF2F0] border-t border-[#EDF2F0]">
              {set.sku && <DetailRow label="SKU">{set.sku}</DetailRow>}
              {set.category && (
                <DetailRow label="Category">
                  <Link
                    href={`/surgical-sets?category=${encodeURIComponent(set.category)}`}
                    className="text-[#18B27F] underline-offset-4 hover:underline"
                  >
                    {set.category}
                  </Link>
                </DetailRow>
              )}
              {set.type && <DetailRow label="Type">{set.type}</DetailRow>}
              {set.size && <DetailRow label="Size">{set.size}</DetailRow>}
              {set.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-x-2 gap-y-2 py-3">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8A9A95]">Tags</dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {set.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#EDF9F5] px-2.5 py-1 text-xs font-medium text-[#0E7C58]"
                      >
                        {tag}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>

            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#1E2A3B] px-6 py-4 text-xs font-bold tracking-[1.5px] text-white transition-colors hover:bg-[#24344A]"
            >
              REQUEST A QUOTE <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>

        {/* DESCRIPTION / SPECIFICATIONS / FAQS */}
        <section className="pb-20">
          <SurgicalSetTabs
            name={set.name}
            description={set.description}
            summary={set.summary}
            items={set.items}
            specifications={set.specifications}
            faqs={set.faqs}
          />
        </section>
      </div>

      {/* RELATED SETS */}
      {related.length > 0 && (
        <section className="border-t border-[#EDF2F0] bg-[#F9FBFA]">
          <div className="mx-auto max-w-[1320px] px-6 py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-[26px] font-bold text-[#10261F] md:text-[32px]">
                {set.category ? `More ${set.category}` : "More surgical sets"}
              </h2>
              <Link
                href="/surgical-sets"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#18B27F] transition-colors hover:text-[#12915F]"
              >
                View all sets <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <SurgicalSetCard key={item._id} set={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
