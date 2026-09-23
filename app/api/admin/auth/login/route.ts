import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/apis/db";
import { User } from "@/models/User.schema";
import { HASH_KEY, verifyPassword } from "@/lib/password";
import {
  LONG_SESSION_SECONDS,
  SESSION_COOKIE,
  SHORT_SESSION_SECONDS,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/session";

export const runtime = "nodejs";

const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;
const INVALID = "That email and password don't match.";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    email?: unknown;
    password?: unknown;
    remember?: unknown;
  } | null;
  
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const remember = body?.remember !== false;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Enter your email and password." },
      { status: 400 },
    );
  }

  try {
    await connectDB();
    const user = await User.findOne({ email }).select(
      "+password +failedLoginAttempts +lockUntil",
    );

    if (!user) {
      await verifyPassword(password, HASH_KEY);
      return NextResponse.json({ error: INVALID }, { status: 401 });
    }

    if (user.lockUntil && user.lockUntil.getTime() > Date.now()) {
      const minutes = Math.ceil(
        (user.lockUntil.getTime() - Date.now()) / 60000,
      );
      return NextResponse.json(
        {
          error: `Too many failed attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
        },
        { status: 429 },
      );
    }

    const valid = await verifyPassword(password, user.password);

    if (!valid) {
      const attempts = (user.failedLoginAttempts ?? 0) + 1;
      const locked = attempts >= MAX_ATTEMPTS;
      await User.updateOne(
        { _id: user._id },
        locked
          ? {
              $set: {
                failedLoginAttempts: 0,
                lockUntil: new Date(Date.now() + LOCK_MINUTES * 60000),
              },
            }
          : { $set: { failedLoginAttempts: attempts } },
      );
      return NextResponse.json(
        {
          error: locked
            ? `Too many failed attempts. Try again in ${LOCK_MINUTES} minutes.`
            : INVALID,
        },
        { status: locked ? 429 : 401 },
      );
    }

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          failedLoginAttempts: 0,
          lockUntil: null,
          lastLoginAt: new Date(),
        },
      },
    );

    const maxAge = remember ? LONG_SESSION_SECONDS : SHORT_SESSION_SECONDS;
    const token = await createSessionToken(
      {
        sub: String(user._id),
        email: user.email,
        name: user.name,
        role: "admin",
      },
      maxAge,
    );

    const res = NextResponse.json({
      user: { id: String(user._id), name: user.name, email: user.email },
    });
    res.cookies.set(
      SESSION_COOKIE,
      token,
      sessionCookieOptions(remember ? maxAge : null),
    );
    return res;
  } catch (err) {
    console.error("[auth/login]", err);
    return NextResponse.json(
      { error: "Couldn't sign you in. Try again in a moment." },
      { status: 500 },
    );
  }
}
