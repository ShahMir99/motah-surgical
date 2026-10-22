import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, PackageSearch } from "lucide-react";

import { SurgicalSetCard } from "@/components/site/SurgicalSetCard";
import { getPublishedSurgicalSets, getSurgicalSetCategories } from "@/lib/apis/surgical-set-queries";
import type { SurgicalSetCategory, SurgicalSetListItem } from "@/types/surgical-set";

export const metadata: Metadata = {
  title: "Surgical Sets | Motah Surgical",
  description:
    "Complete, procedure-ready surgical instrument sets from Motah Surgical — assembled and finished in Saudi Arabia for hospital operating rooms and tender requirements.",
};

// Admin changes refresh this page right away; this is a fallback interval.
export const revalidate = 60;

const PAGE_SIZE = 20;

type PageProps = { searchParams: Promise<{ page?: string; category?: string }> };

/** Keeps the category when paging, and drops page=1 from the URL. */
function buildHref(category: string | undefined, page: number) {
  const qs = new URLSearchParams();
  if (category) qs.set("category", category);
  if (page > 1) qs.set("page", String(page));
  const query = qs.toString();
  return query ? `/surgical-sets?${query}` : "/surgical-sets";
}

function Hero() {
  return (
    <section className="relative">
      <div className="absolute inset-0 bg-primary-dark" />

      <div className="relative mx-auto flex max-w-6xl flex-col lg:h-[360px] lg:flex-row">
        <div className="relative flex h-[440px] w-full flex-col justify-center bg-[#18B27F] px-8 py-14 lg:w-[510px] lg:shrink-0 lg:px-16 lg:py-0">
          <p className="mb-4 text-xl font-bold tracking-[0.3em] text-white">Surgical Sets</p>
          <h1 className="text-3xl font-light leading-tight text-white lg:text-[2.8rem]">
            Integrated Instruments <br className="hidden lg:block" />
            for Advanced <span className="font-bold">Procedure Standards</span>
          </h1>
          <Link
            href="/about/downloads"
            className="mt-8 w-fit rounded-xl bg-primary-dark px-6 py-3 text-base font-semibold tracking-wider text-white transition-colors hover:bg-[#0F2A38]"
          >
            DOWNLOAD CATALOGUE
          </Link>
        </div>

        <div className="flex items-center px-8 py-10 lg:px-16 lg:py-0">
          <p className="w-full text-lg leading-relaxed text-white/90">
            Every Motah Surgical set arrives complete and theatre-ready: each instrument is matched to the procedure,
            counted into the tray and finished to the same standard as our single instruments. Built for hospital
            operating rooms and tender requirements across Saudi Arabia, and fully compliant with SFDA and ISO
            13485:2016 requirements. Browse the sets below, or filter by specialty to find the tray you need.
          </p>
        </div>
      </div>
    </section>
  );
}

