import "server-only";

export type LabConfig = {
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

export const defaultLabConfig: LabConfig = {
  csp: false,
  nosniff: false,
  referrerPolicy: false,
  corsWildcard: true,
  debugExposure: true,
  permissionsPolicy: false,
  frameOptions: false,
  cookieFlags: false,
  cachePolicy: false,
  serverBanner: true,
  scenarioName: "Vulnerable baseline",
};

function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, "");
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("Configure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in the deployment environment.");
  return { url, token };
}

async function redisCommand<T>(command: unknown[]): Promise<T> {
  const { url, token } = redisConfig();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("The persistent configuration store request failed.");
  const result = await response.json() as { result?: T; error?: string };
  if (result.error) throw new Error("The persistent configuration store rejected the request.");
  return result.result as T;
}

export async function readLabConfig(): Promise<LabConfig> {
  const stored = await redisCommand<string | null>(["GET", "cipherguard:active-config"]);
  if (!stored) return defaultLabConfig;
  let parsed: unknown;
  try {
    parsed = JSON.parse(stored);
  } catch {
    return defaultLabConfig;
  }
  if (!isLabConfig(parsed)) return defaultLabConfig;
  return parsed;
}

export async function saveLabConfig(config: LabConfig): Promise<void> {
  await redisCommand<string>(["SET", "cipherguard:active-config", JSON.stringify(config)]);
}

export function isLabConfig(value: unknown): value is LabConfig {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  const booleanKeys = ["csp", "nosniff", "referrerPolicy", "corsWildcard", "debugExposure", "permissionsPolicy", "frameOptions", "cookieFlags", "cachePolicy", "serverBanner"];
  return booleanKeys.every((key) => typeof item[key] === "boolean") &&
    typeof item.scenarioName === "string" && item.scenarioName.length <= 80;
}
