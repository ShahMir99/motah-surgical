import { Schema, model, models, type Model } from "mongoose";
import type { HomeContent } from "@/types/home";

/**
 * A single document (key "home") holding the editable home page content.
 * The shape is validated and cleaned in lib/apis/home-server.ts.
 */
const homePageSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "home" },
    content: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, versionKey: false, minimize: false }
);

export type HomePageDocument = { key: string; content: Partial<HomeContent>; updatedAt: Date };

export const HomePage: Model<HomePageDocument> =
  (models.HomePage as Model<HomePageDocument>) || model<HomePageDocument>("HomePage", homePageSchema);
