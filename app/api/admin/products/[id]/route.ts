import { NextResponse, type NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/apis/db";
import { requireAdmin } from "@/lib/apis/auth";
import { deleteObjects } from "@/lib/apis/s3";
import { slugify } from "@/lib/blog-utils";
import {
  parseProductInput,
  productErrorResponse,
  revalidateProductPages,
  uniqueProductSlug,
} from "@/lib/apis/product-server";
import { Product } from "@/models/Product.schema";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

const notFound = () => NextResponse.json({ error: "This product doesn't exist or was deleted." }, { status: 404 });

export async function GET(req: NextRequest, { params }: Ctx) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  if (!isValidObjectId(id)) return notFound();

  try {
    await connectDB();
    const product = await Product.findById(id).lean();
    return product ? NextResponse.json(product) : notFound();
  } catch (err) {
    return productErrorResponse(err);
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  if (!isValidObjectId(id)) return notFound();

  try {
    const data = parseProductInput(await req.json().catch(() => null), { partial: true });
    await connectDB();

    const product = await Product.findById(id);
    if (!product) return notFound();

    if (data.slug !== undefined) {
      data.slug = await uniqueProductSlug(data.slug || slugify(data.name ?? product.name), id);
    }
    if (data.status === "published" && !product.publishedAt) data.publishedAt = new Date();

    const previousImageKey = product.image?.key;
    const previousCatalogKey = product.catalog?.key;
    product.set(data);
    await product.save();

    // Remove replaced or removed files from S3.
    const stale: (string | undefined)[] = [];
    if (previousImageKey && data.image !== undefined && data.image?.key !== previousImageKey) stale.push(previousImageKey);
    if (previousCatalogKey && data.catalog !== undefined && data.catalog?.key !== previousCatalogKey) stale.push(previousCatalogKey);
    await deleteObjects(stale);

    revalidateProductPages();
    return NextResponse.json(product.toJSON());
  } catch (err) {
    return productErrorResponse(err);
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  if (!isValidObjectId(id)) return notFound();

  try {
    await connectDB();
    const product = await Product.findByIdAndDelete(id).lean();
    if (!product) return notFound();
    await deleteObjects([product.image?.key, product.catalog?.key]);
    revalidateProductPages();
    return NextResponse.json({ deleted: 1 });
  } catch (err) {
    return productErrorResponse(err);
  }
}
