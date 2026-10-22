import { NextResponse, type NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/apis/db";
import { requireAdmin } from "@/lib/apis/auth";
import { deleteObjects } from "@/lib/apis/s3";
import { slugify } from "@/lib/blog-utils";
import {
  parseSurgicalSetInput,
  revalidateSurgicalSetPages,
  surgicalSetErrorResponse,
  uniqueSurgicalSetSlug,
} from "@/lib/apis/surgical-set-server";
import { SurgicalSet } from "@/models/SurgicalSet.schema";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

const notFound = () => NextResponse.json({ error: "This set doesn't exist or was deleted." }, { status: 404 });

export async function GET(req: NextRequest, { params }: Ctx) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  if (!isValidObjectId(id)) return notFound();

  try {
    await connectDB();
    const set = await SurgicalSet.findById(id).lean();
    return set ? NextResponse.json(set) : notFound();
  } catch (err) {
    return surgicalSetErrorResponse(err);
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  if (!isValidObjectId(id)) return notFound();

  try {
    const data = parseSurgicalSetInput(await req.json().catch(() => null), { partial: true });
    await connectDB();

    const set = await SurgicalSet.findById(id);
    if (!set) return notFound();

    if (data.slug !== undefined) {
      data.slug = await uniqueSurgicalSetSlug(data.slug || slugify(data.name ?? set.name), id);
    }
    if (data.status === "published" && !set.publishedAt) data.publishedAt = new Date();

    const previousImageKey = set.image?.key;
    set.set(data);
    await set.save();

    // Remove a replaced or removed image from S3.
    if (previousImageKey && data.image !== undefined && data.image?.key !== previousImageKey) {
      await deleteObjects([previousImageKey]);
    }

    revalidateSurgicalSetPages();
    return NextResponse.json(set.toJSON());
  } catch (err) {
    return surgicalSetErrorResponse(err);
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  if (!isValidObjectId(id)) return notFound();

  try {
    await connectDB();
    const set = await SurgicalSet.findByIdAndDelete(id).lean();
    if (!set) return notFound();
    await deleteObjects([set.image?.key]);
    revalidateSurgicalSetPages();
    return NextResponse.json({ deleted: 1 });
  } catch (err) {
    return surgicalSetErrorResponse(err);
  }
}
