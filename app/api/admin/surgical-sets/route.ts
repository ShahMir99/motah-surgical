import { NextResponse, type NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/apis/db";
import { requireAdmin } from "@/lib/apis/auth";
import { deleteObjects } from "@/lib/apis/s3";
import { slugify } from "@/lib/blog-utils";
import { ValidationError } from "@/lib/apis/blog-server";
import {
  parseSurgicalSetInput,
  revalidateSurgicalSetPages,
  surgicalSetErrorResponse,
  uniqueSurgicalSetSlug,
} from "@/lib/apis/surgical-set-server";
import { SurgicalSet } from "@/models/SurgicalSet.schema";

export const dynamic = "force-dynamic";

const SORTS = {
  order: { order: 1, name: 1 },
  recent: { updatedAt: -1 },
  name: { name: 1 },
} as const;

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /api/admin/surgical-sets?page&limit&q&status&category&sort
export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    await connectDB();
    const sp = req.nextUrl.searchParams;
    const page = Math.max(1, Number(sp.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(sp.get("limit")) || 10));
    const status = sp.get("status");
    const category = sp.get("category")?.trim();
    const q = sp.get("q")?.trim();
    const sort = SORTS[(sp.get("sort") ?? "order") as keyof typeof SORTS] ?? SORTS.order;

    const filter: Record<string, unknown> = {};
    if (status === "draft" || status === "published") filter.status = status;
    if (category) filter.category = category;
    if (q) {
      const rx = new RegExp(escapeRegex(q), "i");
      filter.$or = [{ name: rx }, { category: rx }, { summary: rx }, { sku: rx }, { tags: rx }];
    }

    const [docs, total, grouped] = await Promise.all([
      SurgicalSet.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .select("-description -specifications -faqs")
        .lean(),
      SurgicalSet.countDocuments(filter),
      SurgicalSet.aggregate<{ _id: string; n: number }>([{ $group: { _id: "$status", n: { $sum: 1 } } }]),
    ]);

    // The rows themselves stay on the server; the table only shows how many.
    const items = docs.map(({ items: rows, ...rest }) => ({ ...rest, itemCount: rows?.length ?? 0 }));

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
    return surgicalSetErrorResponse(err);
  }
}

// POST /api/admin/surgical-sets → create
export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const data = parseSurgicalSetInput(await req.json().catch(() => null), { partial: false });
    await connectDB();

    data.slug = await uniqueSurgicalSetSlug(data.slug || slugify(data.name ?? ""));
    if (data.status === "published") data.publishedAt = new Date();
    if (data.order === undefined) {
      // New sets go to the end of the list.
      const last = await SurgicalSet.findOne().sort({ order: -1 }).select("order").lean();
      data.order = (last?.order ?? 0) + 1;
    }

    const set = await SurgicalSet.create(data);
    revalidateSurgicalSetPages();
    return NextResponse.json(set.toJSON(), { status: 201 });
  } catch (err) {
    return surgicalSetErrorResponse(err);
  }
}

// DELETE /api/admin/surgical-sets  body: { ids: string[] } → bulk delete
export async function DELETE(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const body = (await req.json().catch(() => null)) as { ids?: unknown } | null;
    const ids = Array.isArray(body?.ids)
      ? body.ids.filter((id): id is string => typeof id === "string" && isValidObjectId(id))
      : [];
    if (!ids.length) throw new ValidationError("Select at least one set to delete.");

    await connectDB();
    const docs = await SurgicalSet.find({ _id: { $in: ids } }).select("image").lean();
    const { deletedCount } = await SurgicalSet.deleteMany({ _id: { $in: ids } });
    await deleteObjects(docs.map((d) => d.image?.key));
    revalidateSurgicalSetPages();

    return NextResponse.json({ deleted: deletedCount });
  } catch (err) {
    return surgicalSetErrorResponse(err);
  }
}
