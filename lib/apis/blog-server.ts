import "server-only";
import { NextResponse } from "next/server";
import sanitizeHtml from "sanitize-html";
import { Blog } from "@/models/Blog.schema";
import { readingTime, slugify } from "@/lib/blog-utils";
import type { BlogImage, BlogStatus } from "@/types/blog";

export class ValidationError extends Error {}

export type BlogWrite = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  readingTime: number;
  coverImage: BlogImage | null;
  category: string;
  tags: string[];
  author: string;
  status: BlogStatus;
  seo: { metaTitle: string; metaDescription: string };
  publishedAt: Date;
};

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : undefined);

export function cleanHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "h2", "h3", "strong", "b", "em", "i", "u", "s",
      "blockquote", "ul", "ol", "li", "a", "img", "hr",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      p: ["style"],
      h2: ["style"],
      h3: ["style"],
    },
    allowedStyles: { "*": { "text-align": [/^(left|right|center|justify)$/] } },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
    },
  });
}

function parseImage(v: unknown): BlogImage | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const url = str(o.url, 1000);
  const key = str(o.key, 500);
  if (!url || !key || !/^https:\/\//.test(url)) throw new ValidationError("The cover image is invalid. Upload it again.");
  return { url, key, alt: str(o.alt, 200) ?? "" };
}

/** Picks and cleans the fields an admin may set. Anything else in the body is ignored. */
export function parseBlogInput(body: unknown, { partial }: { partial: boolean }): Partial<BlogWrite> {
  if (!body || typeof body !== "object") throw new ValidationError("Request body must be a JSON object.");
  const b = body as Record<string, unknown>;
  const out: Partial<BlogWrite> = {};

  const title = str(b.title, 200);
  if (title !== undefined) {
    if (!title) throw new ValidationError("Title is required.");
    out.title = title;
  } else if (!partial) {
    throw new ValidationError("Title is required.");
  }

  if (b.slug !== undefined) out.slug = slugify(str(b.slug, 120) ?? "");
  if (b.excerpt !== undefined) out.excerpt = str(b.excerpt, 400) ?? "";
  if (b.content !== undefined) {
    out.content = cleanHtml(typeof b.content === "string" ? b.content : "");
    out.readingTime = readingTime(out.content);
  }
  if (b.coverImage !== undefined) out.coverImage = parseImage(b.coverImage);
  if (b.category !== undefined) out.category = str(b.category, 60) ?? "";
  if (b.author !== undefined) out.author = str(b.author, 80) ?? "";

  if (b.tags !== undefined) {
    if (!Array.isArray(b.tags)) throw new ValidationError("Tags must be a list.");
    const tags = b.tags.map((t) => str(t, 40)).filter((t): t is string => Boolean(t));
    out.tags = [...new Set(tags)].slice(0, 20);
  }

  if (b.status !== undefined) {
    if (b.status !== "draft" && b.status !== "published") throw new ValidationError("Status must be draft or published.");
    out.status = b.status;
  }

  if (b.seo !== undefined) {
    const s = (b.seo ?? {}) as Record<string, unknown>;
    out.seo = { metaTitle: str(s.metaTitle, 70) ?? "", metaDescription: str(s.metaDescription, 170) ?? "" };
  }

  return out;
}

/** Appends -2, -3… until the slug is free. */
export async function uniqueSlug(desired: string, excludeId?: string) {
  const base = desired || `post-${Date.now().toString(36)}`;
  let slug = base;
  let n = 2;
  while (await Blog.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

export function errorResponse(err: unknown) {
  if (err instanceof ValidationError) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
  if ((err as { code?: number })?.code === 11000) {
    return NextResponse.json({ error: "Another post already uses this URL slug." }, { status: 409 });
  }
  console.error("[blogs api]", err);
  return NextResponse.json({ error: "The server couldn't complete the request." }, { status: 500 });
}
