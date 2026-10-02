"use client";

import { useState } from "react";

export default function FaqList({ items }: { items: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto flex flex-col">
      {items.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className={`py-6 ${index !== 0 ? "border-t border-[#D8DBD9]" : ""}`}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between gap-6 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-base sm:text-lg font-bold text-gray-900">{faq.question}</span>
              <svg
                className={`shrink-0 w-4 h-4 text-primary transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
            </button>
            {isOpen && (
              <p className="mt-4 text-[#5B6560] text-sm sm:text-base leading-7 max-w-[62ch]">{faq.answer}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
