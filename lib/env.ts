import { headers } from "next/headers";

/**
 * Required environment variables for the application to function properly
 */
const REQUIRED_ENV_VARS = {
  AUTH_SECRET: "NextAuth JWT encryption secret - generate with: openssl rand -base64 32",
  AUTH_TRUST_HOST: "Set to 'true' to allow trusted hosts for NextAuth",
} as const;

type EnvVar = keyof typeof REQUIRED_ENV_VARS;

let hasCheckedEnv = false;
let missingVars: string[] = [];

/**
 * Validates that all required environment variables are set
 * Returns true if all env vars are present, false otherwise
 */
export function validateEnv(): boolean {
  if (hasCheckedEnv) {
    return missingVars.length === 0;
  }

  missingVars = [];

  for (const [key, description] of Object.entries(REQUIRED_ENV_VARS)) {
    if (!process.env[key]) {
      missingVars.push(key);
    }
  }

  hasCheckedEnv = true;

  if (missingVars.length > 0) {
    console.error("❌ Missing required environment variables:");
    for (const missing of missingVars) {
      console.error(`   - ${missing}: ${REQUIRED_ENV_VARS[missing as EnvVar]}`);
    }
  }

  return missingVars.length === 0;
}

/**
 * Returns the list of missing environment variables
 */
export function getMissingEnvVars(): string[] {
  validateEnv();
  return missingVars;
}

/**
 * Returns true if the application is properly configured
 */
export function isAppConfigured(): boolean {
  return validateEnv();
}

/**
 * Returns environment configuration status for client components
 * Note: This should only be called from server components
 */
export function getEnvConfigStatus() {
  return {
    isConfigured: isAppConfigured(),
    missingVars: getMissingEnvVars(),
  };
}
