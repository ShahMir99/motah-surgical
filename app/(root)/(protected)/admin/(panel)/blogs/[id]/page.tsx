"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { BlogDTO } from "@/types/blog";
import { blogsApi } from "@/lib/apis/admin-api";
import { BlogForm } from "@/components/admin/blogs/BlogForm";
import { buttonClass } from "@/components/admin/ui";

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<BlogDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    blogsApi
      .get(id)
      .then((b) => active && setBlog(b))
      .catch((err: unknown) => active && setError(err instanceof Error ? err.message : "The post couldn't be loaded."));
    return () => {
      active = false;
    };
  }, [id]);

  if (error) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="text-lg font-semibold">This post couldn&apos;t be opened</h1>
        <p className="mt-2 text-sm text-[#5E716B]">{error}</p>
        <Link href="/admin/blogs" className={buttonClass("secondary", "md", "mt-6")}>
          Back to blogs
        </Link>
      </div>
    );
  }

  if (!blog) return <EditorSkeleton />;

  return <BlogForm key={blog._id} initial={blog} />;
}

function EditorSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading post">
      <div className="h-16 border-b border-[#DCE3E0] bg-white" />
      <div className="mx-auto grid max-w-7xl animate-pulse grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-10 lg:py-8">
        <div className="h-[560px] rounded-lg border border-[#DCE3E0] bg-white p-12">
          <div className="h-9 w-2/3 rounded bg-[#E9EEEC]" />
          <div className="mt-12 space-y-3">
            {[100, 95, 88, 97, 60].map((w, i) => (
              <div key={i} className="h-4 rounded bg-[#EEF2F0]" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-72 rounded-lg border border-[#DCE3E0] bg-white" />
          <div className="h-48 rounded-lg border border-[#DCE3E0] bg-white" />
        </div>
      </div>
    </div>
  );
}
