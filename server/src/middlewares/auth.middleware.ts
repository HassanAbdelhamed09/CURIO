import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../modules/users/user.model.js';
import { env } from '../config/env.js';

interface JwtPayload {
  sub: string;
  role: string;
}

/**
 * Production-ready Authentication Middleware.
 * Decodes, verifies JWT access tokens, and loads the active user session.
 */
export const auth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Access denied. Authentication token required.', 'UNAUTHORIZED');
  }

  const token = authHeader.split(' ')[1];

  try {
    // Decode and verify token
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
    
    // Retrieve user from database
    const user = await User.findById(decoded.sub);
    
    if (!user) {
      throw new ApiError(401, 'User account no longer exists.', 'UNAUTHORIZED');
    }

    // Check account status
    if (user.status === 'blocked') {
      throw new ApiError(403, 'This account has been blocked.', 'USER_BLOCKED');
    }

    if (user.status === 'deleted') {
      throw new ApiError(403, 'This account has been deleted.', 'USER_DELETED');
    }

    // Bind authenticated user to Request context
    req.user = user;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, 'Token has expired.', 'TOKEN_EXPIRED');
    }
    throw new ApiError(401, 'Invalid authentication token.', 'INVALID_TOKEN');
  }
});
