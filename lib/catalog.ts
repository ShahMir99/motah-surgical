import arthro from "@/assets/cat-arthro.jpg";
import cardio from "@/assets/cat-cardio.jpg";
import dental from "@/assets/cat-dental.jpg";
import eye from "@/assets/cat-eye.jpg";
import general from "@/assets/cat-general.jpg";
import micro from "@/assets/cat-micro.jpg";

export type Category = {
  slug: string;
  name: string;
  blurb: string;
  image: any;
  count: string;
};

export const categories: Category[] = [
  {
    slug: "arthroscopy",
    name: "Arthroscopy",
    blurb: "Punches, graspers and shaver systems for minimally invasive joint procedures.",
    image: arthro,
    count: "420+ instruments",
  },
  {
    slug: "cardiovascular",
    name: "Cardiovascular Surgery",
    blurb: "Atraumatic clamps, needle holders and retractors for open-heart and vascular work.",
    image: cardio,
    count: "760+ instruments",
  },
  {
    slug: "dental",
    name: "Dental Surgery",
    blurb: "Elevators, forceps, scalers and mirrors finished to a mirror-polish standard.",
    image: dental,
    count: "980+ instruments",
  },
  {
    slug: "eye",
    name: "Eye Instruments",
    blurb: "Ophthalmic speculums, micro scissors and cannulae with sub-millimetre tolerances.",
    image: eye,
    count: "540+ instruments",
  },
  {
    slug: "general-surgery",
    name: "General Surgery",
    blurb: "The complete theatre tray: scissors, hemostats, retractors and towel clamps.",
    image: general,
    count: "2,300+ instruments",
  },
  {
    slug: "microsurgery",
    name: "Microsurgery",
    blurb: "Titanium and steel micro forceps engineered for reconstructive precision.",
    image: micro,
    count: "610+ instruments",
  },
];

import detailImg from "@/assets/gal-detail.jpg";
import inspectionImg from "@/assets/gal-inspection.jpg";
import packagingImg from "@/assets/gal-packaging.jpg";

export type CategoryDetail = {
  slug: string;
  headline: string;
  intro: string;
  ranges: { name: string; description: string }[];
  specs: { label: string; value: string }[];
  gallery: any;
};

const sharedGallery = [
  { src: detailImg, caption: "Mirror-polished working ends" },
  { src: inspectionImg, caption: "100% dimensional inspection" },
  { src: packagingImg, caption: "Set assembly and packaging" },
];

