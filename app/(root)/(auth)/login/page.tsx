"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Brand } from "@/components/admin/Brand";
import { Button, Field, PasswordInput, inputClass } from "@/components/admin/ui";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password, remember }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Couldn't sign you in. Try again.");

      router.replace(safeNext());
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't sign you in. Try again.");
      setPassword("");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-10 lg:hidden">
        <Brand />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight text-[#10261F]">Sign in</h1>
      <p className="mt-1.5 text-sm text-[#5E716B]">Use your admin account to manage the website.</p>

      <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
        {error && (
          <div role="alert" className="rounded-md border border-[#F3C9C3] bg-[#FDF3F1] px-3 py-2.5 text-sm text-[#912018]">
            {error}
          </div>
        )}

        <Field label="Email" htmlFor="email">
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className={`${inputClass} h-11`}
          />
        </Field>

        <Field label="Password" htmlFor="password">
          <PasswordInput id="password" value={password} onChange={setPassword} autoComplete="current-password" />
        </Field>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-[#3E534C]">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 cursor-pointer rounded accent-[#18B27F]"
          />
          Keep me signed in
        </label>

        <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
          Sign in
        </Button>
      </form>
    </div>
  );
}

function safeNext() {
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin/blogs";
}
