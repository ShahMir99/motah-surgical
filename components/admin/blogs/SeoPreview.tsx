const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://your-domain.com")
  .replace(/^https?:\/\//, "")
  .replace(/\/$/, "");

export function SeoPreview({ title, description, slug }: { title: string; description: string; slug: string }) {
  return (
    <div className="rounded-md border border-[#E6ECEA] bg-[#F8FAF9] p-3" aria-label="Search result preview">
      <p className="text-xs text-[#5E716B]">How it may look in Google</p>
      <p className="mt-2 truncate text-xs text-[#3E534C]">
        {site} › blog › {slug || "post-url"}
      </p>
      <p className="mt-0.5 line-clamp-1 text-[15px] leading-snug text-[#1A0DAB]">{title || "Post title"}</p>
      <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-[#4D5156]">
        {description || "Add an excerpt or meta description to control this text."}
      </p>
    </div>
  );
}
