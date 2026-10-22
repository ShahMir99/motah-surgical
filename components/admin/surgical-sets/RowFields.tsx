"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, ClipboardPaste, Plus, Trash2 } from "lucide-react";

import type { SurgicalSetFaq, SurgicalSetItem, SurgicalSetSpec } from "@/types/surgical-set";
import { Button, inputClass } from "@/components/admin/ui";

const iconButton =
  "grid h-8 w-8 shrink-0 place-items-center rounded-md text-[#5E716B] transition-colors hover:bg-[#E9EFED] hover:text-[#10261F] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18B27F]/60 [&_svg]:h-4 [&_svg]:w-4";

/** Shared chrome for a repeatable row: number, fields, reorder and remove. */
function Row({
  index,
  total,
  onMove,
  onRemove,
  removeLabel,
  children,
}: {
  index: number;
  total: number;
  onMove: (from: number, to: number) => void;
  onRemove: (index: number) => void;
  removeLabel: string;
  children: ReactNode;
}) {
  return (
    <li className="flex items-start gap-2 rounded-md border border-[#E3EAE7] bg-[#FBFCFC] p-2">
      <span className="mt-2.5 w-6 shrink-0 text-center text-xs font-semibold tabular-nums text-[#8A9A95]">
        {index + 1}
      </span>

      <div className="min-w-0 flex-1">{children}</div>

      <div className="flex shrink-0 flex-col">
        <button
          type="button"
          className={iconButton}
          onClick={() => onMove(index, index - 1)}
          disabled={index === 0}
          aria-label={`Move ${removeLabel} up`}
          title="Move up"
        >
          <ChevronUp aria-hidden />
        </button>
        <button
          type="button"
          className={iconButton}
          onClick={() => onMove(index, index + 1)}
          disabled={index === total - 1}
          aria-label={`Move ${removeLabel} down`}
          title="Move down"
        >
          <ChevronDown aria-hidden />
        </button>
      </div>

      <button
        type="button"
        className={`${iconButton} mt-0.5 hover:bg-[#FDF0EE] hover:text-[#B42318]`}
        onClick={() => onRemove(index)}
        aria-label={`Remove ${removeLabel}`}
        title="Remove"
      >
        <Trash2 aria-hidden />
      </button>
    </li>
  );
}

/** Moves a row, returning a new array. Out-of-range targets are ignored. */
function move<T>(rows: T[], from: number, to: number) {
  if (to < 0 || to >= rows.length) return rows;
  const next = [...rows];
  const [row] = next.splice(from, 1);
  next.splice(to, 0, row);
  return next;
}

function EmptyHint({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-md border border-dashed border-[#D9E3DF] bg-[#FAFCFB] px-4 py-6 text-center text-sm text-[#5E716B]">
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* The set list: instrument name + quantity                            */
/* ------------------------------------------------------------------ */

/**
 * Turns a pasted list into rows. One instrument per line; the quantity is
 * whatever follows a tab, a pipe, or two or more spaces — so a list copied
 * out of Word or a spreadsheet comes in whole.
 */
function parsePastedItems(text: string): SurgicalSetItem[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      // Drop a leading "1." / "12)" numbering from the source list.
      const body = line.replace(/^\d+\s*[.)\]]\s*/, "");
      const split = body.match(/^(.*?)(?:\t+|\s*\|\s*|\s{2,})(\S.*)$/);
      if (split) return { name: split[1].trim(), quantity: split[2].trim() };

      // Otherwise take a trailing "2 pcs" / "1 pair" style quantity.
      const trailing = body.match(/^(.*\S)\s+(\d+\s*(?:x|pcs?|pieces?|pairs?|sets?|nos?\.?)?)$/i);
      if (trailing) return { name: trailing[1].trim(), quantity: trailing[2].trim() };

      return { name: body, quantity: "" };
    })
    .filter((item) => item.name);
}

