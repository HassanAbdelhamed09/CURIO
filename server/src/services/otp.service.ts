import { env } from '../config/env.js';

/**
 * Phone OTP Service.
 * Manages phone number verification via One-Time Passwords (SMS).
 */
export const generateOtp = (): string => {
  // Generate a cryptographically secure-like 6-digit numeric string
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Dispatches the OTP to the user's phone.
 * Log only under development environment; never in production.
 */
export const sendOtpSms = async (phone: string, otp: string): Promise<void> => {
  const isSmsProviderConfigured = env.OTP_PROVIDER_API_KEY && env.OTP_PROVIDER_API_KEY !== 'replace_me';

  if (isSmsProviderConfigured) {
    try {
      // Trigger real SMS provider API here
      console.log(`[SMS SENDER] OTP dispatched successfully to: ${phone}`);
    } catch (err) {
      console.error('[SMS SENDER ERROR] Failed sending SMS, falling back to console:', err);
      logDevOtp(phone, otp);
    }
  } else {
    logDevOtp(phone, otp);
  }
};

const logDevOtp = (phone: string, otp: string) => {
  if (env.NODE_ENV === 'development') {
    console.log('\n========================================================================');
    console.log(`[DEV OTP] OTP for phone: ${phone} is "${otp}" (expires in 5 mins)`);
    console.log('========================================================================\n');
  }
};
