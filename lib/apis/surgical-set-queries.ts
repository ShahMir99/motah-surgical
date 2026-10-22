import "server-only";
import { connectDB } from "@/lib/apis/db";
import { SurgicalSet } from "@/models/SurgicalSet.schema";
import type { SurgicalSetCategory, SurgicalSetDTO, SurgicalSetListItem } from "@/types/surgical-set";

const PUBLISHED = { status: "published" } as const;
const LIST_ORDER = { order: 1, name: 1 } as const;
/** The card grid only needs these; the long fields stay in the database. */
const CARD_FIELDS = "name slug category summary image sku type size tags order status publishedAt createdAt updatedAt";

const plain = <T>(value: unknown) => JSON.parse(JSON.stringify(value)) as T;

export type PublishedSetsPage = {
  items: SurgicalSetListItem[];
  total: number;
  page: number;
  pages: number;
};

export async function getPublishedSurgicalSets({
  page = 1,
  limit = 20,
  category,
}: { page?: number; limit?: number; category?: string } = {}): Promise<PublishedSetsPage> {
  await connectDB();
  const filter: Record<string, unknown> = { ...PUBLISHED };
  if (category) filter.category = category;

  const [docs, total] = await Promise.all([
    SurgicalSet.find(filter)
      .sort(LIST_ORDER)
      .skip((page - 1) * limit)
      .limit(limit)
      .select(CARD_FIELDS)
      .lean(),
    SurgicalSet.countDocuments(filter),
  ]);

  return {
    items: plain<SurgicalSetListItem[]>(docs),
    total,
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
  };
}

/** Categories that actually have published sets, with their counts. */
export async function getSurgicalSetCategories(): Promise<SurgicalSetCategory[]> {
  await connectDB();
  const grouped = await SurgicalSet.aggregate<{ _id: string; n: number }>([
    { $match: { status: "published", category: { $nin: ["", null] } } },
    { $group: { _id: "$category", n: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  return grouped.map((g) => ({ name: g._id, count: g.n }));
}

export async function getPublishedSurgicalSet(slug: string) {
  await connectDB();
  const set = await SurgicalSet.findOne({ slug, ...PUBLISHED }).lean();
  return set ? plain<SurgicalSetDTO>(set) : null;
}

/** Other published sets in the same category, for the strip at the bottom of a set page. */
export async function getRelatedSurgicalSets(set: Pick<SurgicalSetDTO, "_id" | "category">, limit = 4) {
  await connectDB();
  const docs = await SurgicalSet.find({
    ...PUBLISHED,
    _id: { $ne: set._id },
    ...(set.category ? { category: set.category } : {}),
  })
    .sort(LIST_ORDER)
    .limit(limit)
    .select(CARD_FIELDS)
    .lean();
  return plain<SurgicalSetListItem[]>(docs);
}