export const categoryDetails: Record<string, CategoryDetail> = {
  arthroscopy: {
    slug: "arthroscopy",
    headline: "Arthroscopy instrumentation",
    intro:
      "Slim-profile punches, graspers and probes designed for tight joint spaces, with reinforced jaws that hold their bite through repeated sterilisation cycles.",
    ranges: [
      { name: "Basket & upbite punches", description: "Straight, 15° and 30° working angles in 3.4 mm and 4.5 mm shafts." },
      { name: "Graspers & retrievers", description: "Ratcheted and non-ratcheted handles with locking or free-return action." },
      { name: "Probes & cannulae", description: "Calibrated probes, switching sticks and inflow cannulae with obturators." },
    ],
    specs: [
      { label: "Material", value: "Martensitic stainless 420 / 17-4PH" },
      { label: "Shaft diameters", value: "3.4 mm, 4.0 mm, 4.5 mm" },
      { label: "Finish", value: "Satin body, mirror working end" },
      { label: "Sterilisation", value: "Autoclave 134 °C validated" },
    ],
    gallery: sharedGallery,
  },
  cardiovascular: {
    slug: "cardiovascular",
    headline: "Cardiovascular surgery instruments",
    intro:
      "Atraumatic clamps, micro needle holders and sternal retractors built for long open-heart procedures where jaw alignment and spring temper cannot drift.",
    ranges: [
      { name: "Vascular clamps", description: "DeBakey, Cooley and bulldog patterns with fine atraumatic serration." },
      { name: "Needle holders", description: "Tungsten-carbide inserts from 14 cm micro to 24 cm long-reach." },
      { name: "Retractors", description: "Sternal, rib and mammary retractors with stainless ratchet mechanisms." },
    ],
    specs: [
      { label: "Material", value: "Surgical stainless 410 / 420 with TC inserts" },
      { label: "Jaw alignment", value: "Full-length contact, hand-lapped" },
      { label: "Finish", value: "Matte anti-glare or mirror polish" },
      { label: "Compliance", value: "ISO 13485 manufactured, CE marked" },
    ],
    gallery: sharedGallery,
  },
  dental: {
    slug: "dental",
    headline: "Dental surgery instruments",
    intro:
      "Extraction, restorative and periodontal instruments with balanced handles that reduce chair-side fatigue and hold a keen edge across thousands of cycles.",
    ranges: [
      { name: "Extraction forceps", description: "Upper and lower adult and paediatric patterns, aligned beak to beak." },
      { name: "Elevators & luxators", description: "Cryer, Warwick James and Coupland sets in graded widths." },
      { name: "Scalers & curettes", description: "Gracey and universal curettes with cryogenic-hardened edges." },
    ],
    specs: [
      { label: "Material", value: "Stainless 420 / 304 handles" },
      { label: "Edge hardness", value: "52–56 HRC" },
      { label: "Handles", value: "Solid, hollow and silicone-grip options" },
      { label: "Marking", value: "Laser-etched logo and lot code" },
    ],
    gallery: sharedGallery,
  },
  eye: {
    slug: "eye",
    headline: "Ophthalmic instruments",
    intro:
      "Sub-millimetre micro scissors, forceps and cannulae finished under magnification, where tip geometry is verified optically on every single unit.",
    ranges: [
      { name: "Micro scissors", description: "Vannas, Westcott and capsulotomy patterns, straight and curved." },
      { name: "Capsulorhexis forceps", description: "Utrata and cross-action designs with 0.1 mm tying platforms." },
      { name: "Speculums & cannulae", description: "Wire and solid-blade speculums, irrigation and hydrodissection cannulae." },
    ],
    specs: [
      { label: "Material", value: "Titanium grade 5 or stainless 17-4PH" },
      { label: "Tip tolerance", value: "±0.02 mm" },
      { label: "Inspection", value: "20× optical tip verification" },
      { label: "Packaging", value: "Individual protective tip sleeves" },
    ],
    gallery: sharedGallery,
  },
  "general-surgery": {
    slug: "general-surgery",
    headline: "General surgery instruments",
    intro:
      "The complete theatre tray, from scissors and hemostats to retractors and towel clamps, built to a single specification so every set matches on delivery.",
    ranges: [
      { name: "Scissors", description: "Mayo, Metzenbaum and iris patterns with optional TC edges." },
      { name: "Forceps & hemostats", description: "Kelly, Crile, Kocher and mosquito patterns, box-joint construction." },
      { name: "Retractors", description: "Langenbeck, Deaver, Balfour and self-retaining frames." },
    ],
    specs: [
      { label: "Material", value: "Surgical stainless 410 / 420 / 304" },
      { label: "Joints", value: "Box joints, hand-set ratchets" },
      { label: "Finish", value: "Mirror, satin or black anti-reflective" },
      { label: "Lead time", value: "4–6 weeks on standard patterns" },
    ],
    gallery: sharedGallery,
  },
  microsurgery: {
    slug: "microsurgery",
    headline: "Microsurgery instruments",
    intro:
      "Titanium and steel micro forceps, clamps and needle holders for reconstructive and neuro work, balanced for a light, predictable spring feel.",
    ranges: [
      { name: "Micro forceps", description: "Jeweller, tying and dressing patterns from 0.1 mm to 0.5 mm tips." },
      { name: "Micro needle holders", description: "Round and flat handles, with and without lock." },
      { name: "Approximator clamps", description: "Single and double vessel clamps with calibrated closing pressure." },
    ],
    specs: [
      { label: "Material", value: "Titanium grade 5, non-magnetic" },
      { label: "Spring tension", value: "Calibrated and batch-tested" },
      { label: "Finish", value: "Anodised matte, glare-free" },
      { label: "Sterilisation", value: "Autoclave and plasma compatible" },
    ],
    gallery: sharedGallery,
  },
};
