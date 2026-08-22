"use client"

import { Phone, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import logo from "@/assets/logo.png";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Our Work" },
  { to: "/projects", label: "Products" },
  { to: "/certificates", label: "Certificates" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact Us" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-white ">
      <div className="flex h-20 items-center justify-between px-14">
        <Link href="/" className="flex items-center gap-2 font-display text-2xl font-extrabold tracking-tigh">
         <Image src={logo} alt="NSCC Logo" width={310} height={310} />
        </Link>
        <nav className="hidden items-center gap-5 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              href={n.to}
              className="text-[16px] font-medium text-foreground/80 transition-colors hover:text-secondary"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <a
          href="tel:+966541084450"
          className="hidden items-center gap-3 rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition-transform hover:scale-[1.02] md:flex"
        >
          (+966) 54 108 4450
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-accent-foreground">
            <Phone className="h-4 w-4 text-gray-700" />
          </span>
        </a>
        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-md text-primary lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-6 py-4">
            {nav.map((n) => (
              <Link
                key={n.to}
                href={n.to}
                onClick={() => setOpen(false)}
                className="py-2 text-sm font-semibold text-foreground/80"
              >
                {n.label}
              </Link>
            ))}
            <a href="tel:+966565111175" className="mt-3 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              <Phone className="h-4 w-4" /> (+966) 56 5111 175
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}