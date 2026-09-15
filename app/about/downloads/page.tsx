"use client";

import React, { useState } from "react";

// Placeholder resource list — swap titles and hrefs for the real PDF
// file paths once the actual documents are ready.
const resources = [
  { title: "Product Catalog 2026", href: "#" },
  { title: "SFDA Compliance Certificate", href: "#" },
  { title: "ISO 13485 Certification", href: "#" },
  { title: "Technical Specifications Guide", href: "#" },
] as const;

const Downloads = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire this up to a real endpoint (an API route, or an email
    // service like Resend) once one exists — this just confirms locally
    // for now.
    setSubmitted(true);
  };

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
              Downloads
            </p>
            <h1 className="font-serif text-6xl font-semibold text-white lg:text-6xl">
              Strengthen Your Healthcare Supply
            </h1>
            <p className="mt-6 text-2xl font-light leading-snug text-white lg:text-2xl">
              Explore Our Technical Resources &amp;
              <br />
              Product Guides
            </p>
          </div>
        </div>
      </section>

      {/* Resource list */}
      <section className="bg-white px-5 sm:px-8 md:px-12 lg:px-20 py-16 lg:pt-40 lg:pb-20">
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
          <div className="flex items-center gap-4">
            <span
              className="h-8 w-[3px] bg-primary shrink-0"
              aria-hidden="true"
            />
            <h2 className="text-3xl sm:text-4xl font-bold text-color leading-tight">
              Technical Resources
            </h2>
          </div>

          <div className="flex flex-col">
            {resources.map((resource, index) => (
              <a
                key={resource.title}
                href={resource.href}
                className={`flex items-center justify-between gap-6 py-6 group ${
                  index !== 0 ? "border-t border-[#D8DBD9]" : ""
                }`}
              >
                <span className="flex items-center gap-4">
                  <svg
                    className="w-6 h-6 text-primary shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  >
                    <path d="M6 2h9l5 5v15H6V2z" strokeLinejoin="round" />
                    <path d="M15 2v5h5" strokeLinejoin="round" />
                  </svg>
                  <span className="text-base sm:text-lg font-medium text-gray-900">
                    {resource.title}
                  </span>
                </span>
                <span className="text-sm font-medium text-primary group-hover:underline">
                  Download PDF
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Downloads;
