import "server-only";
import { connectDB } from "@/lib/apis/db";
import { Blog } from "@/models/Blog.schema";
import type { BlogDTO, BlogListItem } from "@/types/blog";

export async function getPublishedBlogs({ page = 1, limit = 9, category }: { page?: number; limit?: number; category?: string } = {}) {
  await connectDB();
  const filter: Record<string, unknown> = { status: "published" };
  if (category) filter.category = category;

  const [items, total] = await Promise.all([
    Blog.find(filter).sort({ publishedAt: -1 }).skip((page - 1) * limit).limit(limit).select("-content").lean(),
    Blog.countDocuments(filter),
  ]);

  return {
    items: JSON.parse(JSON.stringify(items)) as BlogListItem[],
    total,
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getPublishedBlog(slug: string) {
  await connectDB();
  const blog = await Blog.findOne({ slug, status: "published" }).lean();
  return blog ? (JSON.parse(JSON.stringify(blog)) as BlogDTO) : null;
}
