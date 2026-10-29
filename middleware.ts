import { NextRequest, NextResponse } from "next/server";

type ActiveConfig = {
  csp: boolean;
  nosniff: boolean;
  referrerPolicy: boolean;
  corsWildcard: boolean;
  debugExposure: boolean;
  permissionsPolicy: boolean;
  frameOptions: boolean;
  cookieFlags: boolean;
  cachePolicy: boolean;
  serverBanner: boolean;
  scenarioName: string;
};

async function getActiveConfig(): Promise<ActiveConfig | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, "");
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(["GET", "cipherguard:active-config"]),
      cache: "no-store",
    });
    if (!response.ok) return null;
    const payload = await response.json() as { result?: string | null };
    if (!payload.result) return null;
    const value = JSON.parse(payload.result) as Partial<ActiveConfig>;
    const keys: (keyof Omit<ActiveConfig, "scenarioName">)[] = [
      "csp", "nosniff", "referrerPolicy", "corsWildcard", "debugExposure",
      "permissionsPolicy", "frameOptions", "cookieFlags", "cachePolicy", "serverBanner"
    ];
    if (!keys.every((key) => typeof value[key] === "boolean") ||
        typeof value.scenarioName !== "string") return null;
    return value as ActiveConfig;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const path = request.nextUrl.pathname;

  // /api/target returns a JSON diagnostic document and applies its own headers.
  // The public site routes below are the stable target that Valorynn can scan.
  if (path !== "/api/target") {
    const config = await getActiveConfig();

    if (config) {
      response.headers.delete("Content-Security-Policy");
      response.headers.delete("X-Content-Type-Options");
      response.headers.delete("Referrer-Policy");
      response.headers.delete("Access-Control-Allow-Origin");
      response.headers.delete("Permissions-Policy");
      response.headers.delete("X-Frame-Options");
      response.headers.delete("X-Demo-Server");
      response.headers.delete("X-Demo-Diagnostics");

      if (config.csp) response.headers.set("Content-Security-Policy", "default-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'");
      if (config.nosniff) response.headers.set("X-Content-Type-Options", "nosniff");
      if (config.referrerPolicy) response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
      if (config.corsWildcard) response.headers.set("Access-Control-Allow-Origin", "*");
      if (config.permissionsPolicy) response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
      if (config.frameOptions) response.headers.set("X-Frame-Options", "DENY");
      if (config.serverBanner) response.headers.set("X-Demo-Server", "training-server/0.9 (simulated)");
      if (config.debugExposure) response.headers.set("X-Demo-Diagnostics", "SIMULATED_DEBUG");
      response.headers.set("X-Demo-Scenario", config.scenarioName);
      response.headers.set("Cache-Control", "no-store, max-age=0");

      if (config.cookieFlags) {
        response.cookies.set("valorynn_lab_demo", "training-only", {
          path: "/", httpOnly: true, secure: true, sameSite: "strict", maxAge: 60
        });
      } else {
        response.cookies.set("valorynn_lab_demo", "training-only", {
          path: "/", httpOnly: false, secure: false, sameSite: "lax", maxAge: 60
        });
      }
    } else {
      // Safe fallback if the shared configuration store is not configured yet.
      response.headers.set("X-Content-Type-Options", "nosniff");
      response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
      response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    }
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
