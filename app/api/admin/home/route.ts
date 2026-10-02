import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/apis/db";
import { requireAdmin } from "@/lib/apis/auth";
import { deleteObjects } from "@/lib/apis/s3";
import { getHomeContentWithMeta } from "@/lib/apis/home-queries";
import {
  homeErrorResponse,
  homeImageKeys,
  parseHomeInput,
  revalidateHomePage,
} from "@/lib/apis/home-server";
import { HomePage } from "@/models/HomePage.schema";

export const dynamic = "force-dynamic";

// GET /api/admin/home → saved content merged with the built-in defaults
export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    return NextResponse.json(await getHomeContentWithMeta());
  } catch (err) {
    return homeErrorResponse(err);
  }
}

// PUT /api/admin/home → replace the home page content
export async function PUT(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const content = parseHomeInput(await req.json().catch(() => null));
    await connectDB();

    const before = await HomePage.findOne({ key: "home" }).select("content").lean();
    const doc = await HomePage.findOneAndUpdate(
      { key: "home" },
      { $set: { content } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    // Remove S3 files that are no longer used.
    const kept = new Set(homeImageKeys(content));
    await deleteObjects(homeImageKeys(before?.content).filter((k) => !kept.has(k)));

    revalidateHomePage();
    return NextResponse.json({ content, updatedAt: new Date(doc!.updatedAt).toISOString() });
  } catch (err) {
    return homeErrorResponse(err);
  }
}
