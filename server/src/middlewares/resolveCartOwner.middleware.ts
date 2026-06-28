import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../modules/users/user.model.js';
import { env } from '../config/env.js';

interface JwtPayload {
  sub: string;
  role: string;
}

/**
 * Middleware to resolve the Cart Owner (either user ID or guest ID).
 * Does not block unauthenticated requests, enabling seamless guest cart flows.
 */
export const resolveCartOwner = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  let userId: string | undefined;

  // 1. Attempt token verification (Soft Auth)
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
      const user = await User.findById(decoded.sub);
      
      if (user && user.status === 'active') {
        req.user = user;
        userId = user._id.toString();
      }
    } catch (err) {
      // Soft-auth: ignore token errors and fall back to guest ID
    }
  }

  // 2. Resolve owner details
  if (userId) {
    req.cartOwner = { userId };
    next();
  } else {
    // Check for guest identifier in headers or cookies
    let guestId = (req.headers['x-guest-id'] as string) || req.cookies?.guestId;

    if (!guestId) {
      // Generate a new guest session UUID
      guestId = crypto.randomUUID();
      // Set the guestId cookie (valid for 30 days)
      res.cookie('guestId', guestId, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: false, // Let client JS access it if needed
        sameSite: 'lax',
        secure: env.NODE_ENV === 'production',
      });
    }

    // Expose the guest ID in response headers so the client can store it
    res.setHeader('x-guest-id', guestId);
    res.setHeader('Access-Control-Expose-Headers', 'x-guest-id, Authorization');

    req.cartOwner = { guestId };
    next();
  }
};

export default resolveCartOwner;
