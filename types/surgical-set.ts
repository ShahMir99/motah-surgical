import type { BlogImage } from "@/types/blog";

export type SurgicalSetStatus = "draft" | "published";

export type SurgicalSetImage = BlogImage;

/** One line of the "Our set includes" table. */
export interface SurgicalSetItem {
  name: string;
  /** Free text so "2 pcs", "1 pair" and "as required" all work. */
  quantity: string;
}

/** One row of the Technical Specifications tab. */
export interface SurgicalSetSpec {
  label: string;
  value: string;
}

export interface SurgicalSetFaq {
  question: string;
  answer: string;
}

export interface SurgicalSetSeo {
  metaTitle: string;
  metaDescription: string;
}

export interface SurgicalSetFields {
  name: string;
  slug: string;
  /** Groups the set in the sidebar, e.g. "General Surgery Instruments". */
  category: string;
  /** Intro paragraph next to the photo. */
  summary: string;
  /** Rich HTML under the Description tab. */
  description: string;
  /** Ticked highlights next to the photo, e.g. "ISO-Certified". */
  features: string[];
  items: SurgicalSetItem[];
  specifications: SurgicalSetSpec[];
  faqs: SurgicalSetFaq[];
  sku: string;
  /** Product type shown in the details list, e.g. "Surgical Set". */
  type: string;
  size: string;
  tags: string[];
  image: SurgicalSetImage | null;
  order: number;
  seo: SurgicalSetSeo;
}

export type SurgicalSetPayload = Partial<SurgicalSetFields> & { status?: SurgicalSetStatus };

export interface SurgicalSetDTO extends SurgicalSetFields {
  _id: string;
  status: SurgicalSetStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Exactly the fields a card needs; the long ones stay in the database. */
export type SurgicalSetListItem = Pick<
  SurgicalSetDTO,
  | "_id"
  | "name"
  | "slug"
  | "category"
  | "summary"
  | "image"
  | "sku"
  | "type"
  | "size"
  | "tags"
  | "order"
  | "status"
  | "publishedAt"
  | "createdAt"
  | "updatedAt"
>;

/** A row of the admin table, which also counts the instruments in the set. */
export type SurgicalSetAdminListItem = SurgicalSetListItem & { itemCount: number };

export interface SurgicalSetListResponse {
  items: SurgicalSetAdminListItem[];
  total: number;
  page: number;
  pages: number;
  counts: { all: number; published: number; draft: number };
}

/** One entry of the "Categories" sidebar on /surgical-sets. */
export interface SurgicalSetCategory {
  name: string;
  count: number;
}
