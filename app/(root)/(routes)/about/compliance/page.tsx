import AboutHero from "@/components/site/AboutHero";
import { InlineText } from "@/components/site/InlineText";
import { getAboutContent } from "@/lib/apis/about-queries";

import isoLogo from "@/assets/credentials/M- IDL-2026-MD-0279_page-0001.jpg.jpeg";
import ceLogo from "@/assets/credentials/M- SWL-2026-MD-0715_page-0001.jpg.jpeg";

// Saving this page in the admin refreshes it right away; this is a fallback interval.
export const revalidate = 60;

// Shown for a credential until an image is uploaded for it.
const FALLBACK_IMAGES = [isoLogo.src, ceLogo.src];

const Compliance = async () => {
  const c = await getAboutContent("compliance");

  return (
    <div>
      <AboutHero content={c.hero} />

      {/* Body */}
      <section className="bg-white px-5 sm:px-8 md:px-12 lg:px-20 py-16 lg:pt-40 lg:pb-20">
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
          <div className="flex items-center justify-center flex-col gap-8">
            <p className="text-xl text-center font-semibold text-primary sm:text-2xl text-gray-900 leading-9 max-w-[62ch]">
              {c.lead}
            </p>
            <p className="text-[#5B6560] text-center text-sm sm:text-base leading-7 max-w-[68ch]">
              <InlineText text={c.body} boldClassName="text-gray-900 font-medium" />
            </p>
          </div>

          {c.credentials.length > 0 && (
            <div className="flex items-center justify-center flex-wrap gap-4 pt-16 border-t border-[#D8DBD9]">
              {c.credentials.map((item, i) => {
                const src = item.image?.url ?? FALLBACK_IMAGES[i];
                return (
                  <div key={i} className="flex items-center justify-center border border-[#D8DBD9] h-[252px]">
                    {src ? (
                      <img src={src} alt={item.image?.alt || item.label} className="h-full w-auto object-contain" />
                    ) : (
                      <span className="px-6 text-sm text-[#5B6560]">{item.label}</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Compliance;
