import { NextRequest, NextResponse } from "next/server";
import { isValidAdminToken } from "@/lib/scenario";
import { defaultLabConfig, isLabConfig, readLabConfig, saveLabConfig } from "@/lib/lab-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAdmin(request: NextRequest) {
  return isValidAdminToken(request.cookies.get("cg_demo_admin")?.value);
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Administrator session required." }, { status: 401 });
  }
  try {
    const config = await readLabConfig();
    return NextResponse.json({
      config: isLabConfig(config) ? config : defaultLabConfig,
      targetUrl: request.nextUrl.origin,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({
      error: "Persistent configuration storage is not configured or unavailable. Configure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in Vercel."
    }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Administrator session required." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!isLabConfig(body)) {
    return NextResponse.json({ error: "Scenario contains invalid controls." }, { status: 400 });
  }

  try {
    await saveLabConfig(body);
    return NextResponse.json({
      config: body,
      targetUrl: request.nextUrl.origin,
      message: "Active configuration saved. The permanent target URL now serves this configuration.",
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({
      error: "Persistent configuration storage is not configured or unavailable. Configure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in Vercel."
    }, { status: 503 });
  }
}
