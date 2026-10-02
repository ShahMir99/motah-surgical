import "server-only";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { cleanHtml, ValidationError } from "@/lib/apis/blog-server";
import { stripHtml } from "@/lib/blog-utils";
import { arr, href, image, obj, str, text } from "@/lib/apis/content-parse";
import type {
  AboutContentMap,
  AboutFile,
  AboutHero,
  AboutSlug,
  TextBlock,
} from "@/types/about";

function hero(v: unknown): AboutHero {
  const h = obj(v);
  return { eyebrow: str(h.eyebrow, 80), title: str(h.title, 120), subtitle: text(h.subtitle, 200) };
}

function paragraphs(v: unknown, max: number, label: string): string[] {
  const list = arr(v, 20).map((p) => text(p, max)).filter(Boolean);
  if (!list.length) throw new ValidationError(`${label}: add at least one paragraph.`);
  return list;
}

function letter(v: unknown): string {
  const html = cleanHtml(typeof v === "string" ? v : "");
  if (!stripHtml(html)) throw new ValidationError("Letter: write some text before saving.");
  return html;
}

function block(v: unknown, label: string): TextBlock {
  const b = obj(v);
  return { heading: str(b.heading, 100), text: text(b.text, 800), image: image(b.image, label) };
}

function file(v: unknown, label: string): AboutFile | null {
  if (!v || typeof v !== "object") return null;
  const f = v as Record<string, unknown>;
  const url = str(f.url, 1000);
  const key = str(f.key, 500);
  if (!url || !key || !/^https:\/\//.test(url)) {
    throw new ValidationError(`${label}: the file is invalid. Upload it again.`);
  }
  const size = Number(f.size);
  return { url, key, fileName: str(f.fileName, 200) || "document.pdf", size: Number.isFinite(size) ? size : 0 };
}

const PARSERS: { [S in AboutSlug]: (b: Record<string, unknown>) => AboutContentMap[S] } = {
  "company-introduction": (b) => ({
    hero: hero(b.hero),
    image: image(b.image, "Feature image"),
    greeting: str(b.greeting, 120),
    letter: letter(b.letter),
    signoff: str(b.signoff, 60),
    signature: str(b.signature, 80),
  }),

  "mission-vision": (b) => {
    const intro = obj(b.intro);
    const global = obj(b.global);
    const ach = obj(b.achievements);
    const items = arr(ach.items, 12)
      .map((raw) => {
        const it = obj(raw);
        return { title: str(it.title, 120), description: text(it.description, 500) };
      })
      .filter((it) => it.title || it.description);
    if (!items.length) throw new ValidationError("Add at least one item to \"How we achieve our mission\".");
    return {
      hero: hero(b.hero),
      intro: { eyebrow: str(intro.eyebrow, 80), heading: str(intro.heading, 120), text: text(intro.text, 300) },
      blockOne: block(b.blockOne, "First block"),
      blockTwo: block(b.blockTwo, "Second block"),
      global: {
        heading: str(global.heading, 120),
        paragraphs: paragraphs(global.paragraphs, 1500, "Global reach"),
        image: image(global.image, "Global reach"),
      },
      achievements: { heading: str(ach.heading, 120), items, closing: text(ach.closing, 800) },
    };
  },

  compliance: (b) => ({
    hero: hero(b.hero),
    lead: text(b.lead, 400),
    body: text(b.body, 1500),
    credentials: arr(b.credentials, 12).map((raw, i) => {
      const c = obj(raw);
      return { label: str(c.label, 120), image: image(c.image, `Credential ${i + 1}`) };
    }),
  }),

  downloads: (b) => ({
    hero: hero(b.hero),
    heading: str(b.heading, 120),
    linkLabel: str(b.linkLabel, 40),
    resources: arr(b.resources, 40)
      .map((raw, i) => {
        const r = obj(raw);
        return {
          title: str(r.title, 140),
          href: href(r.href, `Resource ${i + 1} link`),
          file: file(r.file, `Resource ${i + 1}`),
        };
      })
      .filter((r) => r.title),
  }),

  faqs: (b) => {
    const items = arr(b.items, 60)
      .map((raw) => {
        const it = obj(raw);
        return { question: str(it.question, 240), answer: text(it.answer, 1500) };
      })
      .filter((it) => it.question);
    if (!items.length) throw new ValidationError("Add at least one question.");
    return { hero: hero(b.hero), items };
  },
};

/** Picks and cleans the fields an admin may set. Anything else in the body is ignored. */
export function parseAboutInput<S extends AboutSlug>(slug: S, body: unknown): AboutContentMap[S] {
  if (!body || typeof body !== "object") throw new ValidationError("Request body must be a JSON object.");
  return PARSERS[slug](body as Record<string, unknown>);
}

export function revalidateAboutPage(slug: AboutSlug) {
  revalidatePath(`/about/${slug}`);
}

export function aboutErrorResponse(err: unknown) {
  if (err instanceof ValidationError) return NextResponse.json({ error: err.message }, { status: 400 });
  console.error("[about api]", err);
  return NextResponse.json({ error: "The server couldn't complete the request." }, { status: 500 });
}
