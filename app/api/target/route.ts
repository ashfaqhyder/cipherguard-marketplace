import { NextResponse } from "next/server";
import { readLabConfig } from "@/lib/lab-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  let config;
  try {
    config = await readLabConfig();
  } catch {
    return NextResponse.json({
      error: "The active security configuration is temporarily unavailable.",
      help: "Configure the persistent lab store in the deployment environment."
    }, {
      status: 503,
      headers: { "Cache-Control": "no-store, max-age=0" }
    });
  }

  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "X-Demo-Target": "CipherGuard-Security-Lab",
    "X-Demo-Scenario": config.scenarioName,
    "Cache-Control": config.cachePolicy ? "no-store, max-age=0" : "public, max-age=60"
  });
  if (config.csp) headers.set("Content-Security-Policy", "default-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'");
  if (config.nosniff) headers.set("X-Content-Type-Options", "nosniff");
  if (config.referrerPolicy) headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  if (config.corsWildcard) headers.set("Access-Control-Allow-Origin", "*");
  if (config.permissionsPolicy) headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (config.frameOptions) headers.set("X-Frame-Options", "DENY");
  if (config.serverBanner) headers.set("X-Demo-Server", "training-server/0.9 (simulated)");
  if (config.cookieFlags) headers.append("Set-Cookie", "valorynn_lab_demo=training-only; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=60");
  else headers.append("Set-Cookie", "valorynn_lab_demo=training-only; Path=/; Max-Age=60");

  const body = {
    application: "CipherGuard demo marketplace",
    message: "This is a controlled security-testing target. No real user data or malware functionality is present.",
    scenario: config.scenarioName,
    controls: {
      contentSecurityPolicy: config.csp ? "enabled" : "omitted",
      xContentTypeOptions: config.nosniff ? "enabled" : "omitted",
      referrerPolicy: config.referrerPolicy ? "enabled" : "omitted",
      wildcardCors: config.corsWildcard,
      debugExposure: config.debugExposure,
      permissionsPolicy: config.permissionsPolicy ? "enabled" : "omitted",
      frameOptions: config.frameOptions ? "enabled" : "omitted",
      cookieFlags: config.cookieFlags ? "secure demo cookie flags enabled" : "demo cookie flags intentionally omitted",
      cachePolicy: config.cachePolicy ? "no-store" : "public max-age=60",
      serverBanner: config.serverBanner
    },
    ...(config.debugExposure ? {
      demoDiagnostics: {
        mode: "SIMULATED_DEBUG",
        buildLabel: "cipherguard-demo-build",
        note: "Fictional diagnostic marker for scanner demonstrations; no secrets or internal environment values are exposed."
      }
    } : {})
  };
  // Vercel/CDN caching must not freeze a previous configuration at the permanent target URL.
  headers.set("Cache-Control", "no-store, max-age=0");
  return new NextResponse(JSON.stringify(body, null, 2), { status: 200, headers });
}
