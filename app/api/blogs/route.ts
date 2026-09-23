import { NextResponse, type NextRequest } from "next/server";
import { getPublishedBlogs } from "@/lib/apis/blog-queries";
import { errorResponse } from "@/lib/apis/blog-server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const page = Math.max(1, Number(sp.get("page")) || 1);
    const limit = Math.min(30, Math.max(1, Number(sp.get("limit")) || 9));
    return NextResponse.json(await getPublishedBlogs({ page, limit, category: sp.get("category") ?? undefined }));
  } catch (err) {
    return errorResponse(err);
  }
}
