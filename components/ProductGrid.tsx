"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ImageIcon } from "lucide-react";

import type { ProductListItem } from "@/types/product";

const LABEL_COLOR = "#1C3350";

export default function ProductCategoriesGrid({ products }: { products: ProductListItem[] }) {
  if (!products.length) return null;

  return (
    <section className="bg-white pt-16">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
          {products.map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 5) * 0.04 }}
            >
              <Link
                href={`/products/${product.slug}`}
                className="group block h-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="relative aspect-[4/2] w-full overflow-hidden">
                  {product.image?.url ? (
                    <Image
                      src={product.image.url}
                      alt={product.image.alt || product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover p-2 transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-gray-100 text-gray-300">
                      <ImageIcon className="h-8 w-8" aria-hidden />
                    </div>
                  )}
                </div>
                <div className="px-4 py-4 text-center">
                  <span className="text-[16px] font-bold uppercase tracking-wide" style={{ color: LABEL_COLOR }}>
                    {product.name}
                    {product.badge ? ` (${product.badge})` : ""}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
