"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

import { richTextBody } from "@/lib/rich-text";
import type { SurgicalSetFaq, SurgicalSetItem, SurgicalSetSpec } from "@/types/surgical-set";

type TabKey = "description" | "specifications" | "faqs";

const LABELS: Record<TabKey, string> = {
  description: "Description",
  specifications: "Technical Specifications",
  faqs: "FAQs",
};

export function SurgicalSetTabs({
  name,
  description,
  summary,
  items,
  specifications,
  faqs,
}: {
  name: string;
  description: string;
  summary: string;
  items: SurgicalSetItem[];
  specifications: SurgicalSetSpec[];
  faqs: SurgicalSetFaq[];
}) {
  const tabs: TabKey[] = ["description"];
  if (specifications.length) tabs.push("specifications");
  if (faqs.length) tabs.push("faqs");

  const [active, setActive] = useState<TabKey>("description");

  return (
    <div>
      <div role="tablist" aria-label={`${name} details`} className="flex flex-wrap gap-1 border-b border-[#E3EAE7]">
        {tabs.map((tab) => {
          const isActive = active === tab;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              id={`tab-${tab}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab}`}
              onClick={() => setActive(tab)}
              className={`-mb-px border-b-2 px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18B27F]/50 sm:px-7 sm:text-xs ${
                isActive
                  ? "border-[#18B27F] bg-[#F1FAF6] text-[#10261F]"
                  : "border-transparent text-[#6B7C76] hover:bg-[#F7FAF9] hover:text-[#10261F]"
              }`}
            >
              {LABELS[tab]}
            </button>
          );
        })}
      </div>

      <div className="pt-9">
        {active === "description" && (
          <div role="tabpanel" id="panel-description" aria-labelledby="tab-description">
            <DescriptionPanel name={name} description={description} summary={summary} items={items} />
          </div>
        )}

        {active === "specifications" && (
          <div role="tabpanel" id="panel-specifications" aria-labelledby="tab-specifications">
            <SpecificationsPanel specifications={specifications} />
          </div>
        )}

        {active === "faqs" && (
          <div role="tabpanel" id="panel-faqs" aria-labelledby="tab-faqs">
            <FaqPanel faqs={faqs} />
          </div>
        )}
      </div>
    </div>
  );
}

function DescriptionPanel({
  name,
  description,
  summary,
  items,
}: {
  name: string;
  description: string;
  summary: string;
  items: SurgicalSetItem[];
}) {
  return (
    <div>
      {description ? (
        <div className={richTextBody} dangerouslySetInnerHTML={{ __html: description }} />
      ) : (
        summary && <p className="text-[17px] leading-[1.85] text-[#4A5560] md:text-[18px]">{summary}</p>
      )}

      {items.length > 0 && (
        <section className="mt-12">
          <h3 className="text-[22px] font-bold text-[#10261F] md:text-[26px]">Our set includes</h3>
          <p className="mt-1.5 text-sm text-[#6B7C76]">
            {items.length} {items.length === 1 ? "instrument" : "instruments"} in the {name.toLowerCase()}.
          </p>

          <div className="mt-6 overflow-hidden rounded-lg border border-[#E3EAE7]">
            <table className="w-full border-collapse text-left text-[15px]">
              <caption className="sr-only">Instruments included in the {name}</caption>
              <thead className="bg-[#F5F8F7] text-[11px] uppercase tracking-[0.12em] text-[#5E716B]">
                <tr>
                  <th scope="col" className="w-16 px-4 py-3.5 font-bold sm:w-20 sm:px-6">
                    Sr No
                  </th>
                  <th scope="col" className="px-4 py-3.5 font-bold sm:px-6">
                    Instrument
                  </th>
                  <th scope="col" className="w-24 px-4 py-3.5 text-right font-bold sm:w-32 sm:px-6">
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDF2F0]">
                {items.map((item, index) => (
                  <tr key={`${item.name}-${index}`} className="transition-colors hover:bg-[#F9FBFA]">
                    <td className="px-4 py-3.5 tabular-nums text-[#8A9A95] sm:px-6">{index + 1}</td>
                    <td className="px-4 py-3.5 font-medium text-[#1E2A33] sm:px-6">{item.name}</td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-right tabular-nums text-[#4A5560] sm:px-6">
                      {item.quantity || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function SpecificationsPanel({ specifications }: { specifications: SurgicalSetSpec[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#E3EAE7]">
      <table className="w-full border-collapse text-left text-[15px]">
        <tbody className="divide-y divide-[#EDF2F0]">
          {specifications.map((spec, index) => (
            <tr key={`${spec.label}-${index}`} className="even:bg-[#F9FBFA]">
              <th scope="row" className="w-1/3 px-4 py-4 align-top font-semibold text-[#10261F] sm:px-6">
                {spec.label}
              </th>
              <td className="px-4 py-4 align-top text-[#4A5560] sm:px-6">{spec.value || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FaqPanel({ faqs }: { faqs: SurgicalSetFaq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-[#E7EDEB] border-y border-[#E7EDEB]">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={`${faq.question}-${index}`}>
            <h3>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors hover:text-[#18B27F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18B27F]/50"
              >
                <span className="text-base font-bold text-[#10261F] sm:text-[17px]">{faq.question}</span>
                <span
                  aria-hidden
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full transition-colors ${
                    isOpen ? "bg-[#18B27F] text-white" : "bg-[#EEF4F2] text-[#18B27F]"
                  }`}
                >
                  {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                </span>
              </button>
            </h3>
            {isOpen && faq.answer && (
              <p className="max-w-[72ch] pb-6 text-[15px] leading-[1.8] text-[#5B6560] sm:text-base">{faq.answer}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
