import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const imageSchema = new Schema(
  {
    url: { type: String, required: true },
    key: { type: String, required: true }, // S3 object key, used for cleanup
    alt: { type: String, default: "" },
  },
  { _id: false }
);

const itemSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    quantity: { type: String, default: "", trim: true, maxlength: 40 },
  },
  { _id: false }
);

const specSchema = new Schema(
  {
    label: { type: String, required: true, trim: true, maxlength: 80 },
    value: { type: String, default: "", trim: true, maxlength: 300 },
  },
  { _id: false }
);

const faqSchema = new Schema(
  {
    question: { type: String, required: true, trim: true, maxlength: 200 },
    answer: { type: String, default: "", trim: true, maxlength: 1200 },
  },
  { _id: false }
);

const surgicalSetSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    category: { type: String, default: "", trim: true, maxlength: 80 },
    summary: { type: String, default: "", maxlength: 600 },
    description: { type: String, default: "" },
    features: { type: [String], default: [] },
    items: { type: [itemSchema], default: [] },
    specifications: { type: [specSchema], default: [] },
    faqs: { type: [faqSchema], default: [] },
    sku: { type: String, default: "", trim: true, maxlength: 40 },
    type: { type: String, default: "Surgical Set", trim: true, maxlength: 60 },
    size: { type: String, default: "", trim: true, maxlength: 120 },
    tags: { type: [String], default: [] },
    image: { type: imageSchema, default: null },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
    },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false }
);

surgicalSetSchema.index({ status: 1, order: 1, name: 1 });
surgicalSetSchema.index({ status: 1, category: 1 });
surgicalSetSchema.index({ updatedAt: -1 });

export type SurgicalSetDocument = InferSchemaType<typeof surgicalSetSchema>;

export const SurgicalSet: Model<SurgicalSetDocument> =
  (models.SurgicalSet as Model<SurgicalSetDocument>) ||
  model<SurgicalSetDocument>("SurgicalSet", surgicalSetSchema);
