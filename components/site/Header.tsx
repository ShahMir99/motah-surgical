"use client"

import { ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import logo from "@/assets/logo.png"

const productCategories = [
  { to: "/products/general-surgery", label: "General Surgery" },
  { to: "/products/liposuction", label: "Liposuction" },
  { to: "/products/plastic-surgery", label: "Plastic Surgery" }
] as const;

const nav = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products", dropdown: productCategories },
  { to: "/about", label: "About Us" },
  { to: "/news", label: "News" },
  { to: "/blog", label: "Blog" },
] as const;

export default function Header() {
  const [open, setOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [desktopProductsOpen, setDesktopProductsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="container-page flex h-20 items-center justify-between gap-6">
        <Link href="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
          <Image src={logo} alt="logo" width={300} height={300} />
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {nav.map((item) =>
            "dropdown" in item ? (
              <div
                key={item.to}
                className="relative"
                onMouseEnter={() => setDesktopProductsOpen(true)}
                onMouseLeave={() => setDesktopProductsOpen(false)}
              >
                <Link
                  href={item.to}
                  className="relative flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-primary after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                >
                  {item.label}
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      desktopProductsOpen ? "rotate-180" : ""
                    }`}
                  />
                </Link>

                {desktopProductsOpen && (
                  <div className="absolute left-0 top-[20px] w-72 overflow-hidden rounded-lg border border-border border-t-0 bg-background shadow-xl">
                    <ul className="max-h-[70vh] overflow-y-auto py-2">
                      {item.dropdown.map((sub) => (
                        <li key={sub.to}>
                          <Link
                            href={sub.to}
                            className="block border-b border-border/60 px-5 py-3 text-sm font-medium text-ink-soft transition-colors last:border-b-0 hover:bg-primary/5 hover:text-primary"
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.to}
                href={item.to}
                className="relative text-sm font-[500] text-ink-soft transition-colors hover:text-primary after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden lg:block">
          <Link href="/contact" className="btn-base btn-primary">
            Request a quote
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-10 w-10 items-center justify-center text-ink lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="container-page flex flex-col py-4">
            {nav.map((item) =>
              "dropdown" in item ? (
                <div key={item.to} className="border-b border-border/60">
                  <button
                    type="button"
                    onClick={() => setMobileProductsOpen((v) => !v)}
                    className="flex w-full items-center justify-between py-4 text-sm font-semibold text-ink-soft transition-colors hover:text-primary"
                  >
                    {item.label}
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-200 ${
                        mobileProductsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {mobileProductsOpen && (
                    <ul className="pb-2">
                      {item.dropdown.map((sub) => (
                        <li key={sub.to}>
                          <Link
                            href={sub.to}
                            onClick={() => setOpen(false)}
                            className="block border-t border-border/40 py-3 pl-4 text-sm font-medium text-ink-soft transition-colors hover:text-primary"
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  key={item.to}
                  href={item.to}
                  onClick={() => setOpen(false)}
                  className="border-b border-border/60 py-4 text-sm font-semibold text-ink-soft transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              )
            )}
            <Link href="/contact" onClick={() => setOpen(false)} className="btn-base btn-primary mt-5">
              Request a quote
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}