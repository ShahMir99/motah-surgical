"use client";

import { ChevronDown, Menu, Phone, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import logo from "@/assets/logo.jpeg";
import { cn } from "@/lib/utils";
import type { ProductMenuItem } from "@/types/product";

const aboutCategories = [
  { to: "/about/company-introduction", label: "Company Introduction" },
  { to: "/about/mission-vision", label: "Mission & Vision" },
  { to: "/about/compliance", label: "Compliance" },
  { to: "/about/faqs", label: "FAQs" },
  { to: "/about/downloads", label: "Downloads" },
] as const;

type MenuLink = { to: string; label: string };
type NavItem = { to: string; label: string; dropdown?: readonly MenuLink[] };

function buildNav(productCategories: readonly MenuLink[]): NavItem[] {
  return [
    { to: "/", label: "Home" },
    { to: "#", label: "About Us", dropdown: aboutCategories },
    // Filled from the database. With no products yet it's a plain link.
    {
      to: "/products",
      label: "Surgical Instruments",
      ...(productCategories.length ? { dropdown: productCategories } : {}),
    },
    { to: "/surgical-sets", label: "Surgical Sets" },
    { to: "/blogs", label: "News and Events" },
    { to: "/contact", label: "Contact" },
  ];
}

export default function Header({ products = [] }: { products?: ProductMenuItem[] }) {
  const nav = useMemo(
    () => buildNav(products.map((p) => ({ to: `/products/${p.slug}`, label: p.name }))),
    [products],
  );
  const [open, setOpen] = useState(false);
  const [mobileOpenKey, setMobileOpenKey] = useState<string | null>(null);
  const [desktopOpenKey, setDesktopOpenKey] = useState<string | null>(null);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      setIsScrolled((prev) => {
        if (window.scrollY >= 30) return true;
        if (window.scrollY <= 10) return false;
        return prev;
      });
      ticking = false;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-background px-5",
        isScrolled ? "border-b border-border/70 shadow-sm" : "",
      )}
    >
      <div
        className={cn(
          "container-page flex items-center justify-between gap-6 transition-all h-[105px] duration-100",
          isScrolled && "h-[105px]",
        )}
      > 
        <Link
          href="/"
          className="group flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <Image src={logo} alt="logo" width={300} height={300} />
        </Link>

        <nav className="hidden items-center gap-4 lg:flex">
          {nav.map((item) =>
            item.dropdown ? (
              <div
                key={item.to}
                className="relative"
                onMouseEnter={() => setDesktopOpenKey(item.to)}
                onMouseLeave={() =>
                  setDesktopOpenKey((prev) => (prev === item.to ? null : prev))
                }
              >
                <Link
                  href={item.to}
                  className="relative flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-primary after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                >
                  {item.label}
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      desktopOpenKey === item.to ? "rotate-180" : ""
                    }`}
                  />
                </Link>

                {desktopOpenKey === item.to && (
                  <div className="absolute left-0 top-[20px] w-72 overflow-hidden rounded-lg border border-border border-t-0 bg-background shadow-xl">
                    <ul className="max-h-[75vh] overflow-y-auto py-2">
                      {item.dropdown.map((sub) => (
                        <li key={sub.to}>
                          <Link
                            href={sub.to}
                            className="block border-b border-border/60 px-5 py-3 text-sm font-medium text-gray-500 transition-colors last:border-b-0 hover:bg-primary/5 hover:text-primary"
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
                className="relative text-sm font-[500] text-gray-500 transition-colors hover:text-primary after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden lg:block">
          <a
            href="tel:+966543000010"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            <Phone className="h-4 w-4" /> (+966) 54 300 0010
          </a>
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
              item.dropdown ? (
                <div key={item.to} className="border-b border-border/60">
                  <button
                    type="button"
                    onClick={() =>
                      setMobileOpenKey((prev) =>
                        prev === item.to ? null : item.to,
                      )
                    }
                    className="flex w-full items-center justify-between py-4 text-sm font-semibold text-ink-soft transition-colors hover:text-primary"
                  >
                    {item.label}
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-200 ${
                        mobileOpenKey === item.to ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {mobileOpenKey === item.to && (
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
              ),
            )}
            <a
              href="tel:+966543000010"
              className="mt-3 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              <Phone className="h-4 w-4" /> (+966) 54 300 0010
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
