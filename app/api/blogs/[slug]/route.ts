import { NextResponse, type NextRequest } from "next/server";
import { getPublishedBlog } from "@/lib/apis/blog-queries";
import { errorResponse } from "@/lib/apis/blog-server";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const blog = await getPublishedBlog(decodeURIComponent(slug));
    return blog ? NextResponse.json(blog) : NextResponse.json({ error: "Post not found." }, { status: 404 });
  } catch (err) {
    return errorResponse(err);
  }
}
