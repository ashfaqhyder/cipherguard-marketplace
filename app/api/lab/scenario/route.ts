import { NextRequest, NextResponse } from "next/server";
import { createScenarioToken, isValidAdminToken, type ScenarioConfig } from "@/lib/scenario";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isValidAdminToken(request.cookies.get("cg_demo_admin")?.value)) {
    return NextResponse.json({ error: "Administrator session required." }, { status: 401 });
  }
  let body: Partial<ScenarioConfig>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
  const keys: (keyof ScenarioConfig)[] = ["csp", "nosniff", "referrerPolicy", "corsWildcard", "debugExposure", "permissionsPolicy", "frameOptions", "cookieFlags", "cachePolicy", "serverBanner"];
  if (keys.some((key) => typeof body[key] !== "boolean")) {
    return NextResponse.json({ error: "Scenario contains invalid controls." }, { status: 400 });
  }
  const config: ScenarioConfig = {
    csp: body.csp as boolean,
    nosniff: body.nosniff as boolean,
    referrerPolicy: body.referrerPolicy as boolean,
    corsWildcard: body.corsWildcard as boolean,
    debugExposure: body.debugExposure as boolean,
    permissionsPolicy: body.permissionsPolicy as boolean,
    frameOptions: body.frameOptions as boolean,
    cookieFlags: body.cookieFlags as boolean,
    cachePolicy: body.cachePolicy as boolean,
    serverBanner: body.serverBanner as boolean,
    scenarioName: typeof body.scenarioName === "string" ? body.scenarioName.slice(0, 80) : "Custom scenario"
  };
  try {
    const token = createScenarioToken(config);
    const configuredBase = process.env.SITE_URL?.replace(/\/$/, "");
    const configuredBaseIsLocal = !!configuredBase && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(configuredBase);
    // Never return a localhost target URL from a production deployment.
    const base = process.env.NODE_ENV === "production" && configuredBaseIsLocal
      ? request.nextUrl.origin
      : configuredBase || request.nextUrl.origin;
    const targetUrl = `${base}/api/target?scenario=${encodeURIComponent(token)}`;
    return NextResponse.json({ targetUrl, expiresInSeconds: 604800 });
  } catch {
    return NextResponse.json({ error: "Scenario signing is not configured. Set DEMO_SCENARIO_SECRET." }, { status: 503 });
  }
}
