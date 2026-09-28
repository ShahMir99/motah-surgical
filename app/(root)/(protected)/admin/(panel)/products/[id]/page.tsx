"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { ProductDTO } from "@/types/product";
import { productsApi } from "@/lib/apis/admin-api";
import { ProductForm } from "@/components/admin/products/ProductForm";
import { buttonClass } from "@/components/admin/ui";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    productsApi
      .get(id)
      .then((p) => active && setProduct(p))
      .catch((err: unknown) => active && setError(err instanceof Error ? err.message : "The product couldn't be loaded."));
    return () => {
      active = false;
    };
  }, [id]);

  if (error) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="text-lg font-semibold">This product couldn&apos;t be opened</h1>
        <p className="mt-2 text-sm text-[#5E716B]">{error}</p>
        <Link href="/admin/products" className={buttonClass("secondary", "md", "mt-6")}>
          Back to products
        </Link>
      </div>
    );
  }

  if (!product) return <EditorSkeleton />;

  return <ProductForm key={product._id} initial={product} />;
}

function EditorSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading product">
      <div className="h-16 border-b border-[#DCE3E0] bg-white" />
      <div className="mx-auto grid max-w-7xl animate-pulse grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-10 lg:py-8">
        <div className="space-y-6">
          <div className="h-72 rounded-lg border border-[#DCE3E0] bg-white p-12">
            <div className="h-9 w-1/2 rounded bg-[#E9EEEC]" />
            <div className="mt-10 h-10 rounded bg-[#EEF2F0]" />
            <div className="mt-6 h-20 rounded bg-[#EEF2F0]" />
          </div>
          <div className="h-80 rounded-lg border border-[#DCE3E0] bg-white" />
        </div>
        <div className="space-y-4">
          <div className="h-72 rounded-lg border border-[#DCE3E0] bg-white" />
          <div className="h-56 rounded-lg border border-[#DCE3E0] bg-white" />
        </div>
      </div>
    </div>
  );
}
