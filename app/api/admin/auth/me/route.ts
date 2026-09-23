import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
  return NextResponse.json(
    { user: session ? { id: session.sub, name: session.name, email: session.email } : null },
    { headers: { "Cache-Control": "no-store" } }
  );
}