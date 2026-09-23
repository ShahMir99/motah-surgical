import { NextResponse, type NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/apis/db";
import { requireAdmin } from "@/lib/apis/auth";
import { deleteObjects } from "@/lib/apis/s3";
import { slugify } from "@/lib/blog-utils";
import { errorResponse, parseBlogInput, uniqueSlug, ValidationError } from "@/lib/apis/blog-server";
import { Blog } from "@/models/Blog.schema";

export const dynamic = "force-dynamic";

const SORTS = {
  recent: { updatedAt: -1 },
  oldest: { updatedAt: 1 },
  title: { title: 1 },
} as const;


const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    await connectDB();
    const sp = req.nextUrl.searchParams;
    const page = Math.max(1, Number(sp.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(sp.get("limit")) || 10));
    const status = sp.get("status");
    const q = sp.get("q")?.trim();
    const sort = SORTS[(sp.get("sort") ?? "recent") as keyof typeof SORTS] ?? SORTS.recent;

    const filter: Record<string, unknown> = {};
    if (status === "draft" || status === "published") filter.status = status;
    if (q) {
      const rx = new RegExp(escapeRegex(q), "i");
      filter.$or = [{ title: rx }, { excerpt: rx }, { category: rx }, { tags: rx }];
    }

    const [items, total, grouped] = await Promise.all([
      Blog.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).select("-content").lean(),
      Blog.countDocuments(filter),
      Blog.aggregate<{ _id: string; n: number }>([{ $group: { _id: "$status", n: { $sum: 1 } } }]),
    ]);

    const published = grouped.find((g) => g._id === "published")?.n ?? 0;
    const draft = grouped.find((g) => g._id === "draft")?.n ?? 0;

    return NextResponse.json({
      items,
      total,
      page,
      pages: Math.max(1, Math.ceil(total / limit)),
      counts: { all: published + draft, published, draft },
    });
  } catch (err) {
    return errorResponse(err);
  }
}

// POST /api/admin/blogs  → create
export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const data = parseBlogInput(await req.json().catch(() => null), { partial: false });
    await connectDB();

    data.slug = await uniqueSlug(data.slug || slugify(data.title ?? ""));
    if (data.status === "published") data.publishedAt = new Date();

    const blog = await Blog.create(data);
    return NextResponse.json(blog.toJSON(), { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}

// DELETE /api/admin/blogs  body: { ids: string[] }  → bulk delete
export async function DELETE(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const body = (await req.json().catch(() => null)) as { ids?: unknown } | null;
    const ids = Array.isArray(body?.ids)
      ? body.ids.filter((id): id is string => typeof id === "string" && isValidObjectId(id))
      : [];
    if (!ids.length) throw new ValidationError("Select at least one post to delete.");

    await connectDB();
    const docs = await Blog.find({ _id: { $in: ids } }).select("coverImage").lean();
    const { deletedCount } = await Blog.deleteMany({ _id: { $in: ids } });
    await deleteObjects(docs.map((d) => d.coverImage?.key));

    return NextResponse.json({ deleted: deletedCount });
  } catch (err) {
    return errorResponse(err);
  }
}
