import "server-only";
import { connectDB } from "@/lib/apis/db";
import { mergeWithDefaults } from "@/lib/apis/content-parse";
import { ABOUT_DEFAULTS } from "@/lib/about-defaults";
import { AboutPage } from "@/models/AboutPage.schema";
import type { AboutContentMap, AboutContentResponse, AboutSlug } from "@/types/about";

export async function getAboutContentWithMeta<S extends AboutSlug>(slug: S): Promise<AboutContentResponse<S>> {
  await connectDB();
  const doc = await AboutPage.findOne({ slug }).lean();
  return {
    slug,
    content: mergeWithDefaults(ABOUT_DEFAULTS[slug], doc?.content) as AboutContentMap[S],
    updatedAt: doc?.updatedAt ? new Date(doc.updatedAt).toISOString() : null,
  };
}

/** For the public pages. Never throws, so a database hiccup shows the default text. */
export async function getAboutContent<S extends AboutSlug>(slug: S): Promise<AboutContentMap[S]> {
  try {
    return (await getAboutContentWithMeta(slug)).content;
  } catch (err) {
    console.error(`[about/${slug}] content couldn't be loaded`, err);
    return ABOUT_DEFAULTS[slug];
  }
}
