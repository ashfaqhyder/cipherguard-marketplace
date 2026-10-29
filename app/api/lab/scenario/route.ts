import { NextRequest, NextResponse } from "next/server";
import { isValidAdminToken } from "@/lib/scenario";
import { isLabConfig, saveLabConfig } from "@/lib/lab-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!isValidAdminToken(request.cookies.get("cg_demo_admin")?.value)) {
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
      targetUrl: `${request.nextUrl.origin}/api/target`,
      scenarioName: body.scenarioName,
      message: "Active configuration saved. The permanent target URL now serves this configuration.",
    });
  } catch {
    return NextResponse.json({
      error: "Persistent configuration storage is not configured or unavailable. Configure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in Vercel."
    }, { status: 503 });
  }
}
