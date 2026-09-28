"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { ArrowLeft, ExternalLink, Trash2 } from "lucide-react";
import type { ProductDTO, ProductFields, ProductStatus } from "@/types/product";
import { productsApi } from "@/lib/apis/admin-api";
import { slugify, stripHtml } from "@/lib/blog-utils";
import { formatDate, timeAgo } from "@/lib/format";
import { Button, CharCount, Field, inputClass } from "@/components/admin/ui";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { StatusBadge } from "@/components/admin/blogs/StatusBadge";
import { RichTextEditor } from "@/components/admin/blogs/RichTextEditor";
import { CoverImageField } from "@/components/admin/blogs/CoverImageField";
import { TagInput } from "@/components/admin/blogs/TagInput";
import { SeoPreview } from "@/components/admin/blogs/SeoPreview";
import { CatalogField } from "./CatalogField";

type SaveAction = "draft" | "publish" | "update" | "unpublish";

const SUCCESS: Record<SaveAction, string> = {
  draft: "Draft saved",
  publish: "Product published",
  update: "Product updated",
  unpublish: "Product unpublished",
};

function toForm(p?: ProductDTO): ProductFields {
  return {
    name: p?.name ?? "",
    slug: p?.slug ?? "",
    tagline: p?.tagline ?? "",
    taglineBold: p?.taglineBold ?? "",
    summary: p?.summary ?? "",
    description: p?.description ?? "",
    categories: p?.categories ?? [],
    badge: p?.badge ?? "",
    order: p?.order ?? 0,
    image: p?.image ?? null,
    catalog: p?.catalog ?? null,
    seo: { metaTitle: p?.seo?.metaTitle ?? "", metaDescription: p?.seo?.metaDescription ?? "" },
  };
}

