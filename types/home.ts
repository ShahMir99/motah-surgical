import type { BlogImage } from "@/types/blog";

export type HomeImage = BlogImage;

export interface HomeHighlight {
  heading: string;
  blurb: string;
  href: string;
  image: HomeImage | null;
}

export interface HomeContent {
  hero: {
    eyebrow: string;
    heading: string;
    buttonLabel: string;
    buttonHref: string;
    image: HomeImage | null;
  };
  /** Certification strip under the hero. */
  badges: string[];
  products: {
    eyebrow: string;
    heading: string;
    buttonLabel: string;
    /** How many published products to show. */
    limit: number;
  };
  about: {
    prefix: string;
    title: string;
    body: string;
    buttonLabel: string;
    buttonHref: string;
    image: HomeImage | null;
  };
  highlights: {
    eyebrow: string;
    heading: string;
    items: HomeHighlight[];
  };
  exhibition: {
    titleTop: string;
    titleBottom: string;
    text: string;
    image: HomeImage | null;
  };
}

export interface HomeContentResponse {
  content: HomeContent;
  updatedAt: string | null;
}
