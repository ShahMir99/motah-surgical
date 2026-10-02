import { InlineText } from "@/components/site/InlineText";
import type { AboutHero as AboutHeroContent } from "@/types/about";

/** The green banner at the top of every About page. */
export default function AboutHero({
  content,
  compact = false,
  serif = false,
}: {
  content: AboutHeroContent;
  /** Smaller heading, used by the pages with a long title. */
  compact?: boolean;
  serif?: boolean;
}) {
  return (
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
          <p className="mb-5 text-lg font-medium tracking-[0.4em] text-white">{content.eyebrow}</p>
          <h1
            className={`${serif ? "font-serif " : ""}font-semibold text-white ${
              compact ? "text-6xl lg:text-6xl" : "text-7xl lg:text-7xl"
            }`}
          >
            {content.title}
          </h1>
          <p
            className={`mt-6 text-2xl font-light leading-snug text-white ${compact ? "lg:text-2xl" : "lg:text-3xl"}`}
          >
            <InlineText text={content.subtitle} />
          </p>
        </div>
      </div>
    </section>
  );
}