export function SetItemsField({
  value,
  onChange,
}: {
  value: SurgicalSetItem[];
  onChange: (items: SurgicalSetItem[]) => void;
}) {
  const [pasting, setPasting] = useState(false);
  const [draft, setDraft] = useState("");

  function update(index: number, patch: Partial<SurgicalSetItem>) {
    onChange(value.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function applyPaste() {
    const parsed = parsePastedItems(draft);
    if (parsed.length) onChange([...value, ...parsed]);
    setDraft("");
    setPasting(false);
  }

  return (
    <div className="space-y-3">
      {value.length === 0 && !pasting && (
        <EmptyHint>
          No instruments yet. Add them one by one, or paste the whole list from your catalogue.
        </EmptyHint>
      )}

      {value.length > 0 && (
        <ul className="space-y-2">
          {value.map((item, index) => (
            <Row
              key={index}
              index={index}
              total={value.length}
              onMove={(from, to) => onChange(move(value, from, to))}
              onRemove={(i) => onChange(value.filter((_, n) => n !== i))}
              removeLabel={item.name || `row ${index + 1}`}
            >
              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_120px]">
                <input
                  value={item.name}
                  onChange={(e) => update(index, { name: e.target.value })}
                  placeholder="Instrument name, e.g. Mayo Dissecting Scissors Curved 6 3/4”"
                  aria-label={`Instrument ${index + 1} name`}
                  className={inputClass}
                />
                <input
                  value={item.quantity}
                  onChange={(e) => update(index, { quantity: e.target.value })}
                  placeholder="2 pcs"
                  aria-label={`Instrument ${index + 1} quantity`}
                  className={inputClass}
                />
              </div>
            </Row>
          ))}
        </ul>
      )}

      {pasting ? (
        <div className="rounded-md border border-[#CBD6D2] bg-white p-3">
          <label htmlFor="paste-items" className="text-sm font-medium text-[#10261F]">
            Paste the instrument list
          </label>
          <p className="mt-1 text-xs leading-relaxed text-[#5E716B]">
            One instrument per line. Put the quantity after a tab, a <code>|</code>, or two spaces — for example
            <br />
            <span className="text-[#3E534C]">Foerster Sponge Forceps Straight 9 1/2” | 2 pcs</span>
          </p>
          <textarea
            id="paste-items"
            rows={8}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className={`${inputClass} mt-2 resize-y font-mono text-xs`}
            placeholder={"Foerster Sponge Forceps Straight 9 1/2”\t2 pcs\nAllis Tissue Forceps 5x6 Teeth\t2 pcs"}
          />
          <div className="mt-3 flex gap-2">
            <Button variant="primary" size="sm" onClick={applyPaste} disabled={!draft.trim()}>
              Add {parsePastedItems(draft).length || ""} rows
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setDraft("");
                setPasting(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => onChange([...value, { name: "", quantity: "" }])}>
            <Plus aria-hidden />
            Add instrument
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setPasting(true)}>
            <ClipboardPaste aria-hidden />
            Paste list
          </Button>
          {value.length > 0 && (
            <span className="self-center text-xs tabular-nums text-[#5E716B]">
              {value.length} {value.length === 1 ? "instrument" : "instruments"}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Technical specifications: label + value                             */
/* ------------------------------------------------------------------ */

export function SpecificationsField({
  value,
  onChange,
}: {
  value: SurgicalSetSpec[];
  onChange: (specs: SurgicalSetSpec[]) => void;
}) {
  function update(index: number, patch: Partial<SurgicalSetSpec>) {
    onChange(value.map((spec, i) => (i === index ? { ...spec, ...patch } : spec)));
  }

  return (
    <div className="space-y-3">
      {value.length === 0 && (
        <EmptyHint>No specifications yet. Leave this empty to hide the tab on the website.</EmptyHint>
      )}

      {value.length > 0 && (
        <ul className="space-y-2">
          {value.map((spec, index) => (
            <Row
              key={index}
              index={index}
              total={value.length}
              onMove={(from, to) => onChange(move(value, from, to))}
              onRemove={(i) => onChange(value.filter((_, n) => n !== i))}
              removeLabel={spec.label || `row ${index + 1}`}
            >
              <div className="grid gap-2 sm:grid-cols-[180px_minmax(0,1fr)]">
                <input
                  value={spec.label}
                  onChange={(e) => update(index, { label: e.target.value })}
                  placeholder="Material"
                  aria-label={`Specification ${index + 1} label`}
                  className={inputClass}
                />
                <input
                  value={spec.value}
                  onChange={(e) => update(index, { value: e.target.value })}
                  placeholder="German surgical stainless steel, satin finish"
                  aria-label={`Specification ${index + 1} value`}
                  className={inputClass}
                />
              </div>
            </Row>
          ))}
        </ul>
      )}

      <Button size="sm" onClick={() => onChange([...value, { label: "", value: "" }])}>
        <Plus aria-hidden />
        Add specification
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FAQs: question + answer                                             */
/* ------------------------------------------------------------------ */

export function FaqsField({
  value,
  onChange,
}: {
  value: SurgicalSetFaq[];
  onChange: (faqs: SurgicalSetFaq[]) => void;
}) {
  function update(index: number, patch: Partial<SurgicalSetFaq>) {
    onChange(value.map((faq, i) => (i === index ? { ...faq, ...patch } : faq)));
  }

  return (
    <div className="space-y-3">
      {value.length === 0 && <EmptyHint>No FAQs yet. Leave this empty to hide the tab on the website.</EmptyHint>}

      {value.length > 0 && (
        <ul className="space-y-2">
          {value.map((faq, index) => (
            <Row
              key={index}
              index={index}
              total={value.length}
              onMove={(from, to) => onChange(move(value, from, to))}
              onRemove={(i) => onChange(value.filter((_, n) => n !== i))}
              removeLabel={faq.question || `row ${index + 1}`}
            >
              <div className="space-y-2">
                <input
                  value={faq.question}
                  onChange={(e) => update(index, { question: e.target.value })}
                  placeholder="Is this set autoclavable?"
                  aria-label={`Question ${index + 1}`}
                  className={inputClass}
                />
                <textarea
                  rows={3}
                  value={faq.answer}
                  onChange={(e) => update(index, { answer: e.target.value })}
                  placeholder="Answer shown when the question is opened."
                  aria-label={`Answer ${index + 1}`}
                  className={`${inputClass} resize-y`}
                />
              </div>
            </Row>
          ))}
        </ul>
      )}

      <Button size="sm" onClick={() => onChange([...value, { question: "", answer: "" }])}>
        <Plus aria-hidden />
        Add FAQ
      </Button>
    </div>
  );
}
