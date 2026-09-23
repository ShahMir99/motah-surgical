import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { hashPassword } from "@/lib/password";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address."],
    },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ["admin"], default: "admin" },

    failedLoginAttempts: { type: Number, default: 0, select: false },
    lockUntil: { type: Date, default: null, select: false },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Hash the password whenever it is set or changed (create, or user.password = "..." then save()).
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await hashPassword(this.password);
});

export type UserDoc = InferSchemaType<typeof userSchema>;

export const User: Model<UserDoc> = (models.User as Model<UserDoc>) || model<UserDoc>("User", userSchema);