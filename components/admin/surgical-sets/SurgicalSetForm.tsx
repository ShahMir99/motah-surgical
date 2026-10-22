"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { ArrowLeft, ExternalLink, Trash2 } from "lucide-react";

import type { SurgicalSetDTO, SurgicalSetFields, SurgicalSetStatus } from "@/types/surgical-set";
import { surgicalSetsApi } from "@/lib/apis/admin-api";
import { slugify, stripHtml } from "@/lib/blog-utils";
import { formatDate, timeAgo } from "@/lib/format";
import { Button, CharCount, Field, inputClass } from "@/components/admin/ui";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { StatusBadge } from "@/components/admin/blogs/StatusBadge";
import { RichTextEditor } from "@/components/admin/blogs/RichTextEditor";
import { CoverImageField } from "@/components/admin/blogs/CoverImageField";
import { TagInput } from "@/components/admin/blogs/TagInput";
import { SeoPreview } from "@/components/admin/blogs/SeoPreview";
import { FaqsField, SetItemsField, SpecificationsField } from "./RowFields";

type SaveAction = "draft" | "publish" | "update" | "unpublish";

const SUCCESS: Record<SaveAction, string> = {
  draft: "Draft saved",
  publish: "Set published",
  update: "Set updated",
  unpublish: "Set unpublished",
};

/** Offered under the Category box so spellings stay consistent between sets. */
const CATEGORY_SUGGESTIONS = [
  "General Surgery Instruments",
  "Orthopedic Instruments",
  "Dental Instruments",
  "ENT Instruments",
  "Ophthalmic Instruments",
  "Gynaecology Instruments",
  "Cardiovascular Instruments",
  "Neurosurgery Instruments",
  "Plastic Surgery Instruments",
  "Veterinary Instruments",
];

function toForm(s?: SurgicalSetDTO): SurgicalSetFields {
  return {
    name: s?.name ?? "",
    slug: s?.slug ?? "",
    category: s?.category ?? "",
    summary: s?.summary ?? "",
    description: s?.description ?? "",
    features: s?.features ?? [],
    items: s?.items ?? [],
    specifications: s?.specifications ?? [],
    faqs: s?.faqs ?? [],
    sku: s?.sku ?? "",
    type: s?.type ?? "Surgical Set",
    size: s?.size ?? "",
    tags: s?.tags ?? [],
    image: s?.image ?? null,
    order: s?.order ?? 0,
    seo: { metaTitle: s?.seo?.metaTitle ?? "", metaDescription: s?.seo?.metaDescription ?? "" },
  };
}

