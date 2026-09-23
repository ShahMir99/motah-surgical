import { NextResponse, type NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/apis/db";
import { requireAdmin } from "@/lib/apis/auth";
import { deleteObjects } from "@/lib/apis/s3";
import { slugify } from "@/lib/blog-utils";
import { errorResponse, parseBlogInput, uniqueSlug } from "@/lib/apis/blog-server";
import { Blog } from "@/models/Blog.schema";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

const notFound = () => NextResponse.json({ error: "This post doesn't exist or was deleted." }, { status: 404 });

export async function GET(req: NextRequest, { params }: Ctx) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  if (!isValidObjectId(id)) return notFound();

  try {
    await connectDB();
    const blog = await Blog.findById(id).lean();
    return blog ? NextResponse.json(blog) : notFound();
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  if (!isValidObjectId(id)) return notFound();

  try {
    const data = parseBlogInput(await req.json().catch(() => null), { partial: true });
    await connectDB();

    const blog = await Blog.findById(id);
    if (!blog) return notFound();

    if (data.slug !== undefined) {
      data.slug = await uniqueSlug(data.slug || slugify(data.title ?? blog.title), id);
    }
    // Keep the original publish date when a post is unpublished and published again.
    if (data.status === "published" && !blog.publishedAt) data.publishedAt = new Date();

    const previousCoverKey = blog.coverImage?.key;
    blog.set(data);
    await blog.save();

    if (previousCoverKey && data.coverImage !== undefined && data.coverImage?.key !== previousCoverKey) {
      await deleteObjects([previousCoverKey]);
    }

    return NextResponse.json(blog.toJSON());
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  if (!isValidObjectId(id)) return notFound();

  try {
    await connectDB();
    const blog = await Blog.findByIdAndDelete(id).lean();
    if (!blog) return notFound();
    await deleteObjects([blog.coverImage?.key]);
    return NextResponse.json({ deleted: 1 });
  } catch (err) {
    return errorResponse(err);
  }
}
