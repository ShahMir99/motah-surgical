"use client";

import { useEffect, useState } from "react";
import type { HomeContentResponse } from "@/types/home";
import { homeApi } from "@/lib/apis/admin-api";
import { HomeForm } from "@/components/admin/home/HomeForm";
import { Button } from "@/components/admin/ui";

export default function HomePageEditor() {
  const [data, setData] = useState<HomeContentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    homeApi
      .get()
      .then((d) => active && setData(d))
      .catch((err: unknown) => active && setError(err instanceof Error ? err.message : "The home page couldn't be loaded."));
    return () => {
      active = false;
    };
  }, [attempt]);

  if (error) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="text-lg font-semibold">The home page couldn&apos;t be opened</h1>
        <p className="mt-2 text-sm text-[#5E716B]">{error}</p>
        <Button
          className="mt-6"
          onClick={() => {
            setError(null);
            setAttempt((n) => n + 1);
          }}
        >
          Try again
        </Button>
      </div>
    );
  }

  if (!data) {
    return (
      <div aria-busy="true" aria-label="Loading home page" className="animate-pulse">
        <div className="h-16 border-b border-[#DCE3E0] bg-white" />
        <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
          <div className="h-64 rounded-lg border border-[#DCE3E0] bg-white" />
          <div className="h-48 rounded-lg border border-[#DCE3E0] bg-white" />
        </div>
      </div>
    );
  }

  return <HomeForm initial={data} />;
}
