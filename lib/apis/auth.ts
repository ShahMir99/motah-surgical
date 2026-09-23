import "server-only";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  verifySessionToken,
  type SessionPayload,
} from "@/lib/session";

export async function requireAdmin(
  req: NextRequest,
): Promise<NextResponse | null> {
  const session = await verifySessionToken(
    req.cookies.get(SESSION_COOKIE)?.value,
  );
  if (!session) {
    return NextResponse.json(
      { error: "Your session has ended. Sign in again." },
      { status: 401 },
    );
  }
  return null;
}

export async function getCurrentAdmin(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}