export function ProductForm({ initial }: { initial?: ProductDTO }) {
  const router = useRouter();
  const [productId, setProductId] = useState<string | null>(initial?._id ?? null);
  const [status, setStatus] = useState<ProductStatus>(initial?.status ?? "draft");
  const [publishedAt, setPublishedAt] = useState<string | null>(initial?.publishedAt ?? null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(initial?.updatedAt ?? null);
  const [form, setForm] = useState<ProductFields>(() => toForm(initial));
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

  function update<K extends keyof ProductFields>(key: K, value: ProductFields[K]) {
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
        setNameError("Add a product name to save.");
        nameRef.current?.focus();
        return;
      }
      const nextStatus: ProductStatus = action === "draft" || action === "unpublish" ? "draft" : "published";
      if (nextStatus === "published" && !form.summary.trim() && !stripHtml(form.description)) {
        toast.error("Add a summary or description before publishing.");
        return;
      }

      setSaving(action);
      const sent = form;
      try {
        const { order, ...rest } = sent;
        const payload = {
          ...rest,
          // A new product left at 0 is placed at the end of the menu by the server.
          ...(productId || order !== 0 ? { order } : {}),
          slug: sent.slug || slugify(sent.name),
          status: nextStatus,
        };
        const res = productId ? await productsApi.update(productId, payload) : await productsApi.create(payload);

        setForm((f) => ({ ...f, slug: res.slug, order: res.order }));
        setSavedSnapshot(JSON.stringify({ ...sent, slug: res.slug, order: res.order }));
        setSlugEdited(true);
        setStatus(res.status);
        setPublishedAt(res.publishedAt);
        setUpdatedAt(res.updatedAt);

        if (!productId) {
          setProductId(res._id);
          window.history.replaceState(null, "", `/admin/products/${res._id}`);
        }
        toast.success(SUCCESS[action]);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "The product couldn't be saved.");
      } finally {
        setSaving(null);
      }
    },
    [productId, form, saving]
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

  async function deleteProduct() {
    if (!productId) return;
    setDeleting(true);
    try {
      await productsApi.remove(productId);
      setSavedSnapshot(JSON.stringify(form));
      toast.success("Product deleted");
      router.push("/admin/products");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "The product couldn't be deleted.");
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

  const catalogTitle = `${form.name.trim() || "Product"} Catalogue`;

  return (
    <div className="pb-16">
      {/* Action bar */}
      <div className="sticky top-14 z-20 border-b border-[#DCE3E0] bg-white/95 backdrop-blur lg:top-0">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-10">
          <Link
            href="/admin/products"
            onClick={(e) => {
              if (dirty) {
                e.preventDefault();
                setDialog("leave");
              }
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-[#3E534C] hover:bg-[#EEF1F0] hover:text-[#10261F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18B27F]/60"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Products</span>
          </Link>
          <span className="hidden h-5 w-px bg-[#DCE3E0] sm:block" aria-hidden />
          <StatusBadge status={status} />
          <span className="hidden truncate text-sm text-[#5E716B] md:inline" aria-live="polite">
            {saveText}
          </span>

          <div className="ml-auto flex items-center gap-2">
            {isPublished && form.slug && (
              <a
                href={`/products/${form.slug}`}
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
                <label htmlFor="product-name" className="sr-only">
                  Product name
                </label>
                <textarea
                  id="product-name"
                  ref={nameRef}
                  rows={1}
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value.replace(/\n/g, " ");
                    setNameError(null);
                    setForm((f) => ({ ...f, name, slug: slugEdited ? f.slug : slugify(name) }));
                  }}
                  placeholder="Product name, e.g. General Surgery"
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

              <div className="grid gap-4 sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
                <Field label="Tagline" htmlFor="tagline" aside={<CharCount value={form.tagline} ideal={60} max={160} />}>
                  <input
                    id="tagline"
                    value={form.tagline}
                    onChange={(e) => update("tagline", e.target.value)}
                    placeholder="Precision tools for sculpted body"
                    className={inputClass}
                  />
                </Field>
                <Field label="Bold words" htmlFor="tagline-bold" aside={<CharCount value={form.taglineBold} max={120} />}>
                  <input
                    id="tagline-bold"
                    value={form.taglineBold}
                    onChange={(e) => update("taglineBold", e.target.value)}
                    placeholder={form.name || "Transformations"}
                    className={inputClass}
                  />
                </Field>
                <p className="-mt-2 text-xs leading-relaxed text-[#5E716B] sm:col-span-2">
                  Page header preview:{" "}
                  <span className="text-[#3E534C]">
                    {form.tagline || "Precision tools for sculpted body"}{" "}
                    <strong>{form.taglineBold || form.name || "Transformations"}</strong>
                  </span>
                  . Leave the bold words empty to use the product name.
                </p>
              </div>

              <Field
                label="Summary"
                htmlFor="summary"
                aside={<CharCount value={form.summary} ideal={180} max={400} />}
                hint="The short text next to the image on the All Products page."
              >
                <textarea
                  id="summary"
                  rows={3}
                  value={form.summary}
                  onChange={(e) => update("summary", e.target.value)}
                  placeholder="One or two sentences about this product range."
                  className={`${inputClass} resize-y`}
                />
              </Field>
            </div>
          </div>

          <section className="rounded-lg border border-[#DCE3E0] bg-white shadow-[0_1px_2px_rgba(16,38,31,0.05)]">
            <div className="border-b border-[#E6ECEA] px-6 py-4 sm:px-12">
              <h2 className="text-sm font-semibold text-[#10261F]">Detail description</h2>
              <p className="mt-0.5 text-xs text-[#5E716B]">The full text under the product name on its detail page.</p>
            </div>
            <RichTextEditor value={form.description} onChange={onDescriptionChange} />
          </section>

          <section className="rounded-lg border border-[#DCE3E0] bg-white p-6 shadow-[0_1px_2px_rgba(16,38,31,0.05)] sm:px-12">
            <Field
              label="Featured categories"
              htmlFor="categories"
              hint="Listed under “Featured Categories” on the detail page. Press Enter after each one."
            >
              <TagInput id="categories" value={form.categories} onChange={(c) => update("categories", c)} max={60} />
            </Field>
          </section>
        </div>

        {/* Settings */}
        <aside className="min-w-0 space-y-4">
          <Panel title="Product details">
            <dl className="grid grid-cols-2 gap-3 rounded-md bg-[#F6F8F7] p-3 text-xs">
              <div>
                <dt className="text-[#5E716B]">Published</dt>
                <dd className="mt-0.5 font-medium text-[#10261F]">{publishedAt ? formatDate(publishedAt) : "Not yet"}</dd>
              </div>
              <div>
                <dt className="text-[#5E716B]">Categories</dt>
                <dd className="mt-0.5 font-medium tabular-nums text-[#10261F]">{form.categories.length}</dd>
              </div>
            </dl>

            <Field label="URL slug" htmlFor="slug" hint={<span className="break-all">/products/{form.slug || "product-url"}</span>}>
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

            <Field label="Menu order" htmlFor="order" hint="Lower numbers come first in the menu and on the All Products page.">
              <input
                id="order"
                type="number"
                inputMode="numeric"
                value={Number.isFinite(form.order) ? form.order : 0}
                onChange={(e) => update("order", e.target.value === "" ? 0 : Number(e.target.value))}
                className={inputClass}
              />
            </Field>

            <Field label="Badge" htmlFor="badge" hint="Optional short label after the name, e.g. New.">
              <input
                id="badge"
                value={form.badge}
                maxLength={30}
                onChange={(e) => update("badge", e.target.value)}
                placeholder="New"
                className={inputClass}
              />
            </Field>
          </Panel>

          <Panel title="Product image">
            <CoverImageField
              value={form.image}
              onChange={(img) => update("image", img)}
              noun="product image"
              hint="a wide photo around 1600×1200 works best."
            />
          </Panel>

          <Panel title="Catalogue">
            <CatalogField value={form.catalog} onChange={(c) => update("catalog", c)} defaultTitle={catalogTitle} />
          </Panel>

          <Panel title="Search engine listing">
            <Field
              label="Meta title"
              htmlFor="meta-title"
              aside={<CharCount value={form.seo.metaTitle} ideal={60} max={70} />}
              hint="Leave empty to use the product name."
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
              section="products"
            />
          </Panel>

          {productId && (
            <Button variant="ghost" className="w-full text-[#B42318] hover:bg-[#FDF0EE] hover:text-[#99201A]" onClick={() => setDialog("delete")}>
              <Trash2 aria-hidden />
              Delete product
            </Button>
          )}
        </aside>
      </div>

      <ConfirmDialog
        open={dialog === "delete"}
        title="Delete this product?"
        description="It will be removed from the website and the menu, along with its image and catalogue. This can't be undone."
        confirmLabel="Delete product"
        loading={deleting}
        onConfirm={deleteProduct}
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
          router.push("/admin/products");
        }}
        onCancel={() => setDialog(null)}
      />
    </div>
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
