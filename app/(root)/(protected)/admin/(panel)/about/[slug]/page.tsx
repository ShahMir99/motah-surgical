"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { isAboutSlug, type AboutContentResponse } from "@/types/about";
import { aboutApi } from "@/lib/apis/admin-api";
import { AboutEditor } from "@/components/admin/about/AboutEditor";
import { buttonClass } from "@/components/admin/ui";

export default function AboutSubPage() {
  const { slug } = useParams<{ slug: string }>();
  const [result, setResult] = useState<{ slug: string; data?: AboutContentResponse; error?: string } | null>(null);

  useEffect(() => {
    if (!isAboutSlug(slug)) return;
    let active = true;
    aboutApi
      .get(slug)
      .then((data) => active && setResult({ slug, data }))
      .catch(
        (err: unknown) =>
          active && setResult({ slug, error: err instanceof Error ? err.message : "The page couldn't be loaded." })
      );
    return () => {
      active = false;
    };
  }, [slug]);

  // Ignore a result that belongs to the page we just navigated away from.
  const current = result?.slug === slug ? result : null;
  const data = current?.data ?? null;
  const error = current?.error ?? null;

  if (!isAboutSlug(slug) || error) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="text-lg font-semibold">This page couldn&apos;t be opened</h1>
        <p className="mt-2 text-sm text-[#5E716B]">{error ?? "There is no About page with this name."}</p>
        <Link href="/admin/about/company-introduction" className={buttonClass("secondary", "md", "mt-6")}>
          Back to About pages
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div aria-busy="true" aria-label="Loading page" className="animate-pulse">
        <div className="h-16 border-b border-[#DCE3E0] bg-white" />
        <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
          <div className="h-64 rounded-lg border border-[#DCE3E0] bg-white" />
          <div className="h-48 rounded-lg border border-[#DCE3E0] bg-white" />
        </div>
      </div>
    );
  }

  return <AboutEditor key={data.slug} initial={data} />;
}
