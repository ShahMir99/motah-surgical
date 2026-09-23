export type BlogStatus = "draft" | "published";

export interface BlogImage {
  url: string;
  key: string;
  alt?: string;
}

export interface BlogSeo {
  metaTitle: string;
  metaDescription: string;
}

export interface BlogFields {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: BlogImage | null;
  category: string;
  tags: string[];
  author: string;
  seo: BlogSeo;
}

export type BlogPayload = Partial<BlogFields> & { status?: BlogStatus };

export interface BlogDTO extends BlogFields {
  _id: string;
  status: BlogStatus;
  readingTime: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type BlogListItem = Omit<BlogDTO, "content">;

export interface BlogListResponse {
  items: BlogListItem[];
  total: number;
  page: number;
  pages: number;
  counts: { all: number; published: number; draft: number };
}
