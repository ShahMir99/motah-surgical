"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { ArrowLeft, Trash2 } from "lucide-react";
import type { BlogDTO, BlogFields, BlogStatus } from "@/types/blog";
import { blogsApi } from "@/lib/apis/admin-api";
import { readingTime, slugify, stripHtml } from "@/lib/blog-utils";
import { formatDate, timeAgo } from "@/lib/format";
import { Button, CharCount, Field, inputClass } from "@/components/admin/ui";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { StatusBadge } from "./StatusBadge";
import { RichTextEditor } from "./RichTextEditor";
import { CoverImageField } from "./CoverImageField";
import { TagInput } from "./TagInput";
import { SeoPreview } from "./SeoPreview";

type SaveAction = "draft" | "publish" | "update" | "unpublish";

const SUCCESS: Record<SaveAction, string> = {
  draft: "Draft saved",
  publish: "Post published",
  update: "Post updated",
  unpublish: "Post unpublished",
};

// Suggestions only; any category can be typed.
const CATEGORIES = ["Company news", "Product guides", "Instrument care", "Industry insights", "Events & exhibitions"];

function toForm(b?: BlogDTO): BlogFields {
  return {
    title: b?.title ?? "",
    slug: b?.slug ?? "",
    excerpt: b?.excerpt ?? "",
    content: b?.content ?? "",
    coverImage: b?.coverImage ?? null,
    category: b?.category ?? "",
    tags: b?.tags ?? [],
    author: b?.author ?? "Motah Surgical",
    seo: { metaTitle: b?.seo?.metaTitle ?? "", metaDescription: b?.seo?.metaDescription ?? "" },
  };
}

