import AboutHero from "@/components/site/AboutHero";
import { getAboutContent } from "@/lib/apis/about-queries";

import aboutBanner from "@/assets/our-story.png";

// Saving this page in the admin refreshes it right away; this is a fallback interval.
export const revalidate = 60;

const About = async () => {
  const c = await getAboutContent("company-introduction");

  return (
    <div>
      <AboutHero content={c.hero} serif />

      {/* Feature image */}
      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-6 sm:py-12 lg:pt-40 lg:pb:20">
        <img
          src={c.image?.url ?? aboutBanner.src}
          alt={c.image?.alt || "Surgeons handing over a surgical instrument"}
          className="h-[200px] w-full object-cover sm:h-[300px] md:h-[360px] lg:h-[420px]"
        />
      </section>

      {/* Letter */}
      <section className="mx-auto max-w-5xl px-5 pb-14 sm:px-6 sm:pb-20">
        <div className="mx-auto max-w-5xl space-y-5 text-justify text-[16px] leading-relaxed text-slate-800 sm:text-[17px]">
          {c.greeting && (
            <p className="text-left text-[17px] font-semibold text-primary sm:text-[20px]">{c.greeting}</p>
          )}

          <div
            className="space-y-5 [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:text-xl [&_h3]:font-bold [&_img]:h-auto [&_img]:max-w-full [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6"
            dangerouslySetInnerHTML={{ __html: c.letter }}
          />

          {c.signoff && <p>{c.signoff}</p>}
        </div>

        {c.signature && (
          <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:gap-24">
            <p className="text-[16px] italic font-medium text-primary sm:text-[18px]">{c.signature}</p>
            <div></div>
          </div>
        )}
      </section>
    </div>
  );
};

export default About;
