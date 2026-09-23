"use client";

import React, { useState } from "react";

const faqs = [
  {
    question:
      "What types of surgical instruments does Motah Surgical manufacture?",
    answer:
      "Motah Surgical specializes in high-precision surgical instruments across key specialties, including microsurgery, specialized rhinoplasty, plastic surgery, laparoscopy, and general surgical procedures.",
  },
  {
    question:
      "Are your surgical instruments compliant with regulatory and quality standards?",
    answer:
      "Yes. Every instrument we produce fully complies with Saudi Food and Drug Authority (SFDA) regulations and ISO 13485 international medical device quality management standards.",
  },
  {
    question:
      "How can I place an order or submit a tender request for surgical instruments?",
    answer:
      "You can submit orders or formal tender inquiries directly through our online procurement portal, by emailing our sales team, or by contacting your dedicated Motah Surgical account representative.",
  },
  {
    question:
      "Do you offer custom instrument modifications or specialized sizing?",
    answer:
      "Yes. Through our local manufacturing capabilities, we work directly with surgical teams and health authorities to provide custom instrument modifications, specialized finishes, and tailored sizing to meet specific clinical demands.",
  },
  {
    question: "What warranty covers Motah Surgical instruments?",
    answer:
      "All Motah Surgical instruments come with a comprehensive lifetime warranty against manufacturing defects and material flaws when used under standard clinical protocols.",
  },
  {
    question:
      "Do you provide technical support and product assistance for healthcare teams?",
    answer:
      "Yes. We offer complete technical support, including instrument care guidelines, material validation data, and direct assistance for hospital biomedical engineering teams.",
  },
  {
    question: "How can I request a product catalog or digital brochure?",
    answer:
      "You can instantly download our complete digital catalog from our website or request a printed copy through our sales and customer support team.",
  },
  {
    question:
      "Where can I find information about upcoming medical exhibitions or events Motah Surgical is attending?",
    answer:
      "You can track our event calendar and view upcoming regional and international medical conferences on our website's news section or by subscribing to our updates.",
  },
  {
    question:
      "How can my organization become an official distributor or supply partner with Motah Surgical?",
    answer:
      "We welcome partnerships with qualified healthcare distributors. You can submit a partnership inquiry through our website's Distribution Portal or contact our business development department directly.",
  },
  {
    question: "What is your return and replacement policy?",
    answer:
      "We maintain a straightforward replacement policy. Any instrument that does not meet quality specifications or exhibits manufacturing defects is evaluated immediately and replaced without interrupting your supply.",
  },
] as const;

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div>
      {/* Hero */}

      <section className="relative">
        <img
          src="https://placehold.co/1600x520/16303d/16303d?text=+"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-primary-dark" />

        <div className="relative mx-auto flex max-w-5xl flex-col lg:h-[360px] lg:flex-row">
          <div className="relative flex text-center w-full h-[440px] flex-col justify-center bg-[#02ac75] px-8 py-14 lg:shrink-0 lg:px-16 lg:py-0">
            <p className="mb-5 text-lg font-medium tracking-[0.4em] text-white">
              FAQS
            </p>
            <h1 className="font-serif text-6xl font-semibold text-white lg:text-6xl">
              How We Support Your Healthcare Operations
            </h1>
            <p className="mt-6 text-2xl font-light leading-snug text-white lg:text-2xl">
              Key Information on Manufacturing, Compliance &amp; Supply
              <br />
              Supply
            </p>
          </div>
        </div>
      </section>

      {/* FAQ list */}
      <section className="bg-white px-5 sm:px-8 md:px-12 lg:px-20 py-16 lg:pt-40 lg:pb-20 ">
        <div className="max-w-3xl mx-auto flex flex-col">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className={`py-6 ${
                  index !== 0 ? "border-t border-[#D8DBD9]" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold text-gray-900">
                    {faq.question}
                  </span>
                  <svg
                    className={`shrink-0 w-4 h-4 text-primary transition-transform duration-200 ${
                      isOpen ? "rotate-45" : ""
                    }`}
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
                  <p className="mt-4 text-[#5B6560] text-sm sm:text-base leading-7 max-w-[62ch]">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default FAQs;
