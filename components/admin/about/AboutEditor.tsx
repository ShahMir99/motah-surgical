"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ExternalLink } from "lucide-react";
import {
  ABOUT_PAGE_LABELS,
  type AboutContentMap,
  type AboutContentResponse,
  type AboutSlug,
  type ComplianceContent,
  type CompanyIntroContent,
  type DownloadsContent,
  type FaqsContent,
  type MissionVisionContent,
} from "@/types/about";
import { aboutApi } from "@/lib/apis/admin-api";
import { timeAgo } from "@/lib/format";
import { Button } from "@/components/admin/ui";
import {
  CompanyIntroFields,
  ComplianceFields,
  DownloadsFields,
  FaqsFields,
  MissionVisionFields,
} from "@/components/admin/about/fields";

type Content = AboutContentMap[AboutSlug];

export function AboutEditor({ initial }: { initial: AboutContentResponse }) {
  const { slug } = initial;
  const [form, setForm] = useState<Content>(initial.content);
  const [savedSnapshot, setSavedSnapshot] = useState(() => JSON.stringify(initial.content));
  const [updatedAt, setUpdatedAt] = useState<string | null>(initial.updatedAt);
  const [saving, setSaving] = useState(false);
  const [, setTick] = useState(0);

  const dirty = useMemo(() => JSON.stringify(form) !== savedSnapshot, [form, savedSnapshot]);

  // Refresh "Saved 3 min ago".
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 30_000);
    return () => clearInterval(t);
  }, []);

  const save = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    try {
      const res = await aboutApi.save(slug, form as never);
      setForm(res.content);
      setSavedSnapshot(JSON.stringify(res.content));
      setUpdatedAt(res.updatedAt);
      toast.success(`${ABOUT_PAGE_LABELS[slug]} updated`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "The page couldn't be saved.");
    } finally {
      setSaving(false);
    }
  }, [form, saving, slug]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void save();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save]);

  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const saveText = saving
    ? "Saving…"
    : dirty
      ? "Unsaved changes"
      : updatedAt
        ? `Saved ${timeAgo(updatedAt)}`
        : "Showing the original content";

  return (
    <div className="pb-16">
      <div className="sticky top-14 z-20 border-b border-[#DCE3E0] bg-white/95 backdrop-blur lg:top-0">
        <div className="mx-auto flex h-16 max-w-4xl items-center gap-3 px-4 sm:px-6">
          <h1 className="truncate text-base font-semibold text-[#10261F]">About · {ABOUT_PAGE_LABELS[slug]}</h1>
          <span className="hidden truncate text-sm text-[#5E716B] sm:inline" aria-live="polite">
            {saveText}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <a
              href={`/about/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-10 items-center gap-1.5 rounded-md px-3 text-sm font-medium text-[#3E534C] hover:bg-[#EEF1F0] hover:text-[#10261F] md:inline-flex"
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
              View page
            </a>
            <Button variant="primary" onClick={save} loading={saving} disabled={!dirty}>
              Save changes
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:py-8">
        {slug === "company-introduction" && (
          <CompanyIntroFields form={form as CompanyIntroContent} onChange={setForm} />
        )}
        {slug === "mission-vision" && (
          <MissionVisionFields form={form as MissionVisionContent} onChange={setForm} />
        )}
        {slug === "compliance" && <ComplianceFields form={form as ComplianceContent} onChange={setForm} />}
        {slug === "downloads" && <DownloadsFields form={form as DownloadsContent} onChange={setForm} />}
        {slug === "faqs" && <FaqsFields form={form as FaqsContent} onChange={setForm} />}
      </div>
    </div>
  );
}
