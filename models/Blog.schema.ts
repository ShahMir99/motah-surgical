import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const imageSchema = new Schema(
  {
    url: { type: String, required: true },
    key: { type: String, required: true }, // S3 object key, used for cleanup
    alt: { type: String, default: "" },
  },
  { _id: false }
);

const blogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    excerpt: { type: String, default: "", maxlength: 400 },
    content: { type: String, default: "" },
    coverImage: { type: imageSchema, default: null },
    category: { type: String, default: "", trim: true },
    tags: { type: [String], default: [] },
    author: { type: String, default: "Motah Surgical", trim: true },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
    },
    readingTime: { type: Number, default: 1 },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false }
);

blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ updatedAt: -1 });

export type BlogDocument = InferSchemaType<typeof blogSchema>;

export const Blog: Model<BlogDocument> =
  (models.Blog as Model<BlogDocument>) || model<BlogDocument>("Blog", blogSchema);
