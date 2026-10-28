import { createHmac, timingSafeEqual } from "node:crypto";

export type ScenarioConfig = {
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

const DEV_SECRET = "local-development-only-change-me-before-deploying-2026";

function secret(name: string): string {
  const value = process.env[name];
  if (value) return value;
  if (process.env.NODE_ENV !== "production") return DEV_SECRET + name;
  throw new Error(`${name} must be configured in the Vercel project environment variables.`);
}

function sign(payload: string, key: string): string {
  return createHmac("sha256", key).update(payload).digest("base64url");
}

export function createScenarioToken(config: ScenarioConfig): string {
  const payload = Buffer.from(JSON.stringify({
    ...config,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
  })).toString("base64url");
  return `${payload}.${sign(payload, secret("DEMO_SCENARIO_SECRET"))}`;
}

export function verifyScenarioToken(token: string): ScenarioConfig | null {
  if (!token || token.length > 3000) return null;
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return null;
  const expected = sign(payload, secret("DEMO_SCENARIO_SECRET"));
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!Number.isInteger(data.exp) || data.exp < Math.floor(Date.now() / 1000)) return null;
    if (typeof data.csp !== "boolean" || typeof data.nosniff !== "boolean" ||
        typeof data.referrerPolicy !== "boolean" || typeof data.corsWildcard !== "boolean" ||
        typeof data.debugExposure !== "boolean" || typeof data.permissionsPolicy !== "boolean" ||
        typeof data.frameOptions !== "boolean" || typeof data.cookieFlags !== "boolean" ||
        typeof data.cachePolicy !== "boolean" || typeof data.serverBanner !== "boolean" ||
        typeof data.scenarioName !== "string") return null;
    return {
      csp: data.csp,
      nosniff: data.nosniff,
      referrerPolicy: data.referrerPolicy,
      corsWildcard: data.corsWildcard,
      debugExposure: data.debugExposure,
      permissionsPolicy: data.permissionsPolicy,
      frameOptions: data.frameOptions,
      cookieFlags: data.cookieFlags,
      cachePolicy: data.cachePolicy,
      serverBanner: data.serverBanner,
      scenarioName: data.scenarioName.slice(0, 80)
    };
  } catch {
    return null;
  }
}

export function createAdminCookieToken(): string {
  const payload = Buffer.from(JSON.stringify({
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
    role: "admin"
  })).toString("base64url");
  return `${payload}.${sign(payload, secret("DEMO_SESSION_SECRET"))}`;
}

export function isValidAdminToken(token?: string): boolean {
  if (!token || token.length > 2000) return false;
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return false;
  const expected = sign(payload, secret("DEMO_SESSION_SECRET"));
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return data.role === "admin" && Number.isInteger(data.exp) && data.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}
