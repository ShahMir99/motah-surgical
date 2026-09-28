import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const imageSchema = new Schema(
  {
    url: { type: String, required: true },
    key: { type: String, required: true }, // S3 object key, used for cleanup
    alt: { type: String, default: "" },
  },
  { _id: false }
);

const catalogSchema = new Schema(
  {
    url: { type: String, required: true },
    key: { type: String, required: true },
    fileName: { type: String, default: "catalogue.pdf" },
    size: { type: Number, default: 0 },
    title: { type: String, default: "" },
  },
  { _id: false }
);

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    tagline: { type: String, default: "", maxlength: 160 },
    taglineBold: { type: String, default: "", maxlength: 120 },
    summary: { type: String, default: "", maxlength: 400 },
    description: { type: String, default: "" },
    categories: { type: [String], default: [] },
    badge: { type: String, default: "", maxlength: 30 },
    order: { type: Number, default: 0 },
    image: { type: imageSchema, default: null },
    catalog: { type: catalogSchema, default: null },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
    },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false }
);

productSchema.index({ status: 1, order: 1, name: 1 });
productSchema.index({ updatedAt: -1 });

export type ProductDocument = InferSchemaType<typeof productSchema>;

export const Product: Model<ProductDocument> =
  (models.Product as Model<ProductDocument>) || model<ProductDocument>("Product", productSchema);
