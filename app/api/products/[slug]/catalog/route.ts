import { NextResponse, type NextRequest } from "next/server";
import { getPublishedProduct } from "@/lib/apis/product-queries";
import { productErrorResponse } from "@/lib/apis/product-server";

export const dynamic = "force-dynamic";

/**
 * GET /api/products/:slug/catalog
 * Streams the product's PDF from S3 with an attachment header, so the
 * browser downloads it (a plain link to another domain would only open it).
 * Add ?view=1 to open it in the browser instead.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const product = await getPublishedProduct(decodeURIComponent(slug));
    if (!product?.catalog?.url) {
      return NextResponse.json({ error: "This product has no catalogue." }, { status: 404 });
    }

    const file = await fetch(product.catalog.url, { cache: "no-store" });
    if (!file.ok || !file.body) {
      return NextResponse.json({ error: "The catalogue couldn't be loaded." }, { status: 502 });
    }

    const base = (product.catalog.title || `${product.name} Catalogue`).replace(/[^\w\s.-]/g, "").trim() || "catalogue";
    const fileName = `${base}.pdf`;
    const disposition = req.nextUrl.searchParams.get("view") ? "inline" : "attachment";

    const headers = new Headers({
      "Content-Type": "application/pdf",
      "Content-Disposition": `${disposition}; filename="${fileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      "Cache-Control": "public, max-age=300",
    });
    const length = file.headers.get("content-length");
    if (length) headers.set("Content-Length", length);

    return new Response(file.body, { headers });
  } catch (err) {
    return productErrorResponse(err);
  }
}
