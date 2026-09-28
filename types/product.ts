import type { BlogImage } from "@/types/blog";

export type ProductStatus = "draft" | "published";

export type ProductImage = BlogImage;

/** A PDF catalogue stored in S3. */
export interface ProductCatalog {
  url: string;
  key: string;
  /** Original file name, used for the download. */
  fileName: string;
  size: number;
  /** Label shown on the site, e.g. "General Surgery Catalogue". */
  title: string;
}

export interface ProductSeo {
  metaTitle: string;
  metaDescription: string;
}

export interface ProductFields {
  name: string;
  slug: string;
  /** Hero line above the name, e.g. "Comprehensive Solutions for". */
  tagline: string;
  /** Bold words after the tagline. Empty means the product name. */
  taglineBold: string;
  /** Short text on the /products list. */
  summary: string;
  /** Rich HTML shown on the detail page. */
  description: string;
  /** "Featured categories" list on the detail page. */
  categories: string[];
  badge: string;
  order: number;
  image: ProductImage | null;
  catalog: ProductCatalog | null;
  seo: ProductSeo;
}

export type ProductPayload = Partial<ProductFields> & { status?: ProductStatus };

export interface ProductDTO extends ProductFields {
  _id: string;
  status: ProductStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ProductListItem = Omit<ProductDTO, "description">;

export interface ProductListResponse {
  items: ProductListItem[];
  total: number;
  page: number;
  pages: number;
  counts: { all: number; published: number; draft: number };
}

/** One entry in the site's "Surgical Instruments" menu. */
export interface ProductMenuItem {
  name: string;
  slug: string;
}
