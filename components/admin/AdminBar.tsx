"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { Gauge, LogOut, Plus } from "lucide-react";

type Admin = { name: string; email: string };

export function AdminBar() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/auth/me", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: { user: Admin | null }) => !cancelled && setAdmin(data.user ?? null))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);


  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("has-admin-bar", Boolean(admin));
    return () => html.classList.remove("has-admin-bar");
  }, [admin]);

  async function signOut() {
    setSigningOut(true);
    await fetch("/api/admin/auth/logout", { method: "POST" }).catch(() => {});
    setAdmin(null);
    setSigningOut(false);
  }

  if (!admin) return null;

  return (
    <>
      <style>{`
        html.has-admin-bar { --admin-bar-height: 32px; margin-top: 32px; }
        @media (max-width: 782px) { html.has-admin-bar { --admin-bar-height: 46px; margin-top: 46px; } }
      `}</style>

      <div
        role="navigation"
        aria-label="Admin toolbar"
        className="fixed inset-x-0 top-0 z-[900] flex h-[66px] items-stretch justify-between bg-[#1d2327] text-[13px] leading-none text-[#f0f0f1] md:h-8"
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif' }}
      >
        <div className="flex items-stretch">
          <BarLink href="/admin/blogs" icon={<Gauge className="h-[18px] w-[18px]" aria-hidden />} label="Dashboard" />
        </div>

        <div className="flex items-stretch">
          <span className="hidden items-center px-2.5 md:flex">
            Howdy, <span className="ml-1 font-semibold">{admin.name}</span>
          </span>
          <button
            type="button"
            onClick={signOut}
            disabled={signingOut}
            className="flex items-center gap-1.5 px-3 text-[#f0f0f1] transition-colors hover:bg-[#2c3338] hover:text-[#72aee6] focus-visible:bg-[#2c3338] focus-visible:text-[#72aee6] focus-visible:outline-none disabled:opacity-60 md:px-2.5"
          >
            <LogOut className="h-[18px] w-[18px] md:h-4 md:w-4" aria-hidden />
            <span className="hidden md:inline">{signingOut ? "Logging out…" : "Log out"}</span>
            <span className="sr-only md:hidden">Log out</span>
          </button>
        </div>
      </div>
    </>
  );
}

function BarLink({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-1.5 px-3 text-[#f0f0f1] transition-colors hover:bg-[#2c3338] hover:text-[#72aee6] focus-visible:bg-[#2c3338] focus-visible:text-[#72aee6] focus-visible:outline-none md:px-2.5"
    >
      <span className="text-[#a7aaad] group-hover:text-[#72aee6] group-focus-visible:text-[#72aee6]">{icon}</span>
      <span className="hidden md:inline">{label}</span>
      <span className="sr-only md:hidden">{label}</span>
    </Link>
  );
}