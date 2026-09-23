import React from "react";

import mission from "@/assets/01.png";
import vision from "@/assets/02.jpeg";
import ourGlobalPresence from "@/assets/global-reached.png";

const stats = [
  { value: "50", label: "Years in Business" },
  { value: "65", label: "Countries" },
  { value: "10,000+", label: "Instrument types" },
  { value: "500+", label: "Employees." },
] as const;

const achievements = [
  {
    title: "Research & Material Development",
    description:
      "Focusing on continuous innovation to improve instrument balance, material durability, and precise control for demanding surgical procedures.",
  },
  {
    title: "Localized Manufacturing & Quality Validation",
    description:
      "Maintaining full SFDA compliance and rigorous quality testing inside Saudi Arabia, ensuring every instrument meets dependable lifetime standards.",
  },
  {
    title: "Tailored Healthcare Solutions",
    description:
      "Addressing the specific needs of hospitals, procurement teams, and health authorities by providing reliable supply agreements that protect operational continuity.",
  },
  {
    title: "Efficient Logistics & Rapid Response",
    description:
      "Eliminating international supply delays through localized stock management, efficient processing, and direct delivery to medical facilities.",
  },
  {
    title: "Strategic Supply Partnerships",
    description:
      "Working closely with healthcare leaders and international networks to build resilient supply chains that raise surgical standards across the region and beyond.",
  },
] as const;

const About = () => {
  return (
    <div>
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
              Mission and Vision
            </p>
            <h1 className="text-7xl font-semibold text-white lg:text-7xl">
              Motah Surgical
            </h1>
            <p className="mt-6 text-2xl font-light leading-snug text-white lg:text-3xl">
              Built for Precision. Driven by Purpose.
              <br />
              Secured for KSA.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission Intro */}
      <section className="bg-white px-5 sm:px-8 md:px-12 lg:px-20 pt-40 pb-16 text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
          <p className="text-sm font-medium tracking-[0.3em] text-primary">
            VISION AND MISSION
          </p>
          <h2 className="text-4xl sm:text-5xl text-color leading-tight">
            What Drives Us
          </h2>
          <p className="text-[#5B6560] text-base sm:text-lg leading-8 max-w-[52ch]">
            Advancing Kingdom healthcare with Made in KSA surgical instruments.
          </p>
        </div>
      </section>

      {/* Vision Section */}
      <section className="bg-white px-5 sm:px-8 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Image */}
          <div className="lg:col-span-7 order-1">
            <div className="relative border border-[#D8DBD9]  bg-white shadow-[0_0_20px_0px_rgba(18,33,29,0.3)]">
              <div className="h-64 sm:h-80 md:h-96 lg:h-[380px] w-full overflow-hidden">
                <img
                  src={vision.src}
                  alt="Vision"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="lg:col-span-5 order-2 flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <span
                className="h-8 w-[3px] bg-primary shrink-0"
                aria-hidden="true"
              />

              <h2 className="text-3xl sm:text-4xl font-bold text-color leading-tight">
                Mission
              </h2>
            </div>
            <p className="text-lg sm:text-lg text-gray-700 leading-7 max-w-[58ch]">
              To strengthen national healthcare independence in alignment with
              Saudi Vision 2030 through specialized manufacturing, precise
              engineering, and dependable supply security for modern healthcare
              institutions.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-[#F2F4F3] px-5 sm:px-8 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Text */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <span
                className="h-8 w-[3px] bg-primary shrink-0"
                aria-hidden="true"
              />
              <h2 className="text-3xl sm:text-4xl font-bold text-color leading-tight">
                Vision
              </h2>
            </div>
            <p className="text-lg sm:text-lg text-gray-700 leading-7 max-w-[58ch]">
              To lead the advancement of sovereign healthcare by delivering Made
              in KSA surgical instruments that define global standards for
              quality, supply resilience, and clinical reliability.
            </p>
          </div>

          {/* Image */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="relative border border-[#D8DBD9]  bg-white shadow-[0_0_20px_0px_rgba(18,33,29,0.3)]">
              <div className="h-64 sm:h-80 md:h-96 lg:h-[420px] w-full overflow-hidden">
                <img
                  src={mission.src}
                  alt="Mission"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Presence Section */}
      <section className="relative bg-[#12211D] py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={ourGlobalPresence.src}
            alt="Green Cross Surgical's global regional hubs"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#12211D]/60 via-[#12211D]/70 to-[#12211D]/90" />
        </div>

        <div className="relative px-6 sm:px-10 md:px-16 lg:px-32">
          <div className="max-w-[68ch] mx-auto text-center flex flex-col gap-5">
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-white leading-tight">
              Global Strategic Reach
            </h2>
            <p className="text-[#C9D1CB] text-base sm:text-lg leading-8">
              Our footprint extends far beyond conventional market boundaries.
              We have intentionally established{" "}
              <b className="text-white font-medium">key regional hubs</b> to
              ensure seamless supply chain continuity, rapid delivery, and
              dedicated technical support across high-growth healthcare sectors.
              At the core of our expansion strategy is{" "}
              <b className="text-white font-medium">Moath Surgical's</b>{" "}
              centralized presence driving growth across the dynamic{" "}
              <b className="text-white font-medium">
                Middle East and North Africa
              </b>{" "}
              (MENA) region.
            </p>
            <p className="text-[#C9D1CB] text-base sm:text-lg leading-8">
              By combining localized technical infrastructure in{" "}
              <b className="text-white font-medium">Saudi Arabia</b> with robust
              manufacturing capabilities, Moath Surgical bridges the gap between
              international manufacturing standards and regional healthcare
              needs. This focused, local investment guarantees that hospitals,
              surgical centers, and procurement partners across MENA receive our
              precision surgical instruments, repair services, and clinical
              expertise with unmatched speed and reliability.
            </p>
          </div>
        </div>
      </section>

      {/* How We Achieve Our Mission Section */}
      <section className="bg-[#F2F4F3] px-5 sm:px-8 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="max-w-5xl mx-auto flex flex-col gap-12">
          <div className="flex items-center justify-center gap-2">
            <span
              className="h-8 w-[3px] bg-primary shrink-0"
              aria-hidden="true"
            />
            <h2 className="text-3xl text-center sm:text-4xl font-bold text-color leading-tight">
              How We Achieve Our Mission
            </h2>
          </div>

          <div className="flex flex-col">
            {achievements.map((item, index) => (
              <div
                key={item.title}
                className={`grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4 sm:gap-8 py-8 ${
                  index !== 0 ? "border-t border-[#D8DBD9]" : ""
                }`}
              >
                <span className="text-4xl text-primary leading-none">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-[#5B6560] text-sm sm:text-base leading-7 max-w-[62ch]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xl sm:text-2xl text-gray-900 leading-9 max-w-[68ch] border-t border-[#D8DBD9] pt-10">
            By delivering on this operational roadmap, Motah Surgical
            strengthens local healthcare infrastructure while bringing Made in
            KSA precision to the global market. Through reliable manufacturing,
            supply security, and trusted partnerships, we equip healthcare
            systems with the tools they need to operate with complete
            confidence.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
