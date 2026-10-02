"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ExternalLink, Plus, X } from "lucide-react";
import type { HomeContent, HomeContentResponse } from "@/types/home";
import { homeApi } from "@/lib/apis/admin-api";
import { timeAgo } from "@/lib/format";
import { Button, Field, inputClass } from "@/components/admin/ui";
import { LINK_HINT, Section, TextField } from "@/components/admin/content-parts";
import { CoverImageField } from "@/components/admin/blogs/CoverImageField";

type Item = HomeContent["highlights"]["items"][number];

export function HomeForm({ initial }: { initial: HomeContentResponse }) {
  const [form, setForm] = useState<HomeContent>(initial.content);
  const [savedSnapshot, setSavedSnapshot] = useState(() => JSON.stringify(initial.content));
  const [updatedAt, setUpdatedAt] = useState<string | null>(initial.updatedAt);
  const [saving, setSaving] = useState(false);
  const [, setTick] = useState(0);

  const dirty = useMemo(() => JSON.stringify(form) !== savedSnapshot, [form, savedSnapshot]);

  function patch<K extends "hero" | "products" | "about" | "highlights" | "exhibition">(
    key: K,
    value: Partial<HomeContent[K]>
  ) {
    setForm((f) => ({ ...f, [key]: { ...f[key], ...value } }));
  }

  function patchItem(index: number, value: Partial<Item>) {
    setForm((f) => ({
      ...f,
      highlights: {
        ...f.highlights,
        items: f.highlights.items.map((it, i) => (i === index ? { ...it, ...value } : it)),
      },
    }));
  }

  // Refresh "Saved 3 min ago".
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 30_000);
    return () => clearInterval(t);
  }, []);

  const save = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    try {
      const res = await homeApi.save(form);
      setForm(res.content);
      setSavedSnapshot(JSON.stringify(res.content));
      setUpdatedAt(res.updatedAt);
      toast.success("Home page updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "The home page couldn't be saved.");
    } finally {
      setSaving(false);
    }
  }, [form, saving]);

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
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
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
          <h1 className="text-base font-semibold text-[#10261F]">Home page</h1>
          <span className="hidden truncate text-sm text-[#5E716B] sm:inline" aria-live="polite">
            {saveText}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-10 items-center gap-1.5 rounded-md px-3 text-sm font-medium text-[#3E534C] hover:bg-[#EEF1F0] hover:text-[#10261F] md:inline-flex"
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
              View site
            </a>
            <Button variant="primary" onClick={save} loading={saving} disabled={!dirty}>
              Save changes
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:py-8">
        <Section title="Hero banner" description="The large image at the top of the page and the green box on it.">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_280px]">
            <div className="space-y-5">
              <TextField id="hero-eyebrow" label="Small title" value={form.hero.eyebrow} max={80} onChange={(v) => patch("hero", { eyebrow: v })} />
              <TextField id="hero-heading" label="Heading" multiline value={form.hero.heading} max={220} onChange={(v) => patch("hero", { heading: v })} />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField id="hero-btn" label="Button text" value={form.hero.buttonLabel} max={60} onChange={(v) => patch("hero", { buttonLabel: v })} />
                <TextField id="hero-href" label="Button link" hint={LINK_HINT} value={form.hero.buttonHref} max={300} onChange={(v) => patch("hero", { buttonHref: v })} />
              </div>
            </div>
            <Field label="Background image" hint="Leave empty to keep the original image.">
              <CoverImageField id="hero-image" noun="hero image" hint="1920×1280 works best." value={form.hero.image} onChange={(image) => patch("hero", { image })} />
            </Field>
          </div>
        </Section>

        <Section title="Certification strip" description="The short labels shown under the hero (up to 8).">
          <div className="space-y-2">
            {form.badges.map((badge, i) => (
              <div key={i} className="flex gap-2">
                <input
                  aria-label={`Label ${i + 1}`}
                  value={badge}
                  maxLength={60}
                  onChange={(e) => setForm((f) => ({ ...f, badges: f.badges.map((b, j) => (j === i ? e.target.value : b)) }))}
                  className={inputClass}
                />
                <Button
                  variant="ghost"
                  aria-label={`Remove label ${i + 1}`}
                  onClick={() => setForm((f) => ({ ...f, badges: f.badges.filter((_, j) => j !== i) }))}
                >
                  <X />
                </Button>
              </div>
            ))}
            {form.badges.length < 8 && (
              <Button size="sm" onClick={() => setForm((f) => ({ ...f, badges: [...f.badges, ""] }))}>
                <Plus /> Add label
              </Button>
            )}
          </div>
        </Section>

        <Section
          title="Products section"
          description="The cards come from your Products tab: published products, in the order set there. Change a product's image, name or order there."
        >
          <TextField id="prod-eyebrow" label="Small title" value={form.products.eyebrow} max={80} onChange={(v) => patch("products", { eyebrow: v })} />
          <TextField id="prod-heading" label="Heading" value={form.products.heading} max={120} onChange={(v) => patch("products", { heading: v })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField id="prod-btn" label="Button text" value={form.products.buttonLabel} max={60} onChange={(v) => patch("products", { buttonLabel: v })} />
            <Field label="Products to show" htmlFor="prod-limit" hint="Between 1 and 24.">
              <input
                id="prod-limit"
                type="number"
                min={1}
                max={24}
                value={form.products.limit}
                onChange={(e) => patch("products", { limit: Number(e.target.value) })}
                className={inputClass}
              />
            </Field>
          </div>
        </Section>

        <Section title="About section" description="The green block with the picture and the company text.">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_280px]">
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField id="about-prefix" label="Light text" value={form.about.prefix} max={40} onChange={(v) => patch("about", { prefix: v })} />
                <TextField id="about-title" label="Bold title" value={form.about.title} max={80} onChange={(v) => patch("about", { title: v })} />
              </div>
              <TextField id="about-body" label="Paragraph" multiline value={form.about.body} max={1500} onChange={(v) => patch("about", { body: v })} />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField id="about-btn" label="Button text" value={form.about.buttonLabel} max={60} onChange={(v) => patch("about", { buttonLabel: v })} />
                <TextField id="about-href" label="Button link" hint={LINK_HINT} value={form.about.buttonHref} max={300} onChange={(v) => patch("about", { buttonHref: v })} />
              </div>
            </div>
            <Field label="Image" hint="Leave empty to keep the original image.">
              <CoverImageField id="about-image" noun="about image" hint="4:3 works best." value={form.about.image} onChange={(image) => patch("about", { image })} />
            </Field>
          </div>
        </Section>

        <Section title="Highlights" description="Image cards that reveal text when hovered.">
          <TextField id="hl-eyebrow" label="Small title" value={form.highlights.eyebrow} max={80} onChange={(v) => patch("highlights", { eyebrow: v })} />
          <TextField id="hl-heading" label="Heading" value={form.highlights.heading} max={140} onChange={(v) => patch("highlights", { heading: v })} />
          <div className="grid gap-4 lg:grid-cols-2">
            {form.highlights.items.map((item, i) => (
              <div key={i} className="space-y-4 rounded-md border border-[#E6ECEA] p-4">
                <p className="text-sm font-semibold text-[#10261F]">Card {i + 1}</p>
                <CoverImageField id={`hl-image-${i}`} noun="card image" hint="4:3 works best." value={item.image} onChange={(image) => patchItem(i, { image })} />
                <TextField id={`hl-h-${i}`} label="Heading" value={item.heading} max={100} onChange={(v) => patchItem(i, { heading: v })} />
                <TextField id={`hl-b-${i}`} label="Text" multiline value={item.blurb} max={600} onChange={(v) => patchItem(i, { blurb: v })} />
                <TextField id={`hl-l-${i}`} label="Link" hint={LINK_HINT} value={item.href} max={300} onChange={(v) => patchItem(i, { href: v })} />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Upcoming exhibitions" description="The last section on the page.">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_280px]">
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField id="ex-top" label="Title, line 1" value={form.exhibition.titleTop} max={40} onChange={(v) => patch("exhibition", { titleTop: v })} />
                <TextField id="ex-bottom" label="Title, line 2" value={form.exhibition.titleBottom} max={40} onChange={(v) => patch("exhibition", { titleBottom: v })} />
              </div>
              <TextField id="ex-text" label="Event details" multiline value={form.exhibition.text} max={220} onChange={(v) => patch("exhibition", { text: v })} />
            </div>
            <Field label="Image" hint="Leave empty to keep the original image.">
              <CoverImageField id="ex-image" noun="exhibition image" hint="2:1 works best." value={form.exhibition.image} onChange={(image) => patch("exhibition", { image })} />
            </Field>
          </div>
        </Section>
      </div>
    </div>
  );
}
