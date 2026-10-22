import "server-only";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { SurgicalSet } from "@/models/SurgicalSet.schema";
import { cleanHtml, ValidationError } from "@/lib/apis/blog-server";
import { slugify } from "@/lib/blog-utils";
import type {
  SurgicalSetFaq,
  SurgicalSetImage,
  SurgicalSetItem,
  SurgicalSetSpec,
  SurgicalSetStatus,
} from "@/types/surgical-set";

export type SurgicalSetWrite = {
  name: string;
  slug: string;
  category: string;
  summary: string;
  description: string;
  features: string[];
  items: SurgicalSetItem[];
  specifications: SurgicalSetSpec[];
  faqs: SurgicalSetFaq[];
  sku: string;
  type: string;
  size: string;
  tags: string[];
  image: SurgicalSetImage | null;
  order: number;
  status: SurgicalSetStatus;
  seo: { metaTitle: string; metaDescription: string };
  publishedAt: Date;
};

const MAX_ROWS = 200;

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : undefined);
const isHttps = (url: string) => /^https:\/\//.test(url);

function parseImage(v: unknown): SurgicalSetImage | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const url = str(o.url, 1000);
  const key = str(o.key, 500);
  if (!url || !key || !isHttps(url)) throw new ValidationError("The set image is invalid. Upload it again.");
  return { url, key, alt: str(o.alt, 200) ?? "" };
}

/** Keeps only the rows that have something in their first column. */
function parseRows<T>(v: unknown, label: string, row: (o: Record<string, unknown>) => T | null): T[] {
  if (!Array.isArray(v)) throw new ValidationError(`${label} must be a list.`);
  const out: T[] = [];
  for (const entry of v.slice(0, MAX_ROWS)) {
    if (!entry || typeof entry !== "object") continue;
    const parsed = row(entry as Record<string, unknown>);
    if (parsed) out.push(parsed);
  }
  return out;
}

function parseStrings(v: unknown, label: string, max: number, limit: number) {
  if (!Array.isArray(v)) throw new ValidationError(`${label} must be a list.`);
  const cleaned = v.map((c) => str(c, max)).filter((c): c is string => Boolean(c));
  return [...new Set(cleaned)].slice(0, limit);
}

/** Picks and cleans the fields an admin may set. Anything else in the body is ignored. */
export function parseSurgicalSetInput(body: unknown, { partial }: { partial: boolean }): Partial<SurgicalSetWrite> {
  if (!body || typeof body !== "object") throw new ValidationError("Request body must be a JSON object.");
  const b = body as Record<string, unknown>;
  const out: Partial<SurgicalSetWrite> = {};

  const name = str(b.name, 160);
  if (name !== undefined) {
    if (!name) throw new ValidationError("Set name is required.");
    out.name = name;
  } else if (!partial) {
    throw new ValidationError("Set name is required.");
  }

  if (b.slug !== undefined) out.slug = slugify(str(b.slug, 160) ?? "");
  if (b.category !== undefined) out.category = str(b.category, 80) ?? "";
  if (b.summary !== undefined) out.summary = str(b.summary, 600) ?? "";
  if (b.description !== undefined) out.description = cleanHtml(typeof b.description === "string" ? b.description : "");
  if (b.sku !== undefined) out.sku = str(b.sku, 40) ?? "";
  if (b.type !== undefined) out.type = str(b.type, 60) ?? "";
  if (b.size !== undefined) out.size = str(b.size, 120) ?? "";
  if (b.image !== undefined) out.image = parseImage(b.image);

  if (b.features !== undefined) out.features = parseStrings(b.features, "Highlights", 80, 20);
  if (b.tags !== undefined) out.tags = parseStrings(b.tags, "Tags", 60, 30);

  if (b.items !== undefined) {
    out.items = parseRows(b.items, "The set list", (o) => {
      const itemName = str(o.name, 160);
      return itemName ? { name: itemName, quantity: str(o.quantity, 40) ?? "" } : null;
    });
  }

  if (b.specifications !== undefined) {
    out.specifications = parseRows(b.specifications, "Technical specifications", (o) => {
      const label = str(o.label, 80);
      return label ? { label, value: str(o.value, 300) ?? "" } : null;
    });
  }

  if (b.faqs !== undefined) {
    out.faqs = parseRows(b.faqs, "FAQs", (o) => {
      const question = str(o.question, 200);
      return question ? { question, answer: str(o.answer, 1200) ?? "" } : null;
    });
  }

  if (b.order !== undefined) {
    const order = Number(b.order);
    if (!Number.isFinite(order)) throw new ValidationError("List order must be a number.");
    out.order = Math.max(-9999, Math.min(9999, Math.round(order)));
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
export async function uniqueSurgicalSetSlug(desired: string, excludeId?: string) {
  const base = desired || `surgical-set-${Date.now().toString(36)}`;
  let slug = base;
  let n = 2;
  while (await SurgicalSet.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

/**
 * A set shows on /surgical-sets, in that page's category sidebar and on its
 * own detail page, so refresh the whole section after a change.
 */
export function revalidateSurgicalSetPages() {
  revalidatePath("/surgical-sets");
  revalidatePath("/surgical-sets/[slug]", "page");
}

export function surgicalSetErrorResponse(err: unknown) {
  if (err instanceof ValidationError) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
  if ((err as { code?: number })?.code === 11000) {
    return NextResponse.json({ error: "Another set already uses this URL slug." }, { status: 409 });
  }
  console.error("[surgical-sets api]", err);
  return NextResponse.json({ error: "The server couldn't complete the request." }, { status: 500 });
}
