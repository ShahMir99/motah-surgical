import "server-only";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Product } from "@/models/Product.schema";
import { cleanHtml, ValidationError } from "@/lib/apis/blog-server";
import { slugify } from "@/lib/blog-utils";
import type { ProductCatalog, ProductImage, ProductStatus } from "@/types/product";

export type ProductWrite = {
  name: string;
  slug: string;
  tagline: string;
  taglineBold: string;
  summary: string;
  description: string;
  categories: string[];
  badge: string;
  order: number;
  image: ProductImage | null;
  catalog: ProductCatalog | null;
  status: ProductStatus;
  seo: { metaTitle: string; metaDescription: string };
  publishedAt: Date;
};

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : undefined);
const isHttps = (url: string) => /^https:\/\//.test(url);

function parseImage(v: unknown): ProductImage | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const url = str(o.url, 1000);
  const key = str(o.key, 500);
  if (!url || !key || !isHttps(url)) throw new ValidationError("The product image is invalid. Upload it again.");
  return { url, key, alt: str(o.alt, 200) ?? "" };
}

function parseCatalog(v: unknown): ProductCatalog | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const url = str(o.url, 1000);
  const key = str(o.key, 500);
  if (!url || !key || !isHttps(url)) throw new ValidationError("The catalogue file is invalid. Upload it again.");
  const size = Number(o.size);
  return {
    url,
    key,
    fileName: str(o.fileName, 200) || "catalogue.pdf",
    size: Number.isFinite(size) && size > 0 ? Math.round(size) : 0,
    title: str(o.title, 120) ?? "",
  };
}

/** Picks and cleans the fields an admin may set. Anything else in the body is ignored. */
export function parseProductInput(body: unknown, { partial }: { partial: boolean }): Partial<ProductWrite> {
  if (!body || typeof body !== "object") throw new ValidationError("Request body must be a JSON object.");
  const b = body as Record<string, unknown>;
  const out: Partial<ProductWrite> = {};

  const name = str(b.name, 120);
  if (name !== undefined) {
    if (!name) throw new ValidationError("Product name is required.");
    out.name = name;
  } else if (!partial) {
    throw new ValidationError("Product name is required.");
  }

  if (b.slug !== undefined) out.slug = slugify(str(b.slug, 120) ?? "");
  if (b.tagline !== undefined) out.tagline = str(b.tagline, 160) ?? "";
  if (b.taglineBold !== undefined) out.taglineBold = str(b.taglineBold, 120) ?? "";
  if (b.summary !== undefined) out.summary = str(b.summary, 400) ?? "";
  if (b.description !== undefined) out.description = cleanHtml(typeof b.description === "string" ? b.description : "");
  if (b.badge !== undefined) out.badge = str(b.badge, 30) ?? "";
  if (b.image !== undefined) out.image = parseImage(b.image);
  if (b.catalog !== undefined) out.catalog = parseCatalog(b.catalog);

  if (b.order !== undefined) {
    const order = Number(b.order);
    if (!Number.isFinite(order)) throw new ValidationError("Menu order must be a number.");
    out.order = Math.max(-9999, Math.min(9999, Math.round(order)));
  }

  if (b.categories !== undefined) {
    if (!Array.isArray(b.categories)) throw new ValidationError("Categories must be a list.");
    const cats = b.categories.map((c) => str(c, 80)).filter((c): c is string => Boolean(c));
    out.categories = [...new Set(cats)].slice(0, 60);
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
export async function uniqueProductSlug(desired: string, excludeId?: string) {
  const base = desired || `product-${Date.now().toString(36)}`;
  let slug = base;
  let n = 2;
  while (await Product.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

/**
 * Products appear in the header menu on every page, the /products list and
 * their own detail page, so refresh the whole public site after a change.
 */
export function revalidateProductPages() {
  revalidatePath("/", "layout");
}

export function productErrorResponse(err: unknown) {
  if (err instanceof ValidationError) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
  if ((err as { code?: number })?.code === 11000) {
    return NextResponse.json({ error: "Another product already uses this URL slug." }, { status: 409 });
  }
  console.error("[products api]", err);
  return NextResponse.json({ error: "The server couldn't complete the request." }, { status: 500 });
}
