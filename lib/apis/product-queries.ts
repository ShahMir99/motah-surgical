import "server-only";
import { connectDB } from "@/lib/apis/db";
import { Product } from "@/models/Product.schema";
import type { ProductDTO, ProductListItem, ProductMenuItem } from "@/types/product";

const PUBLISHED = { status: "published" } as const;
const MENU_ORDER = { order: 1, name: 1 } as const;

export async function getPublishedProducts() {
  await connectDB();
  const items = await Product.find(PUBLISHED).sort(MENU_ORDER).select("-description").lean();
  return JSON.parse(JSON.stringify(items)) as ProductListItem[];
}

export async function getPublishedProduct(slug: string) {
  await connectDB();
  const product = await Product.findOne({ slug, ...PUBLISHED }).lean();
  return product ? (JSON.parse(JSON.stringify(product)) as ProductDTO) : null;
}

/**
 * Names and slugs for the header's "Surgical Instruments" menu.
 * Returns an empty list instead of throwing, so a database hiccup
 * never takes the whole site down.
 */
export async function getProductMenu(): Promise<ProductMenuItem[]> {
  try {
    await connectDB();
    const items = await Product.find(PUBLISHED).sort(MENU_ORDER).select("name slug").lean();
    return items.map((p) => ({ name: p.name, slug: p.slug }));
  } catch (err) {
    console.error("[products] menu couldn't be loaded", err);
    return [];
  }
}
