import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/apis/auth";
import { createImageUpload } from "@/lib/apis/s3";
import { errorResponse, ValidationError } from "@/lib/apis/blog-server";
import {
  IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  MAX_IMAGE_MB,
} from "@/lib/apis/upload-config";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const body = (await req.json().catch(() => null)) as {
      contentType?: unknown;
      size?: unknown;
    } | null;
    const contentType =
      typeof body?.contentType === "string" ? body.contentType : "";
    const size = Number(body?.size);

    if (!IMAGE_TYPES[contentType])
      throw new ValidationError("Use a JPG, PNG, WebP, GIF or AVIF image.");
    if (!Number.isInteger(size) || size <= 0 || size > MAX_IMAGE_BYTES) {
      throw new ValidationError(
        `Images must be ${MAX_IMAGE_MB} MB or smaller.`,
      );
    }

    return NextResponse.json(
      await createImageUpload(contentType, size, "assets"),
    );
  } catch (err) {
    return errorResponse(err);
  }
}
