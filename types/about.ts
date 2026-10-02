import type { BlogImage } from "@/types/blog";

export type AboutImage = BlogImage;

export const ABOUT_SLUGS = ["company-introduction", "mission-vision", "compliance", "downloads", "faqs"] as const;
export type AboutSlug = (typeof ABOUT_SLUGS)[number];

export interface AboutHero {
  /** Small spaced-out label, e.g. "INTRODUCTION". */
  eyebrow: string;
  title: string;
  /** Use a new line to break the text in two. */
  subtitle: string;
}

export interface AboutFile {
  url: string;
  key: string;
  fileName: string;
  size: number;
}

export interface CompanyIntroContent {
  hero: AboutHero;
  image: AboutImage | null;
  greeting: string;
  /** Rich HTML for the body of the letter. */
  letter: string;
  signoff: string;
  signature: string;
}

export interface TextBlock {
  heading: string;
  text: string;
  image: AboutImage | null;
}

export interface MissionVisionContent {
  hero: AboutHero;
  intro: { eyebrow: string; heading: string; text: string };
  /** First block: white background, image on the left. */
  blockOne: TextBlock;
  /** Second block: grey background, image on the right. */
  blockTwo: TextBlock;
  global: { heading: string; paragraphs: string[]; image: AboutImage | null };
  achievements: {
    heading: string;
    items: { title: string; description: string }[];
    closing: string;
  };
}

export interface ComplianceContent {
  hero: AboutHero;
  lead: string;
  body: string;
  credentials: { label: string; image: AboutImage | null }[];
}

export interface DownloadsContent {
  hero: AboutHero;
  heading: string;
  linkLabel: string;
  resources: { title: string; href: string; file: AboutFile | null }[];
}

export interface FaqsContent {
  hero: AboutHero;
  items: { question: string; answer: string }[];
}

export interface AboutContentMap {
  "company-introduction": CompanyIntroContent;
  "mission-vision": MissionVisionContent;
  compliance: ComplianceContent;
  downloads: DownloadsContent;
  faqs: FaqsContent;
}

export interface AboutContentResponse<S extends AboutSlug = AboutSlug> {
  slug: S;
  content: AboutContentMap[S];
  updatedAt: string | null;
}

export const ABOUT_PAGE_LABELS: Record<AboutSlug, string> = {
  "company-introduction": "Company Introduction",
  "mission-vision": "Mission & Vision",
  compliance: "Compliance",
  downloads: "Downloads",
  faqs: "FAQs",
};

export function isAboutSlug(value: string): value is AboutSlug {
  return (ABOUT_SLUGS as readonly string[]).includes(value);
}
