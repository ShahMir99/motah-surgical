"use client";

import type { ReactNode } from "react";
import { Plus, X } from "lucide-react";
import { Button, CharCount, Field, inputClass } from "@/components/admin/ui";

export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-[#DCE3E0] bg-white shadow-[0_1px_2px_rgba(16,38,31,0.05)]">
      <div className="border-b border-[#E6ECEA] px-6 py-4">
        <h2 className="text-base font-semibold text-[#10261F]">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-[#5E716B]">{description}</p>}
      </div>
      <div className="space-y-5 px-6 py-6">{children}</div>
    </section>
  );
}

export function TextField({
  id,
  label,
  value,
  onChange,
  max,
  hint,
  multiline,
  rows = 4,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  max: number;
  hint?: ReactNode;
  multiline?: boolean;
  rows?: number;
}) {
  return (
    <Field label={label} htmlFor={id} hint={hint} aside={<CharCount value={value} max={max} />}>
      {multiline ? (
        <textarea id={id} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />
      ) : (
        <input id={id} value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />
      )}
    </Field>
  );
}

/** A list of text boxes the admin can add to and remove from. */
export function TextListField({
  idPrefix,
  label,
  items,
  onChange,
  max,
  maxItems,
  multiline,
  hint,
  addLabel = "Add",
}: {
  idPrefix: string;
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  max: number;
  maxItems: number;
  multiline?: boolean;
  hint?: ReactNode;
  addLabel?: string;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <TextField
              id={`${idPrefix}-${i}`}
              label={`${label} ${i + 1}`}
              value={item}
              max={max}
              multiline={multiline}
              hint={i === 0 ? hint : undefined}
              onChange={(v) => onChange(items.map((x, j) => (j === i ? v : x)))}
            />
          </div>
          <Button
            variant="ghost"
            className="mt-7"
            aria-label={`Remove ${label.toLowerCase()} ${i + 1}`}
            onClick={() => onChange(items.filter((_, j) => j !== i))}
          >
            <X />
          </Button>
        </div>
      ))}
      {items.length < maxItems && (
        <Button size="sm" onClick={() => onChange([...items, ""])}>
          <Plus /> {addLabel}
        </Button>
      )}
    </div>
  );
}

export const LINK_HINT = "A page like /products, or a full https:// link.";
export const BOLD_HINT = "Put **two asterisks** around words to make them bold. A new line becomes a line break.";
