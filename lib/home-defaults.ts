import type { HomeContent } from "@/types/home";

/** What the home page shows until an admin saves changes. */
export const HOME_DEFAULTS: HomeContent = {
  hero: {
    eyebrow: "What drives us",
    heading: "Advancing Kingdom healthcare with Made in KSA surgical instruments.",
    buttonLabel: "Learn more about Motah Surgical",
    buttonHref: "/about/company-introduction",
    image: null,
  },
  badges: ["ISO 13485 certified", "CE marked", "EU-MDR compliant", "FDA registered"],
  products: {
    eyebrow: "Product range",
    heading: "What are you looking for ?",
    buttonLabel: "View all products",
    limit: 10,
  },
  about: {
    prefix: "About",
    title: "Motah Surgical",
    body:
      "At Motah Surgical, we forge world-class, Made in KSA surgical instruments engineered to meet the highest global standards—backed by a lifetime guarantee. Built from inside the Kingdom, our operations directly accelerate Saudi Vision 2030 by localizing medical device manufacturing and reinforcing national healthcare sovereignty. We equip surgeons with absolute tactile precision, elevating standard operating procedure across Saudi hospitals and empowering healthcare professionals to perform with total confidence.",
    buttonLabel: "Read more",
    buttonHref: "/about/company-introduction",
    image: null,
  },
  highlights: {
    eyebrow: "Our highlights",
    heading: "Where our engineering makes the difference",
    items: [
      {
        heading: "Building Sovereign Healthcare",
        blurb:
          "We are committed to building strong national healthcare supply chains by delivering world-class, SFDA-compliant surgical instruments directly inside the Kingdom. Backed by a lifetime guarantee, our localized operations ensure Saudi hospitals maintain uninterrupted access to precision tools for critical care.",
        href: "/about/mission-vision",
        image: null,
      },
      {
        heading: "Micro-Precision Engineering",
        blurb:
          "Master fine-tissue manipulation with our research-backed microsurgical instruments. Specialized for complex micro-vascular procedures, our high-grade tools deliver exceptional balance and ultra-fine tactile control where every millimeter counts.",
        href: "/products/microsurgery",
        image: null,
      },
      {
        heading: "Precision Rhinoplasty Solutions",
        blurb:
          "Elevate surgical outcomes in nasal procedures with our specialized rhinoplasty instruments. Engineered for exact balance and fine tactile feedback, our tools deliver the control required to achieve refined aesthetic results.",
        href: "/products/ear-nose-throat-surgery",
        image: null,
      },
      {
        heading: "Expanding Global Presence",
        blurb:
          "Motah Surgical actively projects Saudi manufacturing capability onto the international stage through key regional medical exhibitions. By showcasing our SFDA-compliant instruments across global healthcare platforms, we advance Saudi Vision 2030 and integrate local precision into worldwide surgical supply chains.",
        href: "/about/company-introduction",
        image: null,
      },
    ],
  },
  exhibition: {
    titleTop: "Upcoming",
    titleBottom: "Exhibitions",
    text: "Global Health Exhibition, Riyadh (Malham), Oct 26–29, 2026",
    image: null,
  },
};
