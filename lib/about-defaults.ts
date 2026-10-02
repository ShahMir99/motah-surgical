import type { AboutContentMap } from "@/types/about";

/**
 * What each About page shows until an admin saves changes.
 * In text fields, **double asterisks** make the words bold.
 */
export const ABOUT_DEFAULTS: AboutContentMap = {
  "company-introduction": {
    hero: {
      eyebrow: "INTRODUCTION",
      title: "Motah Surgical",
      subtitle: "Built for Precision. Driven by Purpose.\nSecured for KSA.",
    },
    image: null,
    greeting: "To Our Partners in Healthcare,",
    letter:
      "<p>Welcome to <strong>Motah Surgical</strong>—where quality manufacturing meets dependable surgical performance. Built in alignment with <strong>Saudi Vision 2030</strong>, we produce high-precision surgical instruments designed to support surgeons, improve patient care, and secure complete <strong>supply independence</strong> directly within the Kingdom.</p><p>Our approach is simple: <strong>continuous innovation</strong> and strict quality control. By leveraging localized processing, rigorous material testing, and full <strong>SFDA</strong> compliance within Saudi Arabia, we eliminate reliance on foreign supply chains. This allows us to deliver instruments backed by a lifetime warranty against <strong>manufacturing</strong> defects in material and workmanship, directly to healthcare institutions when they need them most. Coverage is subject to proper use, care, and sterilization in accordance with our guidelines, and excludes normal wear, consumable components, and damage from misuse or unauthorized repair, with specialty and <strong>microsurgery instruments</strong> covered under separate terms. We focus on precision because we understand the exact needs of surgical teams. Every tool we manufacture, including specialized microsurgery instruments, is engineered for superior grip, ideal balance, and uncompromising accuracy in the operating room.</p><p>Efficiency and reliability drive our operations. Through localized processing and streamlined distribution, we ensure hospitals, medical centers, and healthcare systems maintain uninterrupted access to <strong>world-class instruments</strong> without supply delays.\nBuilding national supply security also drives our growth across regional and global markets. As we strengthen Saudi Arabia's healthcare infrastructure, Motah Surgical presents <strong>Made in KSA quality</strong> on the international stage, showing what modern healthcare systems can expect from a trusted supply partner.</p><p>At Motah Surgical, we offer more than medical tools; we provide <strong>reliable supply partnerships</strong> for modern healthcare systems. Partner with us to strengthen your supply chain, elevate surgical standards, and support the future of <strong>sovereign healthcare</strong>.</p><p>Thank you for choosing Motah Surgical. Let's build a stronger, more reliable healthcare supply chain together.</p>",
    signoff: "Sincerely,",
    signature: "Motah Surgical Team",
  },

  "mission-vision": {
    hero: {
      eyebrow: "Mission and Vision",
      title: "Motah Surgical",
      subtitle: "Built for Precision. Driven by Purpose.\nSecured for KSA.",
    },
    intro: {
      eyebrow: "VISION AND MISSION",
      heading: "What Drives Us",
      text: "Advancing Kingdom healthcare with Made in KSA surgical instruments.",
    },
    blockOne: {
      heading: "Mission",
      text: "To strengthen national healthcare independence in alignment with Saudi Vision 2030 through specialized manufacturing, precise engineering, and dependable supply security for modern healthcare institutions.",
      image: null,
    },
    blockTwo: {
      heading: "Vision",
      text: "To lead the advancement of sovereign healthcare by delivering Made in KSA surgical instruments that define global standards for quality, supply resilience, and clinical reliability.",
      image: null,
    },
    global: {
      heading: "Global Strategic Reach",
      paragraphs: [
        "Our footprint extends far beyond conventional market boundaries. We have intentionally established **key regional hubs** to ensure seamless supply chain continuity, rapid delivery, and dedicated technical support across high-growth healthcare sectors. At the core of our expansion strategy is **Moath Surgical's** centralized presence driving growth across the dynamic **Middle East and North Africa** (MENA) region.",
        "By combining localized technical infrastructure in **Saudi Arabia** with robust manufacturing capabilities, Moath Surgical bridges the gap between international manufacturing standards and regional healthcare needs. This focused, local investment guarantees that hospitals, surgical centers, and procurement partners across MENA receive our precision surgical instruments, repair services, and clinical expertise with unmatched speed and reliability.",
      ],
      image: null,
    },
    achievements: {
      heading: "How We Achieve Our Mission",
      items: [
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
      ],
      closing:
        "By delivering on this operational roadmap, Motah Surgical strengthens local healthcare infrastructure while bringing Made in KSA precision to the global market. Through reliable manufacturing, supply security, and trusted partnerships, we equip healthcare systems with the tools they need to operate with complete confidence.",
    },
  },

  compliance: {
    hero: {
      eyebrow: "REGULATORY COMPLIANCE",
      title: "Motah Surgical",
      subtitle: "Regulatory Compliance &\nQuality Assurance",
    },
    lead: "At Motah Surgical, strict regulatory compliance and rigorous quality control are built into every stage of our operations.",
    body: "We ensure every instrument exceeds **Saudi Food and Drug Authority (SFDA)** requirements and **ISO 13485 international standards** through comprehensive material testing, specialized local processing, and precise batch traceability. By investing in advanced processing technologies and strict quality control, we deliver lifetime-guaranteed surgical tools that ensure absolute safety, uninterrupted supply, and complete operational confidence for hospitals and healthcare procurement leaders.",
    credentials: [
      { label: "Medical device establishment license", image: null },
      { label: "Medical device establishment license", image: null },
    ],
  },

  downloads: {
    hero: {
      eyebrow: "Downloads",
      title: "Strengthen Your Healthcare Supply",
      subtitle: "Explore Our Technical Resources &\nProduct Guides",
    },
    heading: "Technical Resources",
    linkLabel: "Download PDF",
    resources: [
      { title: "Product Catalog 2026", href: "#", file: null },
      { title: "SFDA Compliance Certificate", href: "#", file: null },
      { title: "ISO 13485 Certification", href: "#", file: null },
      { title: "Technical Specifications Guide", href: "#", file: null },
    ],
  },

  faqs: {
    hero: {
      eyebrow: "FAQS",
      title: "How We Support Your Healthcare Operations",
      subtitle: "Key Information on Manufacturing,\nCompliance & Supply",
    },
    items: [
      {
        question: "What types of surgical instruments does Motah Surgical manufacture?",
        answer:
          "Motah Surgical specializes in high-precision surgical instruments across key specialties, including microsurgery, specialized rhinoplasty, plastic surgery, laparoscopy, and general surgical procedures.",
      },
      {
        question: "Are your surgical instruments compliant with regulatory and quality standards?",
        answer:
          "Yes. Every instrument we produce fully complies with Saudi Food and Drug Authority (SFDA) regulations and ISO 13485 international medical device quality management standards.",
      },
      {
        question: "How can I place an order or submit a tender request for surgical instruments?",
        answer:
          "You can submit orders or formal tender inquiries directly through our online procurement portal, by emailing our sales team, or by contacting your dedicated Motah Surgical account representative.",
      },
      {
        question: "Do you offer custom instrument modifications or specialized sizing?",
        answer:
          "Yes. Through our local manufacturing capabilities, we work directly with surgical teams and health authorities to provide custom instrument modifications, specialized finishes, and tailored sizing to meet specific clinical demands.",
      },
      {
        question: "What warranty covers Motah Surgical instruments?",
        answer:
          "All Motah Surgical instruments come with a comprehensive lifetime warranty against manufacturing defects and material flaws when used under standard clinical protocols.",
      },
      {
        question: "Do you provide technical support and product assistance for healthcare teams?",
        answer:
          "Yes. We offer complete technical support, including instrument care guidelines, material validation data, and direct assistance for hospital biomedical engineering teams.",
      },
      {
        question: "How can I request a product catalog or digital brochure?",
        answer:
          "You can instantly download our complete digital catalog from our website or request a printed copy through our sales and customer support team.",
      },
      {
        question:
          "Where can I find information about upcoming medical exhibitions or events Motah Surgical is attending?",
        answer:
          "You can track our event calendar and view upcoming regional and international medical conferences on our website's news section or by subscribing to our updates.",
      },
      {
        question:
          "How can my organization become an official distributor or supply partner with Motah Surgical?",
        answer:
          "We welcome partnerships with qualified healthcare distributors. You can submit a partnership inquiry through our website's Distribution Portal or contact our business development department directly.",
      },
      {
        question: "What is your return and replacement policy?",
        answer:
          "We maintain a straightforward replacement policy. Any instrument that does not meet quality specifications or exhibits manufacturing defects is evaluated immediately and replaced without interrupting your supply.",
      },
    ],
  },
};
