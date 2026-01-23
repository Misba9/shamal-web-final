import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  port: number;
  nodeEnv: string;
  jwtSecret: string;
  jwtRefreshSecret: string;
  jwtExpiresIn: string;
  jwtRefreshExpiresIn: string;
  mongodbUri: string;
  frontendUrl: string;
  adminUrl: string;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || defaultValue!;
}

export const config: EnvConfig = {
  port: parseInt(getEnvVar('PORT', '3000'), 10),
  nodeEnv: getEnvVar('NODE_ENV', 'development'),
  jwtSecret: getEnvVar('JWT_SECRET', 'change-this-secret-key'),
  jwtRefreshSecret: getEnvVar('JWT_REFRESH_SECRET', 'change-this-refresh-secret-key'),
  jwtExpiresIn: getEnvVar('JWT_EXPIRES_IN', '15m'),
  jwtRefreshExpiresIn: getEnvVar('JWT_REFRESH_EXPIRES_IN', '7d'),
  mongodbUri: getEnvVar('MONGODB_URI', 'mongodb://localhost:27017/shamal-ascent'),
  frontendUrl: getEnvVar('FRONTEND_URL', 'http://localhost:8080'),
  adminUrl: getEnvVar('ADMIN_URL', 'http://localhost:5173'),
  rateLimitWindowMs: parseInt(getEnvVar('RATE_LIMIT_WINDOW_MS', '900000'), 10),
  rateLimitMaxRequests: parseInt(getEnvVar('RATE_LIMIT_MAX_REQUESTS', '100'), 10),
};
