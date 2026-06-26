import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * Generates a short-lived JWT Access Token.
 * Contains user identifier and role.
 */
export const generateAccessToken = (userId: string, role: string): string => {
  return jwt.sign(
    { sub: userId, role },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN as any }
  );
};

/**
 * Generates a long-lived JWT Refresh Token.
 * Contains only the user identifier.
 */
export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { sub: userId },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN as any }
  );
};
