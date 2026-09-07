import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
  AUTH_SECRET: z
    .string()
    .min(1, "AUTH_SECRET is required")
    .min(32, "AUTH_SECRET must be at least 32 characters"),
  RAWG_API_KEY: z.string().min(1, "RAWG_API_KEY is required for the catalog to work"),
  BLOB_READ_WRITE_TOKEN: z.string().optional(),
  // Google OAuth — optional. Set both to enable "Continue with Google"; without
  // them, only email/password login is available.
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),
  // Public base URL — only needed in production so OAuth callbacks resolve;
  // localhost is auto-detected.
  AUTH_URL: z.string().url().optional(),
});

function validateEnv() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const messages = Object.entries(errors)
      .map(([key, msgs]) => `  ${key}: ${msgs?.join("; ") || "unknown error"}`)
      .join("\n");
    throw new Error(`Environment validation failed:\n${messages}`);
  }
  return result.data;
}

export const env = validateEnv();
