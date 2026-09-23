import { NextResponse } from "next/server";
import { connectDB } from "@/lib/apis/db";
import { User } from "@/models/User.schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function createAdmin() {
  const name = process.env.ADMIN_NAME?.trim() ?? "";
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? "";
  const password = process.env.ADMIN_PASSWORD ?? "";

  const errors: Record<string, string> = {};
  if (!name) errors.ADMIN_NAME = "Set ADMIN_NAME in .env.local.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.ADMIN_EMAIL = "Set a valid ADMIN_EMAIL in .env.local.";
  if (password.length < 8)
    errors.ADMIN_PASSWORD = "ADMIN_PASSWORD must be at least 8 characters.";
  if (Object.keys(errors).length) {
    return NextResponse.json(
      {
        error: "Admin details are missing from the environment.",
        fields: errors,
      },
      { status: 500 },
    );
  }

  try {
    await connectDB();

    const existing = await User.findOne({}).select("name email").lean();
    if (existing) {
      return NextResponse.json(
        {
          message: "An admin account already exists.",
          user: { name: existing.name, email: existing.email },
        },
        { status: 200 },
      );
    }

    const user = await User.create({ name, email, password });
    return NextResponse.json(
      {
        message: "Admin account created.",
        user: { id: String(user._id), name: user.name, email: user.email },
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("[auth/setup]", err);
    return NextResponse.json(
      { error: "Couldn't create the account." },
      { status: 500 },
    );
  }
}

export const POST = createAdmin;
export const GET = createAdmin;