export function BlogForm({ initial }: { initial?: BlogDTO }) {
  const router = useRouter();
  const [blogId, setBlogId] = useState<string | null>(initial?._id ?? null);
  const [status, setStatus] = useState<BlogStatus>(initial?.status ?? "draft");
  const [publishedAt, setPublishedAt] = useState<string | null>(initial?.publishedAt ?? null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(initial?.updatedAt ?? null);
  const [form, setForm] = useState<BlogFields>(() => toForm(initial));
  const [savedSnapshot, setSavedSnapshot] = useState(() => JSON.stringify(toForm(initial)));
  const [slugEdited, setSlugEdited] = useState(Boolean(initial));
  const [saving, setSaving] = useState<SaveAction | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [dialog, setDialog] = useState<"delete" | "leave" | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [, setTick] = useState(0);
  const titleRef = useRef<HTMLTextAreaElement>(null);

  const dirty = useMemo(() => JSON.stringify(form) !== savedSnapshot, [form, savedSnapshot]);
  const isPublished = status === "published";

  function update<K extends keyof BlogFields>(key: K, value: BlogFields[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }
  const onContentChange = useCallback((html: string) => setForm((f) => ({ ...f, content: html })), []);

  // Grow the title field with its text.
  useLayoutEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [form.title]);

  // Refresh "Saved 3 min ago".
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 30_000);
    return () => clearInterval(t);
  }, []);

  const save = useCallback(
    async (action: SaveAction) => {
      if (saving) return;
      if (!form.title.trim()) {
        setTitleError("Add a title to save this post.");
        titleRef.current?.focus();
        return;
      }
      const nextStatus: BlogStatus = action === "draft" || action === "unpublish" ? "draft" : "published";
      if (nextStatus === "published" && !stripHtml(form.content) && !form.content.includes("<img")) {
        toast.error("Add some content before publishing.");
        return;
      }

      setSaving(action);
      const sent = form;
      try {
        const payload = { ...sent, slug: sent.slug || slugify(sent.title), status: nextStatus };
        const res = blogId ? await blogsApi.update(blogId, payload) : await blogsApi.create(payload);

        setForm((f) => ({ ...f, slug: res.slug }));
        setSavedSnapshot(JSON.stringify({ ...sent, slug: res.slug }));
        setSlugEdited(true);
        setStatus(res.status);
        setPublishedAt(res.publishedAt);
        setUpdatedAt(res.updatedAt);

        if (!blogId) {
          setBlogId(res._id);
          window.history.replaceState(null, "", `/admin/blogs/${res._id}`);
        }
        toast.success(SUCCESS[action]);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "The post couldn't be saved.");
      } finally {
        setSaving(null);
      }
    },
    [blogId, form, saving]
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

  async function deletePost() {
    if (!blogId) return;
    setDeleting(true);
    try {
      await blogsApi.remove(blogId);
      setSavedSnapshot(JSON.stringify(form));
      toast.success("Post deleted");
      router.push("/admin/blogs");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "The post couldn't be deleted.");
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

  const metaDescriptionFallback = form.seo.metaDescription || form.excerpt;

  return (
    <div className="pb-16">
      {/* Action bar */}
      <div className="sticky top-14 z-20 border-b border-[#DCE3E0] bg-white/95 backdrop-blur lg:top-0">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-10">
          <Link
            href="/admin/blogs"
            onClick={(e) => {
              if (dirty) {
                e.preventDefault();
                setDialog("leave");
              }
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-[#3E534C] hover:bg-[#EEF1F0] hover:text-[#10261F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18B27F]/60"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Blogs</span>
          </Link>
          <span className="hidden h-5 w-px bg-[#DCE3E0] sm:block" aria-hidden />
          <StatusBadge status={status} />
          <span className="hidden truncate text-sm text-[#5E716B] md:inline" aria-live="polite">
            {saveText}
          </span>

          <div className="ml-auto flex items-center gap-2">
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
        {/* Writing surface */}
        <div className="min-w-0 rounded-lg border border-[#DCE3E0] bg-white shadow-[0_1px_2px_rgba(16,38,31,0.05)]">
          <div className="px-6 pb-4 pt-8 sm:px-12 sm:pt-12">
            <label htmlFor="post-title" className="sr-only">
              Title
            </label>
            <textarea
              id="post-title"
              ref={titleRef}
              rows={1}
              value={form.title}
              onChange={(e) => {
                const title = e.target.value.replace(/\n/g, " ");
                setTitleError(null);
                setForm((f) => ({ ...f, title, slug: slugEdited ? f.slug : slugify(title) }));
              }}
              placeholder="Post title"
              aria-invalid={Boolean(titleError)}
              aria-describedby={titleError ? "title-error" : undefined}
              className="font-editorial block w-full resize-none overflow-hidden border-0 bg-transparent p-0 text-3xl font-bold leading-tight text-[#10261F] placeholder:text-[#B5C2BE] focus:outline-none focus:ring-0 sm:text-[2.5rem]"
            />
            {titleError && (
              <p id="title-error" className="mt-2 text-sm text-[#B42318]">
                {titleError}
              </p>
            )}
          </div>
          <RichTextEditor value={form.content} onChange={onContentChange} />
        </div>

        {/* Settings */}
        <aside className="min-w-0 space-y-4">
          <Panel title="Post details">
            <dl className="grid grid-cols-2 gap-3 rounded-md bg-[#F6F8F7] p-3 text-xs">
              <div>
                <dt className="text-[#5E716B]">Published</dt>
                <dd className="mt-0.5 font-medium text-[#10261F]">{publishedAt ? formatDate(publishedAt) : "Not yet"}</dd>
              </div>
              <div>
                <dt className="text-[#5E716B]">Reading time</dt>
                <dd className="mt-0.5 font-medium text-[#10261F]">{readingTime(form.content)} min</dd>
              </div>
            </dl>

            <Field label="URL slug" htmlFor="slug" hint={<span className="break-all">/blog/{form.slug || "post-url"}</span>}>
              <input
                id="slug"
                value={form.slug}
                onChange={(e) => {
                  setSlugEdited(true);
                  update("slug", e.target.value);
                }}
                onBlur={() => update("slug", slugify(form.slug) || slugify(form.title))}
                placeholder="generated-from-title"
                className={inputClass}
              />
            </Field>

            <Field label="Category" htmlFor="category">
              <input
                id="category"
                list="category-options"
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                placeholder="Choose or type a category"
                className={inputClass}
              />
              <datalist id="category-options">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Field>

            <Field label="Tags" htmlFor="tags" hint="Press Enter or comma after each tag.">
              <TagInput id="tags" value={form.tags} onChange={(tags) => update("tags", tags)} />
            </Field>

            <Field label="Author" htmlFor="author">
              <input id="author" value={form.author} onChange={(e) => update("author", e.target.value)} className={inputClass} />
            </Field>
          </Panel>

          <Panel title="Cover image">
            <CoverImageField value={form.coverImage} onChange={(img) => update("coverImage", img)} />
          </Panel>

          <Panel title="Excerpt">
            <Field
              label="Summary"
              htmlFor="excerpt"
              aside={<CharCount value={form.excerpt} ideal={200} max={400} />}
              hint="Shown on blog cards and used in search results when no meta description is set."
            >
              <textarea
                id="excerpt"
                rows={4}
                value={form.excerpt}
                onChange={(e) => update("excerpt", e.target.value)}
                placeholder="One or two sentences on what the reader will learn."
                className={`${inputClass} resize-y`}
              />
            </Field>
          </Panel>

          <Panel title="Search engine listing">
            <Field
              label="Meta title"
              htmlFor="meta-title"
              aside={<CharCount value={form.seo.metaTitle} ideal={60} max={70} />}
              hint="Leave empty to use the post title."
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
              hint="Leave empty to use the excerpt."
            >
              <textarea
                id="meta-description"
                rows={3}
                value={form.seo.metaDescription}
                onChange={(e) => update("seo", { ...form.seo, metaDescription: e.target.value })}
                className={`${inputClass} resize-y`}
              />
            </Field>
            <SeoPreview title={form.seo.metaTitle || form.title} description={metaDescriptionFallback} slug={form.slug} />
          </Panel>

          {blogId && (
            <Button variant="ghost" className="w-full text-[#B42318] hover:bg-[#FDF0EE] hover:text-[#99201A]" onClick={() => setDialog("delete")}>
              <Trash2 aria-hidden />
              Delete post
            </Button>
          )}
        </aside>
      </div>

      <ConfirmDialog
        open={dialog === "delete"}
        title="Delete this post?"
        description="It will be removed from the website along with its cover image. This can't be undone."
        confirmLabel="Delete post"
        loading={deleting}
        onConfirm={deletePost}
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
          router.push("/admin/blogs");
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
