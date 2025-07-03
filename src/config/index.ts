import dotenv from "dotenv";
import type ms from "ms";

dotenv.config();

const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URI: requireEnv("MONGO_URI"),
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  JWT_ACCESS_SECRET: requireEnv("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: requireEnv("JWT_REFRESH_SECRET"),
  ACCESS_TOKEN_EXPIRY: requireEnv("ACCESS_TOKEN_EXPIRY") as ms.StringValue,
  REFRESH_TOKEN_EXPIRY: requireEnv("REFRESH_TOKEN_EXPIRY") as ms.StringValue,
  WHITELIST_ADMINS_MAIL: process.env.WHITELIST_ADMINS_MAIL,
  defaultResLimit: 20,
  defaultResOffset: 0,
};

export default config;
