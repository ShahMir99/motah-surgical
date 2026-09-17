import React from "react";

const credentials = [
  "SFDA Compliant",
  "ISO 13485 Certified",
  "Lifetime Guarantee",
] as const;

const Compliance = () => {
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
              REGULATORY COMPLIANCE
            </p>
            <h1 className="text-7xl font-semibold text-white lg:text-7xl">
              Motah Surgical
            </h1>
            <p className="mt-6 text-2xl font-light leading-snug text-white lg:text-3xl">
              Regulatory Compliance &amp;
              <br />
              Quality Assurance
            </p>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-white px-5 sm:px-8 md:px-12 lg:px-20 py-16 lg:pt-40 lg:pb-20">
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col gap-5">
            <p className="text-xl text-center font-semibold text-primary sm:text-2xl text-gray-900 leading-9 max-w-[62ch]">
              At Motah Surgical, strict regulatory compliance and rigorous
              quality control are built into every stage of our operations.
            </p>
            <p className="text-[#5B6560] text-sm sm:text-base leading-7 max-w-[68ch]">
              We ensure every instrument exceeds{" "}
              <b className="text-gray-900 font-medium">
                Saudi Food and Drug Authority (SFDA)
              </b>{" "}
              requirements and{" "}
              <b className="text-gray-900 font-medium">
                ISO 13485 international standards
              </b>{" "}
              through comprehensive material testing, specialized local
              processing, and precise batch traceability. By investing in
              advanced processing technologies and strict quality control, we
              deliver lifetime-guaranteed surgical tools that ensure absolute
              safety, uninterrupted supply, and complete operational confidence
              for hospitals and healthcare procurement leaders.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-4 border-t border-[#D8DBD9]">
            {credentials.map((label) => (
              <span
                key={label}
                className="border border-[#D8DBD9] text-color text-sm font-medium px-5 py-2.5"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Compliance;
