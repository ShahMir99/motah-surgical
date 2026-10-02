import AboutHero from "@/components/site/AboutHero";
import { InlineText } from "@/components/site/InlineText";
import { getAboutContent } from "@/lib/apis/about-queries";

import mission from "@/assets/01.png";
import vision from "@/assets/02.jpeg";
import ourGlobalPresence from "@/assets/global-reached.png";

// Saving this page in the admin refreshes it right away; this is a fallback interval.
export const revalidate = 60;

const About = async () => {
  const c = await getAboutContent("mission-vision");

  return (
    <div>
      <AboutHero content={c.hero} />

      {/* Vision & Mission Intro */}
      <section className="bg-white px-5 sm:px-8 md:px-12 lg:px-20 pt-40 pb-16 text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
          <p className="text-sm font-medium tracking-[0.3em] text-primary">{c.intro.eyebrow}</p>
          <h2 className="text-4xl sm:text-5xl text-color leading-tight">{c.intro.heading}</h2>
          <p className="text-[#5B6560] text-base sm:text-lg leading-8 max-w-[52ch]">{c.intro.text}</p>
        </div>
      </section>

      {/* First block */}
      <section className="bg-white px-5 sm:px-8 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Image */}
          <div className="lg:col-span-7 order-1">
            <div className="relative border border-[#D8DBD9]  bg-white shadow-[0_0_20px_0px_rgba(18,33,29,0.3)]">
              <div className="h-64 sm:h-80 md:h-96 lg:h-[380px] w-full overflow-hidden">
                <img
                  src={c.blockOne.image?.url ?? vision.src}
                  alt={c.blockOne.image?.alt || c.blockOne.heading}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="lg:col-span-5 order-2 flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <span className="h-8 w-[3px] bg-primary shrink-0" aria-hidden="true" />

              <h2 className="text-3xl sm:text-4xl font-bold text-color leading-tight">{c.blockOne.heading}</h2>
            </div>
            <p className="text-lg sm:text-lg text-gray-700 leading-7 max-w-[58ch]">{c.blockOne.text}</p>
          </div>
        </div>
      </section>

      {/* Second block */}
      <section className="bg-[#F2F4F3] px-5 sm:px-8 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Text */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <span className="h-8 w-[3px] bg-primary shrink-0" aria-hidden="true" />
              <h2 className="text-3xl sm:text-4xl font-bold text-color leading-tight">{c.blockTwo.heading}</h2>
            </div>
            <p className="text-lg sm:text-lg text-gray-700 leading-7 max-w-[58ch]">{c.blockTwo.text}</p>
          </div>

          {/* Image */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="relative border border-[#D8DBD9]  bg-white shadow-[0_0_20px_0px_rgba(18,33,29,0.3)]">
              <div className="h-64 sm:h-80 md:h-96 lg:h-[420px] w-full overflow-hidden">
                <img
                  src={c.blockTwo.image?.url ?? mission.src}
                  alt={c.blockTwo.image?.alt || c.blockTwo.heading}
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
            src={c.global.image?.url ?? ourGlobalPresence.src}
            alt={c.global.image?.alt || "Motah Surgical's global regional hubs"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#12211D]/60 via-[#12211D]/70 to-[#12211D]/90" />
        </div>

        <div className="relative px-6 sm:px-10 md:px-16 lg:px-32">
          <div className="max-w-[68ch] mx-auto text-center flex flex-col gap-5">
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-white leading-tight">{c.global.heading}</h2>
            {c.global.paragraphs.map((p, i) => (
              <p key={i} className="text-[#C9D1CB] text-base sm:text-lg leading-8">
                <InlineText text={p} boldClassName="text-white font-medium" />
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* How We Achieve Our Mission Section */}
      <section className="bg-[#F2F4F3] px-5 sm:px-8 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="max-w-5xl mx-auto flex flex-col gap-12">
          <div className="flex items-center justify-center gap-2">
            <span className="h-8 w-[3px] bg-primary shrink-0" aria-hidden="true" />
            <h2 className="text-3xl text-center sm:text-4xl font-bold text-color leading-tight">
              {c.achievements.heading}
            </h2>
          </div>

          <div className="flex flex-col">
            {c.achievements.items.map((item, index) => (
              <div
                key={index}
                className={`grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4 sm:gap-8 py-8 ${
                  index !== 0 ? "border-t border-[#D8DBD9]" : ""
                }`}
              >
                <span className="text-4xl text-primary leading-none">{String(index + 1).padStart(2, "0")}</span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">{item.title}</h3>
                  <p className="text-[#5B6560] text-sm sm:text-base leading-7 max-w-[62ch]">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {c.achievements.closing && (
            <p className="text-xl sm:text-2xl text-gray-900 leading-9 max-w-[68ch] border-t border-[#D8DBD9] pt-10">
              {c.achievements.closing}
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default About;
