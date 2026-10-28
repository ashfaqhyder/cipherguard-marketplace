import { NextRequest, NextResponse } from "next/server";
import { createAdminCookieToken } from "@/lib/scenario";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const expected = process.env.DEMO_ADMIN_PASSWORD;
  if (!expected && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Admin login is not configured. Set DEMO_ADMIN_PASSWORD in the deployment environment." }, { status: 503 });
  }
  let body: { password?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (typeof body.password !== "string" || body.password.length > 200) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }
  const actual = expected ?? "local-demo-password-change-me";
  if (body.password !== actual) return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });

  try {
    const token = createAdminCookieToken();
    const response = NextResponse.json({ ok: true });
    response.cookies.set("cg_demo_admin", token, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict",
      path: "/", maxAge: 60 * 60 * 8
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Admin session is not configured. Check environment secrets." }, { status: 503 });
  }
}
