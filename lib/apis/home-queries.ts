import "server-only";
import { connectDB } from "@/lib/apis/db";
import { HOME_DEFAULTS } from "@/lib/home-defaults";
import { HomePage } from "@/models/HomePage.schema";
import type { HomeContent, HomeContentResponse } from "@/types/home";

/** Saved values win; anything missing falls back to the built-in text. */
export function mergeHomeContent(saved: Partial<HomeContent> | null | undefined): HomeContent {
  const d = HOME_DEFAULTS;
  const s = saved ?? {};
  const items = s.highlights?.items?.length ? s.highlights.items : d.highlights.items;
  return {
    hero: { ...d.hero, ...s.hero },
    badges: s.badges?.length ? s.badges : d.badges,
    products: { ...d.products, ...s.products },
    about: { ...d.about, ...s.about },
    highlights: { ...d.highlights, ...s.highlights, items },
    exhibition: { ...d.exhibition, ...s.exhibition },
  };
}

export async function getHomeContentWithMeta(): Promise<HomeContentResponse> {
  await connectDB();
  const doc = await HomePage.findOne({ key: "home" }).lean();
  return {
    content: mergeHomeContent(doc?.content),
    updatedAt: doc?.updatedAt ? new Date(doc.updatedAt).toISOString() : null,
  };
}

/** For the public page. Never throws, so a database hiccup shows the default text. */
export async function getHomeContent(): Promise<HomeContent> {
  try {
    return (await getHomeContentWithMeta()).content;
  } catch (err) {
    console.error("[home] content couldn't be loaded", err);
    return HOME_DEFAULTS;
  }
}
