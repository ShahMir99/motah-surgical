import AboutHero from "@/components/site/AboutHero";
import FaqList from "@/components/site/FaqList";
import { getAboutContent } from "@/lib/apis/about-queries";

// Saving this page in the admin refreshes it right away; this is a fallback interval.
export const revalidate = 60;

const FAQs = async () => {
  const c = await getAboutContent("faqs");

  return (
    <div>
      <AboutHero content={c.hero} compact serif />

      {/* FAQ list */}
      <section className="bg-white px-5 sm:px-8 md:px-12 lg:px-20 py-16 lg:pt-40 lg:pb-20 ">
        <FaqList items={c.items} />
      </section>
    </div>
  );
};

export default FAQs;
