import { cache } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import BlogPost from "@/components/shared/BlogPost";
import ReadingProgress from "@/components/ReadingProgress";
import Reveal from "@/components/Reveal";
import ShareButtons from "@/components/ShareButtons";
import { getPublishedBlog, getPublishedBlogs } from "@/lib/apis/blog-queries";
import { formatBlogDate } from "@/lib/blog-format";
import type { BlogDTO, BlogListItem } from "@/types/blog";

import fallbackImage from "@/assets/blogs/featured-blog.png";

export const revalidate = 60;

type PageProps = { params: Promise<{ slug: string }> };

const getBlog = cache((slug: string) =>
  getPublishedBlog(decodeURIComponent(slug)),
);

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) return { title: "Article not found" };

  const title = blog.seo?.metaTitle || blog.title;
  const description = blog.seo?.metaDescription || blog.excerpt || undefined;
  const image = blog.coverImage?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: blog.publishedAt ?? undefined,
      authors: blog.author ? [blog.author] : undefined,
      images: image
        ? [{ url: image, alt: blog.coverImage?.alt || blog.title }]
        : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

/** Up to 3 other posts: same category first, then the latest. */
async function getRelated(blog: BlogDTO): Promise<BlogListItem[]> {
  const [sameCategory, latest] = await Promise.all([
    blog.category
      ? getPublishedBlogs({ limit: 4, category: blog.category })
      : null,
    getPublishedBlogs({ limit: 4 }),
  ]);

  const seen = new Set([blog.slug]);
  const related: BlogListItem[] = [];
  for (const item of [...(sameCategory?.items ?? []), ...latest.items]) {
    if (seen.has(item.slug)) continue;
    seen.add(item.slug);
    related.push(item);
  }
  return related.slice(0, 3);
}

// Styles for the HTML that comes out of the admin editor (Tiptap)
const articleBody = [
  "text-[17px] md:text-[18px] leading-[1.85] text-[#4A5560]",
  "[&_p]:my-5",
  "[&_h1]:mt-12 [&_h1]:mb-4 [&_h1]:text-[28px] md:[&_h1]:text-[32px] [&_h1]:font-bold [&_h1]:leading-[1.3] [&_h1]:text-[#1E2A33]",
  "[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-[26px] md:[&_h2]:text-[30px] [&_h2]:font-bold [&_h2]:leading-[1.3] [&_h2]:text-[#1E2A33]",
  "[&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:text-[21px] md:[&_h3]:text-[23px] [&_h3]:font-bold [&_h3]:leading-[1.35] [&_h3]:text-[#1E2A33]",
  "[&_strong]:font-semibold [&_strong]:text-[#1E2A33]",
  "[&_a]:font-medium [&_a]:text-[#18B27F] [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-[#128F66]",
  "[&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6",
  "[&_li]:my-2 [&_li]:pl-1 [&_li]:marker:text-[#18B27F] [&_li>p]:my-0",
  "[&_blockquote]:my-8 [&_blockquote]:border-l-4 [&_blockquote]:border-[#18B27F] [&_blockquote]:bg-[#F3FAF7] [&_blockquote]:py-4 [&_blockquote]:pl-6 [&_blockquote]:pr-4 [&_blockquote]:text-[19px] [&_blockquote]:italic [&_blockquote]:text-[#1E2A33] [&_blockquote>p]:my-0",
  "[&_img]:my-8 [&_img]:h-auto [&_img]:w-full [&_img]:rounded-xl",
  "[&_hr]:my-12 [&_hr]:border-[#E3EEEA]",
  "[&_code]:rounded [&_code]:bg-[#F3FAF7] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[15px]",
].join(" ");

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) notFound();

  const related = await getRelated(blog);
  const date = formatBlogDate(blog.publishedAt ?? blog.createdAt);
  const cover = blog.coverImage?.url || fallbackImage;

  return (
    <main className="bg-white text-[#4A5560]">
      {/* HERO: same split as the blogs page */}
      <div className="grid grid-cols-1 md:grid-cols-[48%_52%] max-w-[1250px] mx-auto md:min-h-[560px]">
        <Reveal className="bg-[#18B27F] text-white flex flex-col justify-center gap-7 px-7 py-12 md:px-12 md:py-16">
          <Link
            href="/blogs"
            className="inline-flex w-fit items-center gap-2 text-[15px] font-semibold text-white/85 transition-colors hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            All blogs
          </Link>

          {blog.category && (
            <span className="w-fit rounded-full bg-white/15 px-4 py-1.5 text-[14px] font-semibold">
              {blog.category}
            </span>
          )}

          <h1 className="text-[30px] md:text-[44px] font-bold leading-[1.2]">
            {blog.title}
          </h1>

          <dl className="flex flex-wrap gap-x-8 gap-y-3 border-t border-white/25 pt-6 text-[15px]">
            {blog.author && (
              <div>
                <dt className="text-white/70">Written by</dt>
                <dd className="font-semibold">{blog.author}</dd>
              </div>
            )}
            {date && (
              <div>
                <dt className="text-white/70">Published</dt>
                <dd className="font-semibold">
                  <time dateTime={blog.publishedAt ?? blog.createdAt}>
                    {date}
                  </time>
                </dd>
              </div>
            )}
            <div>
              <dt className="text-white/70">Reading time</dt>
              <dd className="font-semibold">{blog.readingTime || 1} min</dd>
            </div>
          </dl>
        </Reveal>

        <div className="relative min-h-[260px] sm:min-h-[340px] md:min-h-0 bg-[#E8F1EE]">
          <Image
            src={cover}
            alt={blog.coverImage?.alt || blog.title}
            fill
            priority
            sizes="(min-width: 1250px) 650px, (min-width: 768px) 52vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <ReadingProgress>
        <article className="px-6 pt-14 pb-20 md:pt-20">
          <div className="mx-auto max-w-[740px]">
            {blog.excerpt && (
              <p className="mb-10 border-l-4 border-[#18B27F] pl-5 text-[20px] md:text-[22px] leading-[1.6] font-medium text-[#1E2A33]">
                {blog.excerpt}
              </p>
            )}

            <div
              className={articleBody}
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            <div className="mt-14 flex flex-col gap-6 border-t border-[#E3EEEA] pt-8">
              {blog.tags?.length > 0 && (
                <ul className="flex flex-wrap gap-2" aria-label="Tags">
                  {blog.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full bg-[#F3FAF7] px-4 py-1.5 text-[14px] font-medium text-[#18B27F]"
                    >
                      #{tag}
                    </li>
                  ))}
                </ul>
              )}
              <ShareButtons title={blog.title} />
            </div>
          </div>
        </article>
      </ReadingProgress>

      {related.length > 0 && (
        <section className="bg-[#F6FBF9]">
          <div className="max-w-[1320px] mx-auto px-6 py-20">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-[#18B27F] font-bold text-[32px] md:text-[42px] leading-[1.2]">
                Keep reading
              </h2>
              <Link
                href="/blogs"
                className="rounded-full border-2 border-[#18B27F] px-6 py-2.5 text-[15px] font-semibold text-[#18B27F] transition-colors hover:bg-[#18B27F] hover:text-white"
              >
                View all blogs
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {related.map((item) => (
                <Link
                  key={item._id}
                  href={`/blogs/${item.slug}`}
                  className="block"
                >
                  <BlogPost
                    title={item.title}
                    category={item.category}
                    date={formatBlogDate(item.publishedAt ?? item.createdAt)}
                    blogImage={item.coverImage?.url || fallbackImage.src}
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
