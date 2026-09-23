import type { BlogStatus } from "@/types/blog";

export function StatusBadge({ status }: { status: BlogStatus }) {
  const published = status === "published";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        published ? "bg-[#E1F5EC] text-[#0B6A4B]" : "bg-[#EEF1F0] text-[#4A5D57]"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${published ? "bg-[#18B27F]" : "bg-[#9AAAA5]"}`} aria-hidden />
      {published ? "Published" : "Draft"}
    </span>
  );
}
