"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, ExternalLink, FileText, ImageIcon, Package, Pencil, Plus, Search, Trash2 } from "lucide-react";
import type { ProductListResponse, ProductStatus } from "@/types/product";
import { Button, buttonClass, Checkbox, fieldClass, inputClass } from "@/components/admin/ui";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { StatusBadge } from "@/components/admin/blogs/StatusBadge";
import { productsApi } from "@/lib/apis/admin-api";
import { formatDate } from "@/lib/format";

type StatusFilter = "all" | ProductStatus;
type SortKey = "order" | "recent" | "name";

const PAGE_SIZE = 10;
const TABS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Drafts" },
];

const iconButton =
  "grid h-8 w-8 place-items-center rounded-md text-[#5E716B] transition-colors hover:bg-[#E9EFED] hover:text-[#10261F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18B27F]/60 [&_svg]:h-4 [&_svg]:w-4";

export default function ProductsPage() {
  const router = useRouter();
  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("order");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ProductListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [toDelete, setToDelete] = useState<string[] | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Debounce the search box.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(query.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productsApi.list({ page, limit: PAGE_SIZE, q: search, status, sort });
      setData(res);
      setSelected(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Products couldn't be loaded.");
    } finally {
      setLoading(false);
    }
  }, [page, search, status, sort]);

  useEffect(() => {
    void load();
  }, [load]);

  const items = data?.items ?? [];
  const allSelected = items.length > 0 && items.every((p) => selected.has(p._id));
  const someSelected = selected.size > 0 && !allSelected;
  const filtered = Boolean(search) || status !== "all";

  function toggle(id: string, on: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function resetFilters() {
    setQuery("");
    setSearch("");
    setStatus("all");
    setPage(1);
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      if (toDelete.length === 1) await productsApi.remove(toDelete[0]);
      else await productsApi.removeMany(toDelete);
      toast.success(toDelete.length === 1 ? "Product deleted" : `${toDelete.length} products deleted`);
      const emptiedPage = toDelete.length >= items.length && page > 1;
      setToDelete(null);
      if (emptiedPage) setPage((p) => p - 1);
      else await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "The products couldn't be deleted.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-0 lg:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#10261F]">Products</h1>
          <p className="mt-1 text-sm text-[#5E716B]">Manage the product pages, the Surgical Instruments menu and catalogues.</p>
        </div>
        <Link href="/admin/products/new" className={buttonClass("primary")}>
          <Plus aria-hidden />
          New product
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-[#DCE3E0] bg-white">
        {/* Filters */}
        <div className="flex flex-col gap-3 border-b border-[#DCE3E0] px-4 pt-3 sm:flex-row sm:items-end sm:justify-between">
          <div role="tablist" aria-label="Filter by status" className="-mb-px flex gap-5">
            {TABS.map((t) => {
              const active = status === t.value;
              const count = data?.counts[t.value];
              return (
                <button
                  key={t.value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setStatus(t.value);
                    setPage(1);
                  }}
                  className={`flex items-center gap-1.5 border-b-2 pb-3 pt-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:text-[#10261F] ${
                    active ? "border-[#18B27F] text-[#10261F]" : "border-transparent text-[#5E716B] hover:text-[#10261F]"
                  }`}
                >
                  {t.label}
                  {count !== undefined && (
                    <span className="rounded-full bg-[#EEF1F0] px-1.5 py-px text-xs tabular-nums text-[#4A5D57]">{count}</span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex gap-2 pb-3">
            <div className="relative min-w-0 flex-1 sm:w-64 sm:flex-none">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A9A95]" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products"
                aria-label="Search products"
                className={`${inputClass} h-9 pl-9`}
              />
            </div>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as SortKey);
                setPage(1);
              }}
              aria-label="Sort products"
              className={`${fieldClass} h-9 shrink-0 cursor-pointer py-0 pr-8`}
            >
              <option value="order">Menu order</option>
              <option value="recent">Last edited</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>
        </div>

        {/* Bulk actions */}
        {selected.size > 0 && (
          <div className="flex items-center justify-between gap-3 border-b border-[#DCE3E0] bg-[#F0FAF6] px-4 py-2 text-sm">
            <span className="font-medium text-[#10261F]">
              {selected.size} {selected.size === 1 ? "product" : "products"} selected
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>
                Clear selection
              </Button>
              <Button size="sm" variant="danger" onClick={() => setToDelete([...selected])}>
                <Trash2 aria-hidden />
                Delete
              </Button>
            </div>
          </div>
        )}

        {error ? (
          <div className="px-6 py-16 text-center">
            <p className="font-medium text-[#10261F]">Products couldn&apos;t be loaded</p>
            <p className="mt-1 text-sm text-[#5E716B]">{error}</p>
            <Button className="mt-5" onClick={() => void load()}>
              Try again
            </Button>
          </div>
        ) : !loading && items.length === 0 ? (
          filtered ? (
            <div className="px-6 py-16 text-center">
              <p className="font-medium text-[#10261F]">
                {search ? `No products match “${search}”` : status === "draft" ? "No drafts" : "No published products"}
              </p>
              <p className="mt-1 text-sm text-[#5E716B]">Try another search or show every product.</p>
              <Button className="mt-5" onClick={resetFilters}>
                Show all products
              </Button>
            </div>
          ) : (
            <div className="px-6 py-20 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#E1F5EC] text-[#0E7C58]">
                <Package className="h-5 w-5" aria-hidden />
              </div>
              <p className="mt-4 font-medium text-[#10261F]">No products yet</p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-[#5E716B]">
                Published products appear on the All Products page and in the Surgical Instruments menu.
              </p>
              <Link href="/admin/products/new" className={buttonClass("primary", "md", "mt-6")}>
                <Plus aria-hidden />
                Add your first product
              </Link>
            </div>
          )
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#DCE3E0] bg-[#F7F9F8] text-xs text-[#5E716B]">
                <tr>
                  <th scope="col" className="w-10 py-2.5 pl-4">
                    <Checkbox
                      label="Select all products on this page"
                      checked={allSelected}
                      indeterminate={someSelected}
                      onChange={(on) => setSelected(on ? new Set(items.map((p) => p._id)) : new Set())}
                      disabled={loading || !items.length}
                    />
                  </th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Product</th>
                  <th scope="col" className="hidden px-3 py-2.5 font-medium sm:table-cell">Status</th>
                  <th scope="col" className="hidden px-3 py-2.5 font-medium md:table-cell">Order</th>
                  <th scope="col" className="hidden px-3 py-2.5 font-medium md:table-cell">Catalogue</th>
                  <th scope="col" className="hidden px-3 py-2.5 font-medium lg:table-cell">Last edited</th>
                  <th scope="col" className="hidden py-2.5 pr-4 sm:table-cell">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y divide-[#E8EDEB] transition-opacity ${loading && data ? "opacity-50" : ""}`}>
                {loading && !data
                  ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                  : items.map((product) => {
                      const isSelected = selected.has(product._id);
                      return (
                        <tr
                          key={product._id}
                          onClick={() => router.push(`/admin/products/${product._id}`)}
                          className={`cursor-pointer transition-colors ${isSelected ? "bg-[#F0FAF6]" : "hover:bg-[#F7F9F8]"}`}
                        >
                          <td className="py-3 pl-4" onClick={(e) => e.stopPropagation()}>
                            <Checkbox label={`Select ${product.name}`} checked={isSelected} onChange={(on) => toggle(product._id, on)} />
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-11 w-16 shrink-0 overflow-hidden rounded bg-[#EEF1F0]">
                                {product.image?.url ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={product.image.url} alt="" loading="lazy" className="h-full w-full object-cover" />
                                ) : (
                                  <div className="grid h-full w-full place-items-center text-[#A3B2AD]">
                                    <ImageIcon className="h-4 w-4" aria-hidden />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <Link
                                  href={`/admin/products/${product._id}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="block max-w-[12.5rem] truncate font-medium text-[#10261F] hover:underline focus-visible:underline focus-visible:outline-none sm:max-w-md"
                                >
                                  {product.name}
                                </Link>
                                <p className="max-w-[12.5rem] truncate text-xs text-[#5E716B] sm:max-w-md">
                                  {product.tagline || product.summary || `/products/${product.slug}`}
                                </p>
                                <div className="mt-1.5 sm:hidden">
                                  <StatusBadge status={product.status} />
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="hidden px-3 py-3 sm:table-cell">
                            <StatusBadge status={product.status} />
                          </td>
                          <td className="hidden px-3 py-3 tabular-nums text-[#3E534C] md:table-cell">{product.order}</td>
                          <td className="hidden px-3 py-3 md:table-cell">
                            {product.catalog ? (
                              <span className="inline-flex items-center gap-1.5 text-[#0B6A4B]">
                                <FileText className="h-3.5 w-3.5" aria-hidden />
                                PDF
                              </span>
                            ) : (
                              <span className="text-[#A3B2AD]">None</span>
                            )}
                          </td>
                          <td className="hidden whitespace-nowrap px-3 py-3 text-[#3E534C] lg:table-cell">{formatDate(product.updatedAt)}</td>
                          <td className="hidden py-3 pr-4 sm:table-cell" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-end gap-1">
                              {product.status === "published" && (
                                <a
                                  href={`/products/${product.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={`View ${product.name} on the website`}
                                  title="View on website"
                                  className={iconButton}
                                >
                                  <ExternalLink aria-hidden />
                                </a>
                              )}
                              <Link href={`/admin/products/${product._id}`} aria-label={`Edit ${product.name}`} title="Edit" className={iconButton}>
                                <Pencil aria-hidden />
                              </Link>
                              <button
                                type="button"
                                aria-label={`Delete ${product.name}`}
                                title="Delete"
                                onClick={() => setToDelete([product._id])}
                                className={`${iconButton} hover:bg-[#FDF0EE] hover:text-[#B42318]`}
                              >
                                <Trash2 aria-hidden />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
        )}

        {data && data.total > 0 && !error && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#DCE3E0] px-4 py-3 text-sm text-[#5E716B]">
            <span className="tabular-nums">
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, data.total)} of {data.total}
            </span>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => setPage((p) => p - 1)} disabled={page <= 1 || loading} aria-label="Previous page">
                <ChevronLeft aria-hidden />
              </Button>
              <span className="tabular-nums">
                Page {page} of {data.pages}
              </span>
              <Button size="sm" onClick={() => setPage((p) => p + 1)} disabled={page >= data.pages || loading} aria-label="Next page">
                <ChevronRight aria-hidden />
              </Button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={toDelete !== null}
        title={toDelete && toDelete.length > 1 ? `Delete ${toDelete.length} products?` : "Delete this product?"}
        description="Deleted products are removed from the website and the menu, along with their images and catalogues. This can't be undone."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="py-3 pl-4">
        <div className="h-4 w-4 rounded bg-[#E9EEEC]" />
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-3">
          <div className="h-11 w-16 rounded bg-[#E9EEEC]" />
          <div className="space-y-2">
            <div className="h-3.5 w-56 rounded bg-[#E9EEEC]" />
            <div className="h-3 w-40 rounded bg-[#F0F3F2]" />
          </div>
        </div>
      </td>
      <td className="hidden px-3 py-3 sm:table-cell">
        <div className="h-5 w-20 rounded-full bg-[#E9EEEC]" />
      </td>
      <td className="hidden px-3 py-3 md:table-cell">
        <div className="h-3.5 w-6 rounded bg-[#F0F3F2]" />
      </td>
      <td className="hidden px-3 py-3 md:table-cell">
        <div className="h-3.5 w-10 rounded bg-[#F0F3F2]" />
      </td>
      <td className="hidden px-3 py-3 lg:table-cell">
        <div className="h-3.5 w-20 rounded bg-[#F0F3F2]" />
      </td>
      <td className="hidden py-3 pr-4 sm:table-cell" />
    </tr>
  );
}