export function SurgicalSetForm({ initial }: { initial?: SurgicalSetDTO }) {
  const router = useRouter();
  const [setId, setSetId] = useState<string | null>(initial?._id ?? null);
  const [status, setStatus] = useState<SurgicalSetStatus>(initial?.status ?? "draft");
  const [publishedAt, setPublishedAt] = useState<string | null>(initial?.publishedAt ?? null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(initial?.updatedAt ?? null);
  const [form, setForm] = useState<SurgicalSetFields>(() => toForm(initial));
  const [savedSnapshot, setSavedSnapshot] = useState(() => JSON.stringify(toForm(initial)));
  const [slugEdited, setSlugEdited] = useState(Boolean(initial));
  const [saving, setSaving] = useState<SaveAction | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [dialog, setDialog] = useState<"delete" | "leave" | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [, setTick] = useState(0);
  const nameRef = useRef<HTMLTextAreaElement>(null);

  const dirty = useMemo(() => JSON.stringify(form) !== savedSnapshot, [form, savedSnapshot]);
  const isPublished = status === "published";

  function update<K extends keyof SurgicalSetFields>(key: K, value: SurgicalSetFields[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }
  const onDescriptionChange = useCallback((html: string) => setForm((f) => ({ ...f, description: html })), []);

  // Grow the name field with its text.
  useLayoutEffect(() => {
    const el = nameRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [form.name]);

  // Refresh "Saved 3 min ago".
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 30_000);
    return () => clearInterval(t);
  }, []);

  const save = useCallback(
    async (action: SaveAction) => {
      if (saving) return;
      if (!form.name.trim()) {
        setNameError("Add a set name to save.");
        nameRef.current?.focus();
        return;
      }
      const nextStatus: SurgicalSetStatus = action === "draft" || action === "unpublish" ? "draft" : "published";
      if (nextStatus === "published" && !form.summary.trim() && !stripHtml(form.description) && !form.items.length) {
        toast.error("Add a summary, a description or the set list before publishing.");
        return;
      }

      setSaving(action);
      const sent = form;
      try {
        const { order, ...rest } = sent;
        const payload = {
          ...rest,
          // A new set left at 0 is placed at the end of the list by the server.
          ...(setId || order !== 0 ? { order } : {}),
          slug: sent.slug || slugify(sent.name),
          status: nextStatus,
        };
        const res = setId ? await surgicalSetsApi.update(setId, payload) : await surgicalSetsApi.create(payload);

        setForm((f) => ({ ...f, slug: res.slug, order: res.order }));
        setSavedSnapshot(JSON.stringify({ ...sent, slug: res.slug, order: res.order }));
        setSlugEdited(true);
        setStatus(res.status);
        setPublishedAt(res.publishedAt);
        setUpdatedAt(res.updatedAt);

        if (!setId) {
          setSetId(res._id);
          window.history.replaceState(null, "", `/admin/surgical-sets/${res._id}`);
        }
        toast.success(SUCCESS[action]);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "The set couldn't be saved.");
      } finally {
        setSaving(null);
      }
    },
    [setId, form, saving]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void save(isPublished ? "update" : "draft");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save, isPublished]);

  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  async function deleteSet() {
    if (!setId) return;
    setDeleting(true);
    try {
      await surgicalSetsApi.remove(setId);
      setSavedSnapshot(JSON.stringify(form));
      toast.success("Set deleted");
      router.push("/admin/surgical-sets");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "The set couldn't be deleted.");
      setDeleting(false);
    }
  }

  const saveText = saving
    ? "Saving…"
    : dirty
      ? "Unsaved changes"
      : updatedAt
        ? `Saved ${timeAgo(updatedAt)}`
        : "Not saved yet";

  return (
    <div className="pb-16">
      {/* Action bar */}
      <div className="sticky top-14 z-20 border-b border-[#DCE3E0] bg-white/95 backdrop-blur lg:top-0">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-10">
          <Link
            href="/admin/surgical-sets"
            onClick={(e) => {
              if (dirty) {
                e.preventDefault();
                setDialog("leave");
              }
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-[#3E534C] hover:bg-[#EEF1F0] hover:text-[#10261F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18B27F]/60"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Surgical sets</span>
          </Link>
          <span className="hidden h-5 w-px bg-[#DCE3E0] sm:block" aria-hidden />
          <StatusBadge status={status} />
          <span className="hidden truncate text-sm text-[#5E716B] md:inline" aria-live="polite">
            {saveText}
          </span>

          <div className="ml-auto flex items-center gap-2">
            {isPublished && form.slug && (
              <a
                href={`/surgical-sets/${form.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden h-10 items-center gap-1.5 rounded-md px-3 text-sm font-medium text-[#3E534C] hover:bg-[#EEF1F0] hover:text-[#10261F] md:inline-flex"
              >
                <ExternalLink className="h-4 w-4" aria-hidden />
                View
              </a>
            )}
            {isPublished ? (
              <>
                <Button variant="ghost" onClick={() => save("unpublish")} loading={saving === "unpublish"} disabled={!!saving}>
                  Unpublish
                </Button>
                <Button variant="primary" onClick={() => save("update")} loading={saving === "update"} disabled={!!saving || !dirty}>
                  Update
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => save("draft")} loading={saving === "draft"} disabled={!!saving}>
                  Save draft
                </Button>
                <Button variant="primary" onClick={() => save("publish")} loading={saving === "publish"} disabled={!!saving}>
                  Publish
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-10 lg:py-8">
        {/* Main content */}
        <div className="min-w-0 space-y-6">
          <div className="rounded-lg border border-[#DCE3E0] bg-white shadow-[0_1px_2px_rgba(16,38,31,0.05)]">
            <div className="space-y-6 px-6 pb-8 pt-8 sm:px-12 sm:pt-12">
              <div>
                <label htmlFor="set-name" className="sr-only">
                  Set name
                </label>
                <textarea
                  id="set-name"
                  ref={nameRef}
                  rows={1}
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value.replace(/\n/g, " ");
                    setNameError(null);
                    setForm((f) => ({ ...f, name, slug: slugEdited ? f.slug : slugify(name) }));
                  }}
                  placeholder="Set name, e.g. Abdominal Hysterectomy Instrument Set"
                  aria-invalid={Boolean(nameError)}
                  aria-describedby={nameError ? "name-error" : undefined}
                  className="font-editorial block w-full resize-none overflow-hidden border-0 bg-transparent p-0 text-3xl font-bold leading-tight text-[#10261F] placeholder:text-[#B5C2BE] focus:outline-none focus:ring-0 sm:text-[2.5rem]"
                />
                {nameError && (
                  <p id="name-error" className="mt-2 text-sm text-[#B42318]">
                    {nameError}
                  </p>
                )}
              </div>

              <Field
                label="Summary"
                htmlFor="summary"
                aside={<CharCount value={form.summary} ideal={280} max={600} />}
                hint="The intro paragraph beside the photo on the set page."
              >
                <textarea
                  id="summary"
                  rows={4}
                  value={form.summary}
                  onChange={(e) => update("summary", e.target.value)}
                  placeholder="What this set is for, and who uses it."
                  className={`${inputClass} resize-y`}
                />
              </Field>

              <Field
                label="Highlights"
                htmlFor="features"
                hint="Ticked points beside the photo, e.g. Precision Engineering, ISO-Certified. Press Enter after each one."
              >
                <TagInput id="features" value={form.features} onChange={(f) => update("features", f)} max={20} />
              </Field>
            </div>
          </div>

          <section className="rounded-lg border border-[#DCE3E0] bg-white shadow-[0_1px_2px_rgba(16,38,31,0.05)]">
            <div className="border-b border-[#E6ECEA] px-6 py-4 sm:px-12">
              <h2 className="text-sm font-semibold text-[#10261F]">Description</h2>
              <p className="mt-0.5 text-xs text-[#5E716B]">The text under the Description tab on the set page.</p>
            </div>
            <RichTextEditor value={form.description} onChange={onDescriptionChange} />
          </section>

          <Section
            title="Set list"
            description="The “Our set includes” table under the Description tab, numbered in this order."
          >
            <SetItemsField value={form.items} onChange={(items) => update("items", items)} />
          </Section>

          <Section
            title="Technical specifications"
            description="Shown under their own tab. Leave empty and the tab stays hidden."
          >
            <SpecificationsField value={form.specifications} onChange={(s) => update("specifications", s)} />
          </Section>

          <Section title="FAQs" description="Shown under their own tab. Leave empty and the tab stays hidden.">
            <FaqsField value={form.faqs} onChange={(faqs) => update("faqs", faqs)} />
          </Section>
        </div>

        {/* Settings */}
        <aside className="min-w-0 space-y-4">
          <Panel title="Set details">
            <dl className="grid grid-cols-2 gap-3 rounded-md bg-[#F6F8F7] p-3 text-xs">
              <div>
                <dt className="text-[#5E716B]">Published</dt>
                <dd className="mt-0.5 font-medium text-[#10261F]">{publishedAt ? formatDate(publishedAt) : "Not yet"}</dd>
              </div>
              <div>
                <dt className="text-[#5E716B]">Instruments</dt>
                <dd className="mt-0.5 font-medium tabular-nums text-[#10261F]">{form.items.length}</dd>
              </div>
            </dl>

            <Field
              label="Category"
              htmlFor="category"
              hint="Groups the set in the sidebar on the Surgical Sets page."
            >
              <input
                id="category"
                list="set-category-suggestions"
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                placeholder="General Surgery Instruments"
                className={inputClass}
              />
              <datalist id="set-category-suggestions">
                {CATEGORY_SUGGESTIONS.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Field>

            <Field label="URL slug" htmlFor="slug" hint={<span className="break-all">/surgical-sets/{form.slug || "set-url"}</span>}>
              <input
                id="slug"
                value={form.slug}
                onChange={(e) => {
                  setSlugEdited(true);
                  update("slug", e.target.value);
                }}
                onBlur={() => update("slug", slugify(form.slug) || slugify(form.name))}
                placeholder="generated-from-name"
                className={inputClass}
              />
            </Field>

            <Field label="List order" htmlFor="order" hint="Lower numbers come first on the Surgical Sets page.">
              <input
                id="order"
                type="number"
                inputMode="numeric"
                value={Number.isFinite(form.order) ? form.order : 0}
                onChange={(e) => update("order", e.target.value === "" ? 0 : Number(e.target.value))}
                className={inputClass}
              />
            </Field>
          </Panel>

          <Panel title="Product details">
            <Field label="SKU" htmlFor="sku">
              <input
                id="sku"
                value={form.sku}
                maxLength={40}
                onChange={(e) => update("sku", e.target.value)}
                placeholder="1180"
                className={inputClass}
              />
            </Field>

            <Field label="Type" htmlFor="type">
              <input
                id="type"
                value={form.type}
                maxLength={60}
                onChange={(e) => update("type", e.target.value)}
                placeholder="Surgical Set"
                className={inputClass}
              />
            </Field>

            <Field label="Size" htmlFor="size">
              <input
                id="size"
                value={form.size}
                maxLength={120}
                onChange={(e) => update("size", e.target.value)}
                placeholder="Different sizes are available"
                className={inputClass}
              />
            </Field>

            <Field label="Tags" htmlFor="tags" hint="Shown at the bottom of the details list. Press Enter after each one.">
              <TagInput id="tags" value={form.tags} onChange={(t) => update("tags", t)} max={30} />
            </Field>
          </Panel>

          <Panel title="Set image">
            <CoverImageField
              value={form.image}
              onChange={(img) => update("image", img)}
              noun="set image"
              id="set-image"
              hint="a photo of the full tray on white works best, around 1200×900."
            />
          </Panel>

          <Panel title="Search engine listing">
            <Field
              label="Meta title"
              htmlFor="meta-title"
              aside={<CharCount value={form.seo.metaTitle} ideal={60} max={70} />}
              hint="Leave empty to use the set name."
            >
              <input
                id="meta-title"
                value={form.seo.metaTitle}
                onChange={(e) => update("seo", { ...form.seo, metaTitle: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field
              label="Meta description"
              htmlFor="meta-description"
              aside={<CharCount value={form.seo.metaDescription} ideal={160} max={170} />}
              hint="Leave empty to use the summary."
            >
              <textarea
                id="meta-description"
                rows={3}
                value={form.seo.metaDescription}
                onChange={(e) => update("seo", { ...form.seo, metaDescription: e.target.value })}
                className={`${inputClass} resize-y`}
              />
            </Field>
            <SeoPreview
              title={form.seo.metaTitle || form.name}
              description={form.seo.metaDescription || form.summary}
              slug={form.slug}
              section="surgical-sets"
            />
          </Panel>

          {setId && (
            <Button variant="ghost" className="w-full text-[#B42318] hover:bg-[#FDF0EE] hover:text-[#99201A]" onClick={() => setDialog("delete")}>
              <Trash2 aria-hidden />
              Delete set
            </Button>
          )}
        </aside>
      </div>

      <ConfirmDialog
        open={dialog === "delete"}
        title="Delete this set?"
        description="It will be removed from the website along with its image. This can't be undone."
        confirmLabel="Delete set"
        loading={deleting}
        onConfirm={deleteSet}
        onCancel={() => setDialog(null)}
      />
      <ConfirmDialog
        open={dialog === "leave"}
        title="Leave without saving?"
        description="Your changes since the last save will be lost."
        confirmLabel="Leave"
        cancelLabel="Keep editing"
        onConfirm={() => {
          setSavedSnapshot(JSON.stringify(form));
          router.push("/admin/surgical-sets");
        }}
        onCancel={() => setDialog(null)}
      />
    </div>
  );
}

function Section({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-[#DCE3E0] bg-white shadow-[0_1px_2px_rgba(16,38,31,0.05)]">
      <div className="border-b border-[#E6ECEA] px-6 py-4 sm:px-12">
        <h2 className="text-sm font-semibold text-[#10261F]">{title}</h2>
        <p className="mt-0.5 text-xs text-[#5E716B]">{description}</p>
      </div>
      <div className="px-6 py-6 sm:px-12">{children}</div>
    </section>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-[#DCE3E0] bg-white">
      <h2 className="border-b border-[#E6ECEA] px-4 py-3 text-sm font-semibold text-[#10261F]">{title}</h2>
      <div className="space-y-4 p-4">{children}</div>
    </section>
  );
}
