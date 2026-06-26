import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

interface GoogleUserResult {
  email: string;
  name: string;
  googleId: string;
}

/**
 * Google OAuth Service.
 * Verifies the integrity of ID tokens received from the client.
 */
export const verifyGoogleCredential = async (credential: string): Promise<GoogleUserResult> => {
  if (!credential) {
    throw new ApiError(400, 'Google credential token is required.', 'BAD_REQUEST');
  }

  // Check if Google Client ID is configured
  const isGoogleConfigured = env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_ID !== 'replace_me';

  if (!isGoogleConfigured) {
    throw new ApiError(
      501,
      'Google OAuth is not configured on the server. Please provide GOOGLE_CLIENT_ID in environmental variables.',
      'OAUTH_NOT_CONFIGURED'
    );
  }

  // In production:
  // try {
  //   const { OAuth2Client } = await import('google-auth-library');
  //   const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
  //   const ticket = await client.verifyIdToken({
  //     idToken: credential,
  //     audience: env.GOOGLE_CLIENT_ID,
  //   });
  //   const payload = ticket.getPayload();
  //   if (!payload || !payload.sub || !payload.email || !payload.name) {
  //     throw new ApiError(401, 'Invalid Google ID token payload.', 'INVALID_CREDENTIALS');
  //   }
  //   return {
  //     email: payload.email,
  //     name: payload.name,
  //     googleId: payload.sub,
  //   };
  // } catch (err) {
  //   throw new ApiError(401, 'Google token verification failed.', 'INVALID_CREDENTIALS');
  // }

  // Return a controlled error instead of faking successful login with unverified data
  throw new ApiError(
    501,
    'Google OAuth package is not fully initialized. Complete integration on production environment.',
    'OAUTH_UNIMPLEMENTED'
  );
};

export default verifyGoogleCredential;
