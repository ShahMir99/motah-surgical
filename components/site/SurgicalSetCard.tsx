import Link from "next/link";
import { ImageIcon } from "lucide-react";

import type { SurgicalSetListItem } from "@/types/surgical-set";

/** The card used on /surgical-sets and in the "related sets" strip. */
export function SurgicalSetCard({ set }: { set: SurgicalSetListItem }) {
  return (
    <Link
      href={`/surgical-sets/${set.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-[#E3EAE7] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#18B27F]/50 hover:shadow-[0_22px_45px_-28px_rgba(16,38,31,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18B27F]/60 focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F5F8F7]">
        {set.image?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={set.image.url}
            alt={set.image.alt || set.name}
            loading="lazy"
            className="h-full w-full object-cover p-2 bg-white rounded-sm transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-[#9DB5AC]">
            <ImageIcon className="h-9 w-9" aria-hidden />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col border-t border-[#EDF2F0] px-4 py-4">
        {set.category && (
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#8A9A95]">{set.category}</p>
        )}
        <h3 className="mt-1.5 text-[15px] font-bold leading-snug text-[#10261F] transition-colors group-hover:text-[#18B27F]">
          {set.name}
        </h3>
      </div>
    </Link>
  );
}
