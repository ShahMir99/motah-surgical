import { NextResponse, type NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/apis/db";
import { requireAdmin } from "@/lib/apis/auth";
import { deleteObjects } from "@/lib/apis/s3";
import { slugify } from "@/lib/blog-utils";
import { ValidationError } from "@/lib/apis/blog-server";
import {
  parseProductInput,
  productErrorResponse,
  revalidateProductPages,
  uniqueProductSlug,
} from "@/lib/apis/product-server";
import { Product } from "@/models/Product.schema";

export const dynamic = "force-dynamic";

const SORTS = {
  order: { order: 1, name: 1 },
  recent: { updatedAt: -1 },
  name: { name: 1 },
} as const;

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /api/admin/products?page&limit&q&status&sort
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
    const sort = SORTS[(sp.get("sort") ?? "order") as keyof typeof SORTS] ?? SORTS.order;

    const filter: Record<string, unknown> = {};
    if (status === "draft" || status === "published") filter.status = status;
    if (q) {
      const rx = new RegExp(escapeRegex(q), "i");
      filter.$or = [{ name: rx }, { tagline: rx }, { summary: rx }, { categories: rx }];
    }

    const [items, total, grouped] = await Promise.all([
      Product.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).select("-description").lean(),
      Product.countDocuments(filter),
      Product.aggregate<{ _id: string; n: number }>([{ $group: { _id: "$status", n: { $sum: 1 } } }]),
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
    return productErrorResponse(err);
  }
}

// POST /api/admin/products → create
export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const data = parseProductInput(await req.json().catch(() => null), { partial: false });
    await connectDB();

    data.slug = await uniqueProductSlug(data.slug || slugify(data.name ?? ""));
    if (data.status === "published") data.publishedAt = new Date();
    if (data.order === undefined) {
      // New products go to the end of the menu.
      const last = await Product.findOne().sort({ order: -1 }).select("order").lean();
      data.order = (last?.order ?? 0) + 1;
    }

    const product = await Product.create(data);
    revalidateProductPages();
    return NextResponse.json(product.toJSON(), { status: 201 });
  } catch (err) {
    return productErrorResponse(err);
  }
}

// DELETE /api/admin/products  body: { ids: string[] } → bulk delete
export async function DELETE(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const body = (await req.json().catch(() => null)) as { ids?: unknown } | null;
    const ids = Array.isArray(body?.ids)
      ? body.ids.filter((id): id is string => typeof id === "string" && isValidObjectId(id))
      : [];
    if (!ids.length) throw new ValidationError("Select at least one product to delete.");

    await connectDB();
    const docs = await Product.find({ _id: { $in: ids } }).select("image catalog").lean();
    const { deletedCount } = await Product.deleteMany({ _id: { $in: ids } });
    await deleteObjects(docs.flatMap((d) => [d.image?.key, d.catalog?.key]));
    revalidateProductPages();

    return NextResponse.json({ deleted: deletedCount });
  } catch (err) {
    return productErrorResponse(err);
  }
}
