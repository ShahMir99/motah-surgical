"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { ExternalLink, LogOut, Menu, X } from "lucide-react";
import { adminNav } from "@/lib/admin-nav";
import { Brand } from "@/components/admin/Brand";

type Admin = { name: string; email: string };

export function AdminShell({ admin, children }: { admin: Admin; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  async function signOut() {
    setSigningOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } finally {
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <div className="min-h-dvh lg:pl-64">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[#DCE3E0] bg-white px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          className="grid h-9 w-9 place-items-center rounded-md text-[#10261F] hover:bg-[#EEF1F0]"
        >
          <Menu className="h-5 w-5" aria-hidden />
        </button>
        <Brand />
      </header>

      {open && <div className="fixed inset-0 z-40 bg-[#10261F]/40 lg:hidden" onClick={() => setOpen(false)} aria-hidden />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#10261F] text-white transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Admin"
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Brand tone="light" />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
            className="grid h-8 w-8 place-items-center rounded-md text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {adminNav.map(({ label, href, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18B27F] ${
                      active ? "bg-white/10 text-white" : "text-white/65 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {active && <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-[#18B27F]" aria-hidden />}
                    <Icon className="h-4 w-4" aria-hidden />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="space-y-1 border-t border-white/10 px-2 py-2">
        <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/65 hover:bg-white/5 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            View website
          </a>
          <button
            type="button"
            onClick={signOut}
            disabled={signingOut}
            className="flex w-full disabled:opacity-60 items-center gap-3 rounded-md px-3 py-2 text-sm text-white/65 hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
          <div className="mb-2 flex items-center gap-3 px-3 py-2">
            <span
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#18B27F] text-xs font-semibold text-[#062319]"
              aria-hidden
            >
              {initials(admin.name || admin.email)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{admin.name}</p>
              <p className="truncate text-xs text-white/55">{admin.email}</p>
            </div>
          </div>
          
        </div>
      </aside>

      <main>{children}</main>
    </div>
  );
}

function initials(value: string) {
  return value
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}
