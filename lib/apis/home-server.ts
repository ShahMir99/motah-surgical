import "server-only";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ValidationError } from "@/lib/apis/blog-server";
import { collectKeys, href, image, obj, str } from "@/lib/apis/content-parse";
import { HOME_DEFAULTS } from "@/lib/home-defaults";
import type { HomeContent } from "@/types/home";

/** Picks and cleans every field an admin may set. Anything else in the body is ignored. */
export function parseHomeInput(body: unknown): HomeContent {
  if (!body || typeof body !== "object") throw new ValidationError("Request body must be a JSON object.");
  const b = body as Record<string, unknown>;
  const hero = obj(b.hero);
  const products = obj(b.products);
  const about = obj(b.about);
  const highlights = obj(b.highlights);
  const exhibition = obj(b.exhibition);
  const d = HOME_DEFAULTS;

  const badges = Array.isArray(b.badges)
    ? b.badges.map((x) => str(x, 60)).filter(Boolean).slice(0, 8)
    : d.badges;

  const rawItems = Array.isArray(highlights.items) ? highlights.items.slice(0, 8) : [];
  const items = rawItems.map((raw, i) => {
    const it = obj(raw);
    return {
      heading: str(it.heading, 100),
      blurb: str(it.blurb, 600),
      href: href(it.href, `Highlight ${i + 1} link`),
      image: image(it.image, `Highlight ${i + 1}`),
    };
  });

  const limit = Math.round(Number(products.limit));

  return {
    hero: {
      eyebrow: str(hero.eyebrow, 80),
      heading: str(hero.heading, 220),
      buttonLabel: str(hero.buttonLabel, 60),
      buttonHref: href(hero.buttonHref, "Hero button link"),
      image: image(hero.image, "Hero"),
    },
    badges,
    products: {
      eyebrow: str(products.eyebrow, 80),
      heading: str(products.heading, 120),
      buttonLabel: str(products.buttonLabel, 60),
      limit: Number.isFinite(limit) ? Math.min(24, Math.max(1, limit)) : d.products.limit,
    },
    about: {
      prefix: str(about.prefix, 40),
      title: str(about.title, 80),
      body: str(about.body, 1500),
      buttonLabel: str(about.buttonLabel, 60),
      buttonHref: href(about.buttonHref, "About button link"),
      image: image(about.image, "About"),
    },
    highlights: {
      eyebrow: str(highlights.eyebrow, 80),
      heading: str(highlights.heading, 140),
      items: items.length ? items : d.highlights.items,
    },
    exhibition: {
      titleTop: str(exhibition.titleTop, 40),
      titleBottom: str(exhibition.titleBottom, 40),
      text: str(exhibition.text, 220),
      image: image(exhibition.image, "Exhibition"),
    },
  };
}

/** Every S3 key the content points at. */
export const homeImageKeys = (c: Partial<HomeContent> | null | undefined) => collectKeys(c);

export function revalidateHomePage() {
  revalidatePath("/");
}

export function homeErrorResponse(err: unknown) {
  if (err instanceof ValidationError) return NextResponse.json({ error: err.message }, { status: 400 });
  console.error("[home api]", err);
  return NextResponse.json({ error: "The server couldn't complete the request." }, { status: 500 });
}
