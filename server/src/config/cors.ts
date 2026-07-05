import { env } from './env.js';

// Clean the CLIENT_URL to ensure no trailing slash is sent, avoiding CORS mismatches
const cleanOrigin = env.CLIENT_URL.endsWith('/') 
  ? env.CLIENT_URL.slice(0, -1) 
  : env.CLIENT_URL;

/**
 * CORS (Cross-Origin Resource Sharing) configuration options.
 */
export const corsOptions = {
  origin: cleanOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-guest-id'],
};
