import type { Metadata } from "next";
import Link from "next/link";
import { Download, ImageIcon } from "lucide-react";

import { getPublishedProducts } from "@/lib/apis/product-queries";
import type { ProductListItem } from "@/types/product";

export const metadata: Metadata = {
  title: "Surgical Instruments | Motah Surgical",
  description:
    "Browse Motah Surgical's precision instrument ranges for general surgery, orthopedics, ENT, neurosurgery and more.",
};

// Admin changes refresh this page right away; this is a fallback interval.
export const revalidate = 60;

function Hero() {
  return (
    <section className="relative">
      <img
        src="https://placehold.co/1600x520/16303d/16303d?text=+"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-primary-dark" />

      <div className="relative mx-auto flex max-w-6xl flex-col lg:h-[360px] lg:flex-row">
        <div className="relative flex w-full h-[440px] flex-col justify-center bg-[#02ac75] px-8 py-14 lg:w-[510px] lg:shrink-0 lg:px-16 lg:py-0">
          <p className="mb-4 text-xl font-bold tracking-[0.3em] text-white">
            Surgical Instruments
          </p>
          <h1 className="text-3xl font-light leading-tight text-white lg:text-[2.8rem]">
            High-Precision <br className="hidden lg:block" />
            Instruments for{" "}
            <span className="font-bold">Engineered for Excellence</span>
          </h1>
          <button
            type="button"
            className="mt-8 w-fit rounded-xl bg-primary-dark px-6 py-3 text-base font-semibold tracking-wider text-white transition-colors hover:bg-[#0F2A38]"
          >
            DOWNLOAD CATALOGUE
          </button>
        </div>

        <div className="flex items-center px-8 py-10 lg:px-16 lg:py-0">
          <p className="w-full text-lg leading-relaxed text-white/90">
            Experience clinical excellence with Motah Surgical precision
            instruments. Our dedicated manufacturing and commitment to quality
            ensure dependable performance in every operating room. From scalpels
            and forceps to scissors and speculums, our expertly crafted tools
            deliver exceptional precision, safety, and durability. Elevate
            surgical outcomes across your institution with instruments designed
            for uncompromising performance.
          </p>
        </div>
      </div>
    </section>
  );
}

function ProductRow({
  product,
  imageOnLeft,
}: {
  product: ProductListItem;
  imageOnLeft: boolean;
}) {
  const href = `/products/${product.slug}`;
  return (
    <div
      className={`mx-auto flex max-w-7xl flex-col items-center gap-10 px-6 py-14 lg:gap-20 lg:px-10 lg:py-12 ${
        imageOnLeft ? "lg:flex-row-reverse" : "lg:flex-row"
      }`}
    >
      <div className="w-full lg:w-1/2">
        <h3 className="mb-5 text-4xl font-bold text-[#02ac75] lg:text-4xl">
          <Link href={href} className="hover:text-[#029764]">
            {product.name}
          </Link>
          {product.badge && (
            <span className="ml-2 text-xl font-semibold text-slate-400">
              ({product.badge})
            </span>
          )}
        </h3>
        {product.summary && (
          <p className="mb-7 max-w-lg text-lg font-normal leading-relaxed text-slate-700 line-clamp-2">
            {product.summary}
          </p>
        )}
        <Link
          href={href}
          className="inline-block rounded-full bg-primary-dark px-7 py-3.5 text-xs font-bold tracking-wide text-white transition-colors hover:bg-[#0F2A38]"
        >
          VIEW PRODUCTS
        </Link>
      </div>

      <div className="w-full lg:w-1/2">
        <Link href={href} className="flex" tabIndex={-1} aria-hidden>
          <div className="flex flex-col">
            <div className="w-[20px] h-[88%] bg-primary" />
            <div className="w-[20px] h-[12%] bg-primary-dark" />
          </div>
          {product.image?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image.url}
              alt={product.image.alt || product.name}
              loading="lazy"
              className="h-96 w-full object-cover object-center lg:h-[370px]"
            />
          ) : (
            <div className="grid h-96 w-full place-items-center bg-[#EEF5F2] text-[#9DB5AC] lg:h-[370px]">
              <ImageIcon className="h-10 w-10" aria-hidden />
            </div>
          )}
        </Link>
      </div>
    </div>
  );
}

function ProductsSection({ products }: { products: ProductListItem[] }) {
  return (
    <section className="bg-white pt-32">
      <div className="mx-auto max-w-7xl px-6 pt-16 text-center lg:px-10">
        <h2 className="text-3xl font-light text-[#02ac75] lg:text-4xl">
          All Products
        </h2>
      </div>
      {products.length ? (
        <div className="mt-6 ">
          {products.map((product, index) => (
            <ProductRow
              key={product._id}
              product={product}
              imageOnLeft={index % 2 === 1}
            />
          ))}
        </div>
      ) : (
        <p className="mx-auto max-w-md px-6 py-24 text-center text-lg text-slate-500">
          Our product ranges are being updated. Please check back soon.
        </p>
      )}
    </section>
  );
}

function CtaBanner() {
  return (
    <section className="bg-primary-dark border-b border-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row lg:px-10">
        <p className="text-sm font-bold tracking-wide text-white">
          WANT TO KNOW MORE ABOUT PROFESSIONAL?
        </p>
        <button
          type="button"
          className="flex items-center gap-2 rounded bg-[#02ac75] px-5 py-2.5 text-xs font-bold tracking-wide text-white transition-colors hover:bg-[#029764]"
        >
          <Download className="h-4 w-4" /> DOWNLOAD CATALOGUE
        </button>
      </div>
    </section>
  );
}

export default async function ProductsPage() {
  const products = await getPublishedProducts().catch((err) => {
    console.error("[products] list couldn't be loaded", err);
    return [] as ProductListItem[];
  });

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <ProductsSection products={products} />
      <CtaBanner />
    </div>
  );
}
