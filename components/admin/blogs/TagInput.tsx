"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function TagInput({
  id,
  value,
  onChange,
  max = 20,
}: {
  id: string;
  value: string[];
  onChange: (tags: string[]) => void;
  max?: number;
}) {
  const [draft, setDraft] = useState("");

  function add(raw: string) {
    const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);
    setDraft("");
    if (!parts.length) return;
    const next = [...value];
    for (const p of parts) {
      if (next.length >= max) break;
      if (!next.some((t) => t.toLowerCase() === p.toLowerCase())) next.push(p.slice(0, 40));
    }
    onChange(next);
  }

  return (
    <div className="flex flex-wrap gap-1.5 rounded-md border border-[#CBD6D2] bg-white p-1.5 transition-colors focus-within:border-[#18B27F] focus-within:ring-2 focus-within:ring-[#18B27F]/25">
      {value.map((tag) => (
        <span key={tag} className="inline-flex items-center gap-1 rounded bg-[#EAF2EF] py-0.5 pl-2 pr-1 text-sm text-[#10261F]">
          {tag}
          <button
            type="button"
            aria-label={`Remove tag ${tag}`}
            onClick={() => onChange(value.filter((t) => t !== tag))}
            className="grid h-5 w-5 place-items-center rounded text-[#5E716B] hover:bg-[#D5E2DD] hover:text-[#10261F]"
          >
            <X className="h-3 w-3" aria-hidden />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        onChange={(e) => (e.target.value.includes(",") ? add(e.target.value) : setDraft(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add(draft);
          } else if (e.key === "Backspace" && !draft && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={() => add(draft)}
        placeholder={value.length ? "" : "Type a tag, press Enter"}
        disabled={value.length >= max}
        className="min-w-[8rem] flex-1 border-0 bg-transparent px-1.5 py-1 text-sm text-[#10261F] placeholder:text-[#8A9A95] focus:outline-none focus:ring-0"
      />
    </div>
  );
}
