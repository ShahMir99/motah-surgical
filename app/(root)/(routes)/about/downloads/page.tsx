import AboutHero from "@/components/site/AboutHero";
import { getAboutContent } from "@/lib/apis/about-queries";

// Saving this page in the admin refreshes it right away; this is a fallback interval.
export const revalidate = 60;

const Downloads = async () => {
  const c = await getAboutContent("downloads");

  return (
    <div>
      <AboutHero content={c.hero} compact serif />

      {/* Resource list */}
      <section className="bg-white px-5 sm:px-8 md:px-12 lg:px-20 py-16 lg:pt-40 lg:pb-20">
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
          <div className="flex items-center justify-center gap-4">
            <span className="h-8 w-[3px] bg-primary shrink-0" aria-hidden="true" />
            <h2 className="text-3xl sm:text-4xl font-bold text-color leading-tight">{c.heading}</h2>
          </div>

          <div className="flex flex-col">
            {c.resources.map((resource, index) => {
              const link = resource.file?.url ?? (resource.href || "#");
              const opensFile = link !== "#";
              return (
                <a
                  key={index}
                  href={link}
                  {...(opensFile ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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
                    <span className="text-base sm:text-lg font-medium text-gray-900">{resource.title}</span>
                  </span>
                  <span className="text-sm font-medium text-primary group-hover:underline">{c.linkLabel}</span>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Downloads;