function CategorySidebar({
  categories,
  active,
  total,
}: {
  categories: SurgicalSetCategory[];
  active?: string;
  total: number;
}) {
  const linkClass = (isActive: boolean) =>
    `flex items-start justify-between gap-3 border-l-2 py-2.5 pl-4 pr-2 text-sm transition-colors ${
      isActive
        ? "border-[#18B27F] bg-[#F1FAF6] font-semibold text-[#10261F]"
        : "border-transparent font-medium text-[#5E716B] hover:border-[#18B27F]/40 hover:bg-[#F7FAF9] hover:text-[#10261F]"
    }`;

  return (
    <aside className="lg:sticky lg:top-28 lg:self-start">
      <h2 className="rule-accent text-sm font-bold uppercase tracking-[0.22em] text-[#10261F]">Categories</h2>

      <nav className="mt-7 flex flex-col" aria-label="Surgical set categories">
        <Link href={buildHref(undefined, 1)} className={linkClass(!active)}>
          <span>All Sets</span>
          <span className="mt-px shrink-0 text-xs tabular-nums text-[#8A9A95]">{total}</span>
        </Link>
        {categories.map((category) => (
          <Link
            key={category.name}
            href={buildHref(category.name, 1)}
            aria-current={active === category.name ? "page" : undefined}
            className={linkClass(active === category.name)}
          >
            <span>{category.name}</span>
            <span className="mt-px shrink-0 text-xs tabular-nums text-[#8A9A95]">{category.count}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

function Pagination({ page, pages, category }: { page: number; pages: number; category?: string }) {
  if (pages <= 1) return null;

  const numbers = Array.from({ length: pages }, (_, i) => i + 1);
  const base = "grid h-10 min-w-10 place-items-center rounded-md border px-3 text-sm font-semibold transition-colors";

  return (
    <nav className="mt-12 flex flex-wrap items-center gap-2" aria-label="Pagination">
      {numbers.map((n) =>
        n === page ? (
          <span key={n} aria-current="page" className={`${base} border-[#18B27F] bg-[#18B27F] text-white`}>
            {n}
          </span>
        ) : (
          <Link
            key={n}
            href={buildHref(category, n)}
            aria-label={`Page ${n}`}
            className={`${base} border-[#D9E3DF] bg-white text-[#10261F] hover:border-[#18B27F] hover:text-[#18B27F]`}
          >
            {n}
          </Link>
        )
      )}
    </nav>
  );
}

function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div className="rounded-lg border border-dashed border-[#D9E3DF] bg-[#F9FBFA] px-6 py-20 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#E1F5EC] text-[#0E7C58]">
        <PackageSearch className="h-5 w-5" aria-hidden />
      </div>
      <p className="mt-4 font-semibold text-[#10261F]">
        {filtered ? "No sets in this category yet" : "Our surgical sets are being added"}
      </p>
      <p className="mx-auto mt-1.5 max-w-sm text-sm text-[#5E716B]">
        {filtered
          ? "Browse every set instead, or get in touch and we will assemble one to your specification."
          : "We are finalising our specialty trays. Please check back soon, or contact us for a tailored set."}
      </p>
      <Link
        href={filtered ? "/surgical-sets" : "/contact"}
        className="mt-6 inline-block rounded-md bg-[#1E2A3B] px-6 py-3 text-xs font-bold tracking-[1.5px] text-white transition-colors hover:bg-[#24344A]"
      >
        {filtered ? "VIEW ALL SETS" : "CONTACT US"}
      </Link>
    </div>
  );
}

function CtaBanner() {
  return (
    <section className="border-b border-white bg-primary-dark">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row lg:px-10">
        <p className="text-sm font-bold tracking-wide text-white">NEED A SET BUILT TO YOUR OWN INSTRUMENT LIST?</p>
        <Link
          href="/contact"
          className="flex items-center gap-2 rounded bg-[#18B27F] px-5 py-2.5 text-xs font-bold tracking-wide text-white transition-colors hover:bg-[#12915F]"
        >
          TALK TO OUR TEAM <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}

export default async function SurgicalSetsPage({ searchParams }: PageProps) {
  const { page: pageParam, category: categoryParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const category = categoryParam?.trim() || undefined;

  const [categories, list] = await Promise.all([
    getSurgicalSetCategories().catch((err) => {
      console.error("[surgical-sets] categories couldn't be loaded", err);
      return [] as SurgicalSetCategory[];
    }),
    getPublishedSurgicalSets({ page, limit: PAGE_SIZE, category }).catch((err) => {
      console.error("[surgical-sets] list couldn't be loaded", err);
      return { items: [] as SurgicalSetListItem[], total: 0, page: 1, pages: 1 };
    }),
  ]);

  const categoryTotal = categories.reduce((sum, c) => sum + c.count, 0);
  const heading = category || "List of Surgical Sets";
  const first = (list.page - 1) * PAGE_SIZE + 1;
  const last = Math.min(list.page * PAGE_SIZE, list.total);

  return (
    <div className="min-h-screen bg-white">
      <Hero />

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-44">
        <div className="grid gap-12 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-16">
          <CategorySidebar categories={categories} active={category} total={Math.max(categoryTotal, list.total)} />

          <div className="min-w-0">
            <header className="border-b border-[#E7EDEB] pb-6">
              <h2 className="text-[30px] font-bold leading-tight text-[#18B27F] lg:text-[38px]">{heading}</h2>
              <p className="mt-2 text-base text-[#5E716B]">
                {list.total > 0
                  ? `Showing ${first}–${last} of ${list.total} ${list.total === 1 ? "set" : "sets"} in our catalogue.`
                  : "Complete instrument trays, assembled by procedure."}
              </p>
            </header>

            {list.items.length ? (
              <>
                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {list.items.map((set) => (
                    <SurgicalSetCard key={set._id} set={set} />
                  ))}
                </div>
                <Pagination page={list.page} pages={list.pages} category={category} />
              </>
            ) : (
              <div className="mt-8">
                <EmptyState filtered={Boolean(category)} />
              </div>
            )}
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
