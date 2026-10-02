import { Schema, model, models, type Model } from "mongoose";

/**
 * One document per About sub-page (slug "company-introduction", "faqs", ...).
 * The shape is validated and cleaned in lib/apis/about-server.ts.
 */
const aboutPageSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    content: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, versionKey: false, minimize: false }
);

export type AboutPageDocument = { slug: string; content: unknown; updatedAt: Date };

export const AboutPage: Model<AboutPageDocument> =
  (models.AboutPage as Model<AboutPageDocument>) || model<AboutPageDocument>("AboutPage", aboutPageSchema);
