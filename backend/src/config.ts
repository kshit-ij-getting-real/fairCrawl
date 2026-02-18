import dotenv from 'dotenv';

dotenv.config();

const requiredVars = ['DATABASE_URL', 'JWT_SECRET'] as const;

export const assertRequiredEnv = () => {
  const missing = requiredVars.filter((name) => !process.env[name]);
  if (process.env.DEMO_MODE === "true" && !process.env.DEMO_SECRET) {
    missing.push("DEMO_SECRET" as (typeof requiredVars)[number]);
  }
  if (missing.length > 0) {
    throw new Error(`Missing required environment variable(s): ${missing.join(', ')}`);
  }
};

export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('Missing required environment variable: JWT_SECRET');
  }

  return secret;
};
