import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/apis/db";
import { requireAdmin } from "@/lib/apis/auth";
import { collectKeys } from "@/lib/apis/content-parse";
import { deleteObjects } from "@/lib/apis/s3";
import { getAboutContentWithMeta } from "@/lib/apis/about-queries";
import { aboutErrorResponse, parseAboutInput, revalidateAboutPage } from "@/lib/apis/about-server";
import { AboutPage } from "@/models/AboutPage.schema";
import { isAboutSlug } from "@/types/about";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ slug: string }> };

// GET /api/admin/about/:slug → saved content merged with the built-in text
export async function GET(req: NextRequest, { params }: Ctx) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { slug } = await params;
  if (!isAboutSlug(slug)) return NextResponse.json({ error: "Unknown page." }, { status: 404 });

  try {
    return NextResponse.json(await getAboutContentWithMeta(slug));
  } catch (err) {
    return aboutErrorResponse(err);
  }
}

// PUT /api/admin/about/:slug → replace the page content
export async function PUT(req: NextRequest, { params }: Ctx) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { slug } = await params;
  if (!isAboutSlug(slug)) return NextResponse.json({ error: "Unknown page." }, { status: 404 });

  try {
    const content = parseAboutInput(slug, await req.json().catch(() => null));
    await connectDB();

    const before = await AboutPage.findOne({ slug }).select("content").lean();
    const doc = await AboutPage.findOneAndUpdate(
      { slug },
      { $set: { content } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    // Remove S3 files that are no longer used.
    const kept = new Set(collectKeys(content));
    await deleteObjects(collectKeys(before?.content).filter((k) => !kept.has(k)));

    revalidateAboutPage(slug);
    return NextResponse.json({ slug, content, updatedAt: new Date(doc!.updatedAt).toISOString() });
  } catch (err) {
    return aboutErrorResponse(err);
  }
}
