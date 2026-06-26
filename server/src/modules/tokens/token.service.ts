import crypto from 'crypto';
import { Token, IToken } from './token.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { Types } from 'mongoose';

export class TokenService {
  /**
   * Hashes a raw token string using SHA-256.
   * Ensures raw tokens are never stored in the database.
   */
  public hashToken(rawToken: string): string {
    return crypto.createHash('sha256').update(rawToken).digest('hex');
  }

  /**
   * Creates a new token record in the database.
   * @returns The RAW token string (to be emailed or texted; NEVER stored)
   */
  public async createToken(
    userId: string,
    type: 'refresh' | 'email_verification' | 'password_reset' | 'phone_otp',
    expiresInMs: number,
    customRawToken?: string
  ): Promise<string> {
    // Generate a secure random token if no custom one is provided (e.g., OTPs)
    const rawToken = customRawToken || crypto.randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawToken);

    await Token.create({
      userId: new Types.ObjectId(userId),
      type,
      tokenHash,
      expiresAt: new Date(Date.now() + expiresInMs),
    });

    return rawToken;
  }

  /**
   * Consumes a token, verifying its type, expiry, and existence.
   * Marks the token as used (or deletes it) and returns the associated userId.
   */
  public async verifyAndConsumeToken(
    rawToken: string,
    type: 'refresh' | 'email_verification' | 'password_reset' | 'phone_otp'
  ): Promise<string> {
    const tokenHash = this.hashToken(rawToken);
    
    const tokenRecord = await Token.findOne({
      tokenHash,
      type,
      expiresAt: { $gt: new Date() },
      usedAt: { $exists: false },
    });

    if (!tokenRecord) {
      throw new ApiError(400, 'Invalid or expired secure token.', 'INVALID_TOKEN');
    }

    // Mark as used
    tokenRecord.usedAt = new Date();
    await tokenRecord.save();

    // Optionally delete it to save space (since it has been consumed)
    await Token.deleteOne({ _id: tokenRecord._id });

    return tokenRecord.userId.toString();
  }

  /**
   * Invalidates all active tokens of a specific type for a user (e.g., on password changes).
   */
  public async invalidateUserTokens(userId: string, type: string): Promise<void> {
    await Token.deleteMany({ userId: new Types.ObjectId(userId), type });
  }
}

export const tokenService = new TokenService();
export default tokenService;
