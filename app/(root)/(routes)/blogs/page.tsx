"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import BlogPost from "@/components/shared/BlogPost";
import { formatBlogDate } from "@/lib/blog-format";
import type { BlogListItem } from "@/types/blog";

import fallbackImage from "@/assets/blogs/featured-blog.png";

const PAGE_SIZE = 13;

type BlogsResponse = {
  items: BlogListItem[];
  total: number;
  page: number;
  pages: number;
};

async function fetchBlogs(page: number): Promise<BlogsResponse> {
  const res = await fetch(`/api/blogs?page=${page}&limit=${PAGE_SIZE}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load blogs (${res.status})`);
  return res.json();
}

const blogHref = (blog: BlogListItem) => `/blogs/${blog.slug}`;
const blogImage = (blog: BlogListItem) => blog.coverImage?.url || fallbackImage.src;
const blogDate = (blog: BlogListItem) => formatBlogDate(blog.publishedAt ?? blog.createdAt);

function BlogPostSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden>
      <div className="aspect-[16/10] w-full rounded-lg bg-[#E8F1EE]" />
      <div className="mt-4 h-4 w-1/3 rounded bg-[#E8F1EE]" />
      <div className="mt-3 h-5 w-5/6 rounded bg-[#E8F1EE]" />
      <div className="mt-2 h-5 w-2/3 rounded bg-[#E8F1EE]" />
    </div>
  );
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogListItem[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [loadingMore, setLoadingMore] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    fetchBlogs(1)
      .then((data) => {
        if (cancelled) return;
        setBlogs(data.items);
        setPage(1);
        setPages(data.pages);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const next = page + 1;
      const data = await fetchBlogs(next);
      setBlogs((prev) => {
        const seen = new Set(prev.map((b) => b._id));
        return [...prev, ...data.items.filter((b) => !seen.has(b._id))];
      });
      setPage(next);
      setPages(data.pages);
    } catch {
      // keep what's already on screen; the button stays so they can try again
    } finally {
      setLoadingMore(false);
    }
  }

  // API returns newest first: the latest post is featured, the rest follow
  const featured = blogs[0];
  const rest = blogs.slice(1);

  return (
    <main className="bg-white text-[#4A5560]">
      {/* HERO */}
      <div className="grid grid-cols-1 md:grid-cols-[48%_52%] max-w-[1250px] mx-auto min-h-[620px]">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-[#18B27F] text-white flex flex-col justify-center gap-8 px-7 py-14 md:px-12 md:py-14"
        >
          <span className="text-[23px] font-bold tracking-[2px]">BLOGS</span>

          <h1 className="font-light text-[28px]  md:text-[55px] leading-[1.35] pt-14 pb-20">
            News, Insights, and Industry Events :  
            <span className="text-[45px] font-bold tracking-[2px]">
               Dive into our Inspiring Blog
            </span>
          </h1>
        </motion.div>

        <div className="order-first flex-col md:order-last gap-5 flex pl-16 justify-center overflow-hidden min-h-[320px]">
          <h1 className="font-bold text-[28px] md:text-[42px] text-primary leading-[1.25]">
            Featured News &amp; Insights
          </h1>

          {status === "loading" && <BlogPostSkeleton />}

          {status === "ready" && featured && (
            <Link href={blogHref(featured)} className="block">
              <BlogPost
                title={featured.title}
                category={featured.category}
                date={blogDate(featured)}
                blogImage={blogImage(featured)}
              />
            </Link>
          )}

          {status === "ready" && !featured && (
            <p className="text-[17px]">New articles are on the way. Check back soon.</p>
          )}

          {status === "error" && (
            <p className="text-[17px]">
              Blogs couldn&apos;t load.{" "}
              <button
                type="button"
                onClick={() => setReloadKey((k) => k + 1)}
                className="font-semibold text-[#18B27F] underline underline-offset-4"
              >
                Try again
              </button>
            </p>
          )}
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-6 pb-28">
        {/* LIST */}
        <section className="pt-14">
          <h2 className="text-[#18B27F] font-bold text-[42px] mb-5">Blogs</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
            {status === "loading" &&
              Array.from({ length: 4 }).map((_, i) => <BlogPostSkeleton key={i} />)}

            {status === "ready" &&
              rest.map((blog) => (
                <Link key={blog._id} href={blogHref(blog)} className="block">
                  <BlogPost
                    title={blog.title}
                    category={blog.category}
                    date={blogDate(blog)}
                    blogImage={blogImage(blog)}
                  />
                </Link>
              ))}
          </div>

          {status === "ready" && featured && rest.length === 0 && (
            <p className="text-[17px]">More articles are coming soon.</p>
          )}

          {status === "ready" && page < pages && (
            <div className="mt-12 flex justify-center">
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="rounded-full border-2 border-[#18B27F] px-8 py-3 font-semibold text-[#18B27F] transition-colors hover:bg-[#18B27F] hover:text-white disabled:opacity-60"
              >
                {loadingMore ? "Loading…" : "Load more articles"}
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}